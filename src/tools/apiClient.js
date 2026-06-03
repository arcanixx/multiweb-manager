// =============================================================================
// FILE: apiClient.js
// PATH: src/tools/apiClient.js
// VERSION: 0.0.3
// PURPOSE: Wrapper HTTP do testowania API – wykonuje żądania z obsługą timeout
//          (AbortController) i automatycznym retry z exponential backoff (3 próby).
//          apiRequest() zwraca { status, headers, body } dla MiniPostman.
//          apiFetch/apiGet/apiPost to niskopoziomowe helpery z retry dla innych narzędzi.
// FUNCTIONS: apiFetch, apiGet, apiPost, apiRequest
// DEPENDS ON: logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { logDebug, logInfo, logWarn, logError } from '../utils/logger.js';

// ─── Constants ────────────────────────────────────────────────────────────────
const DEFAULT_TIMEOUT_MS  = 10_000; // 10s per attempt
const DEFAULT_RETRY_COUNT = 3;
const DEFAULT_BACKOFF_MS  = 500;    // base delay, doubles each attempt

// HTTP 4xx codes where retry makes no sense (client error — final)
const NO_RETRY_CODES = new Set([400, 401, 403, 404, 409, 422, 429]);

// ─── sleep() – resolves after given ms ────────────────────────────────────────
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── calcBackoff() – exponential backoff with ±10% jitter ─────────────────────
//   attempt 0 → ~500ms, attempt 1 → ~1000ms, attempt 2 → ~2000ms
//   @param {number} attempt - 0-based attempt index
//   @param {number} baseMs
//   @returns {number} delay in ms
function calcBackoff(attempt, baseMs) {
  const exp    = baseMs * Math.pow(2, attempt);
  const jitter = exp * 0.1 * (Math.random() * 2 - 1);
  return Math.round(exp + jitter);
}

// =============================================================================
// apiFetch() – low-level fetch wrapper with timeout + retry
//   @param {string} url
//   @param {RequestInit} options
//   @param {object} config
//   @param {number} config.timeoutMs
//   @param {number} config.retryCount
//   @param {number} config.backoffMs
//   @returns {Promise<Response>} – raw fetch Response
//   @throws {Error} – when all attempts fail
// =============================================================================
export async function apiFetch(url, options = {}, config = {}) {
  const {
    timeoutMs  = DEFAULT_TIMEOUT_MS,
    retryCount = DEFAULT_RETRY_COUNT,
    backoffMs  = DEFAULT_BACKOFF_MS,
  } = config;

  let lastError = null;

  for (let attempt = 0; attempt < retryCount; attempt++) {
    const controller = new AbortController();
    const timerId    = setTimeout(() => controller.abort(), timeoutMs);

    try {
      logInfo('engine', `apiFetch: attempt ${attempt + 1}/${retryCount} → ${options.method || 'GET'} ${url}`);

      const response = await fetch(url, { ...options, signal: controller.signal });

      // Nie rzucamy na 4xx — caller sam sprawdza response.ok
      if (NO_RETRY_CODES.has(response.status)) {
        logInfo('engine', `apiFetch: status ${response.status} — no retry`);
        return response;
      }

      logInfo('engine', `apiFetch: status ${response.status} for ${url}`);
      return response;

    } catch (err) {
      const isTimeout = err.name === 'AbortError';
      lastError = isTimeout
        ? new Error(`apiFetch: timeout after ${timeoutMs}ms (attempt ${attempt + 1}/${retryCount})`)
        : err;

      logWarn('engine', `apiFetch: ${isTimeout ? 'timeout' : 'network error'} on attempt ${attempt + 1}/${retryCount}`, {
        url,
        message: err.message,
      });

      const isLastAttempt = attempt === retryCount - 1;
      if (isLastAttempt) break;

      const delay = calcBackoff(attempt, backoffMs);
      logInfo('engine', `apiFetch: waiting ${delay}ms before next attempt...`);
      await sleep(delay);

    } finally {
      clearTimeout(timerId);
    }
  }

  logError('engine', `apiFetch: all ${retryCount} attempts failed for ${url}`, lastError?.message);
  throw lastError ?? new Error(`apiFetch: unknown error for ${url}`);
}

// ─── apiGet() – GET shorthand ─────────────────────────────────────────────────
//   @param {string} url
//   @param {Record<string,string>} headers
//   @param {object} config – retry/timeout options (see apiFetch)
//   @returns {Promise<Response>}
export async function apiGet(url, headers = {}, config = {}) {
  return apiFetch(url, { method: 'GET', headers }, config);
}

// ─── apiPost() – POST shorthand with JSON serialization ───────────────────────
//   @param {string} url
//   @param {unknown} body
//   @param {Record<string,string>} headers
//   @param {object} config – retry/timeout options (see apiFetch)
//   @returns {Promise<Response>}
export async function apiPost(url, body = {}, headers = {}, config = {}) {
  return apiFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  }, config);
}

// =============================================================================
// apiRequest() – high-level wrapper for MiniPostman
//   Executes HTTP request and returns parsed { status, headers, body }.
//   Supports timeout + retry via apiFetch internally.
//
//   @param {string} url
//   @param {string} method   – HTTP method (GET, POST, PUT, DELETE, …)
//   @param {object} headers  – request headers
//   @param {string} body     – raw request body (ignored for GET/HEAD)
//   @returns {Promise<{ status: number, headers: object, body: string }>}
//   @throws {Error} – propagates fetch/timeout errors
// =============================================================================
export async function apiRequest(url, method, headers, body) {
  try {
    logDebug('tools', `apiClient.apiRequest: ${method} ${url}`);

    const response = await apiFetch(url, {
      method,
      headers,
      body: method !== 'GET' && method !== 'HEAD' ? body : undefined,
    });

    const result = {
      status:  response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body:    await response.text(),
    };

    logDebug('tools', `apiClient.apiRequest: response status ${result.status}`);
    return result;

  } catch (err) {
    logError('tools', 'apiClient.apiRequest failed', err);
    throw err;
  }
}

// =============================================================================
// END OF FILE
// =============================================================================