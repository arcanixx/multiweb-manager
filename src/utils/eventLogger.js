// =============================================================================
// FILE: eventLogger.js
// PATH: src/utils/eventLogger.js
// VERSION: 0.0.3
// PURPOSE: Dziennik zdarzeń aplikacji — zapisuje akcje użytkownika i systemu do userData/logs/events.log w formacie NDJSON. Różny od logger.js (konsola debug) i logWriter.js (błędy testów). Implementuje ARCH_REQ-044.
// FUNCTIONS: logEvent
// DEPENDS ON: loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { logDebug, logWarn } from './loggerRenderer.js';

// ─── KONFIGURACJA ────────────────────────────────────────────────────────────
const MAX_PARAMS_LENGTH = 500;  // Maksymalna długość zserializowanych params (chars)

// Klucze wyłączone z logowania — nigdy nie logujemy wrażliwych danych
const BLACKLISTED_PARAM_KEYS = new Set([
  'password', 'token', 'cookie', 'key', 'secret',
  'apiKey', 'api_key', 'accessToken', 'access_token',
  'auth', 'authorization', 'credentials',
]);

// Cache ustawień — ładowane przy pierwszym wywołaniu
let _eventLogEnabled = null;

// ─── _isEnabled() – sprawdza czy logowanie zdarzeń jest włączone
//   Lazy-load z electronAPI — przy pierwszym wywołaniu ładuje ustawienia.
//   @returns {Promise<boolean>}
async function _isEnabled() {
  // Jeśli już sprawdzono — używaj cache
  if (_eventLogEnabled !== null) return _eventLogEnabled;

  try {
    const res = await window.electronAPI?.invoke?.('settings:get');
    _eventLogEnabled = res?.ok ? (res.data?.eventLogEnabled === true) : false;
  } catch {
    _eventLogEnabled = false;
  }
  return _eventLogEnabled;
}

// Nasłuchuj zmian ustawień — inwaliduj cache gdy eventLogEnabled się zmieni
if (typeof window !== 'undefined') {
  window.addEventListener('mwm:settings-changed', (e) => {
    if ('eventLogEnabled' in (e.detail || {})) {
      _eventLogEnabled = e.detail.eventLogEnabled === true;
      logDebug('store', `eventLogger: eventLogEnabled = ${_eventLogEnabled}`);
    }
  });
}

// ─── _sanitizeParams() – czyści params przed zapisem
//   Shallow copy z pominięciem blacklistowanych kluczy + limit długości.
//   @param {Object|*} params – dowolny obiekt parametrów
//   @returns {Object} – bezpieczny obiekt do zapisu
function _sanitizeParams(params) {
  if (!params || typeof params !== 'object') return {};

  const clean = {};
  for (const [k, v] of Object.entries(params)) {
    if (BLACKLISTED_PARAM_KEYS.has(k.toLowerCase())) continue;
    clean[k] = v;
  }

  // Limit długości — stringify i trim jeśli za długi
  try {
    const serialized = JSON.stringify(clean);
    if (serialized.length > MAX_PARAMS_LENGTH) {
      return { _truncated: true, _preview: serialized.slice(0, MAX_PARAMS_LENGTH) };
    }
  } catch {
    return { _error: 'not_serializable' };
  }

  return clean;
}

// ─── logEvent() – zapisuje zdarzenie do dziennika aplikacji
//   Fire-and-forget — nie blokuje UI, nie rzuca wyjątków do callera.
//   @param {string} module  – nazwa modułu (np. 'TaskPanel', 'Sidebar')
//   @param {string} fn      – nazwa funkcji (np. 'handleSaveTask')
//   @param {string} action  – identyfikator zdarzenia snake_case (np. 'task_created')
//   @param {Object} params  – parametry zdarzenia (płytkie, bez wrażliwych danych)
//   @param {string} source  – 'user' | 'system' | 'ipc'
//   @returns {void}         – celowo nie async/await w API (fire-and-forget)
export function logEvent(module, fn, action, params = {}, source = 'user') {
  // Fire-and-forget — błędy w logowaniu nie mogą przerywać flow aplikacji
  _writeEvent(module, fn, action, params, source).catch(() => {});
}

// ─── _writeEvent() – wewnętrzna async implementacja zapisu
async function _writeEvent(module, fn, action, params, source) {
  try {
    if (!(await _isEnabled())) return;

    const entry = {
      ts:     Date.now(),
      module: String(module || 'unknown'),
      fn:     String(fn     || 'unknown'),
      action: String(action || 'unknown'),
      params: _sanitizeParams(params),
      source: ['user', 'system', 'ipc'].includes(source) ? source : 'user',
    };

    logDebug('store', `eventLogger: ${module}.${fn} → ${action}`);

    await window.electronAPI?.invoke?.('events:append', entry);
  } catch (err) {
    logWarn('store', 'eventLogger: write failed', err?.message);
  }
}