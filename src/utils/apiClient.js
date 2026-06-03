// =============================================================================
// FILE:       apiClient.js
// PATH:       src/utils/apiClient.js
// VERSION:    0.0.3
// PURPOSE:    Klient HTTP z obsługą timeout (AbortController) oraz automatycznym
//             retry z wykładniczym backoffem (3 próby). Lightweight — bez zewnętrznych
//             bibliotek. Używany przez narzędzia (MiniPostman, ImageTools, RemoveBg).
// FUNCTIONS:  apiFetch, apiGet, apiPost
// DEPENDS ON: logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { logInfo, logWarn, logError } from './logger.js';

// ─── Stałe domyślne ────────────────────────────────────────────────────────────
const DOMYSLNY_TIMEOUT_MS   = 10_000; // 10 sekund na jedno wywołanie
const DOMYSLNA_LICZBA_PROB  = 3;      // maksymalna liczba prób
const DOMYSLNY_BACKOFF_MS   = 500;    // bazowe opóźnienie (×2^próba)

// ─── Kody HTTP, przy których NIE robimy retry ──────────────────────────────────
// Błędy klienta (4xx) są ostateczne — retry nie pomoże
const KODY_BEZ_RETRY = new Set([400, 401, 403, 404, 409, 422, 429]);

// ─── sleep() – pomocnicza, zwraca Promise rozwiązywane po `ms` milisekundach ──
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── obliczOpóźnienie() – wykładniczy backoff z małym jitterem ────────────────
//   Próba 1 → ~500ms, próba 2 → ~1000ms, próba 3 → ~2000ms
//   Jitter (±10%) zapobiega synchronicznym burstom żądań
//   @param {number} próba – numer próby (0-based)
//   @param {number} bazaMs – bazowe opóźnienie w ms
//   @returns {number} opóźnienie w ms
function obliczOpóźnienie(próba, bazaMs) {
  const wykładniczy = bazaMs * Math.pow(2, próba);
  const jitter      = wykładniczy * 0.1 * (Math.random() * 2 - 1); // ±10%
  return Math.round(wykładniczy + jitter);
}

// =============================================================================
// apiFetch() – główna funkcja klienta HTTP
//   Wykonuje żądanie `fetch` z timeoutem i automatycznym retry.
//
//   @param {string} url                  – adres URL
//   @param {RequestInit} opcje           – opcje fetch (method, headers, body…)
//   @param {object} konfig               – konfiguracja retry/timeout
//   @param {number} konfig.timeoutMs     – timeout w ms (domyślnie 10 000)
//   @param {number} konfig.liczbaProb    – maks. liczba prób (domyślnie 3)
//   @param {number} konfig.backoffMs     – bazowy backoff w ms (domyślnie 500)
//   @returns {Promise<Response>}         – odpowiedź fetch (surowa)
//   @throws {Error}                      – gdy wszystkie próby zawiodą
// =============================================================================
export async function apiFetch(url, opcje = {}, konfig = {}) {
  const {
    timeoutMs  = DOMYSLNY_TIMEOUT_MS,
    liczbaProb = DOMYSLNA_LICZBA_PROB,
    backoffMs  = DOMYSLNY_BACKOFF_MS,
  } = konfig;

  let ostatniBlad = null;

  for (let próba = 0; próba < liczbaProb; próba++) {
    // Każda próba dostaje własny AbortController — clean slate
    const kontroler = new AbortController();
    const timerId   = setTimeout(() => kontroler.abort(), timeoutMs);

    try {
      logInfo('engine', `apiFetch: próba ${próba + 1}/${liczbaProb} → ${opcje.method || 'GET'} ${url}`);

      const odpowiedź = await fetch(url, {
        ...opcje,
        signal: kontroler.signal,
      });

      // Sukces — zwracamy odpowiedź bez względu na kod HTTP
      // (caller sam sprawdza response.ok jeśli potrzebuje)
      logInfo('engine', `apiFetch: odpowiedź ${odpowiedź.status} dla ${url}`);
      return odpowiedź;

    } catch (błąd) {
      const czyTimeout = błąd.name === 'AbortError';
      ostatniBlad = czyTimeout
        ? new Error(`apiFetch: timeout po ${timeoutMs}ms (próba ${próba + 1}/${liczbaProb})`)
        : błąd;

      logWarn('engine', `apiFetch: ${czyTimeout ? 'timeout' : 'błąd sieci'} na próbie ${próba + 1}/${liczbaProb}`, {
        url,
        komunikat: błąd.message,
      });

      // Ostatnia próba — nie czekamy, od razu rzucamy
      const ostatniaPróba = próba === liczbaProb - 1;
      if (ostatniaPróba) break;

      // Wykładniczy backoff przed następną próbą
      const opóźnienie = obliczOpóźnienie(próba, backoffMs);
      logInfo('engine', `apiFetch: oczekiwanie ${opóźnienie}ms przed kolejną próbą...`);
      await sleep(opóźnienie);

    } finally {
      // Zawsze czyścimy timer — zapobiegamy wyciekowi
      clearTimeout(timerId);
    }
  }

  // Wszystkie próby zawiodły
  logError('engine', `apiFetch: wszystkie ${liczbaProb} próby zawiodły dla ${url}`, ostatniBlad?.message);
  throw ostatniBlad ?? new Error(`apiFetch: nieznany błąd dla ${url}`);
}

// =============================================================================
// apiGet() – skrót dla żądań GET z opcjonalnymi nagłówkami
//   @param {string} url
//   @param {Record<string,string>} nagłówki
//   @param {object} konfig – opcje retry/timeout (patrz apiFetch)
//   @returns {Promise<Response>}
// =============================================================================
export async function apiGet(url, nagłówki = {}, konfig = {}) {
  return apiFetch(url, {
    method:  'GET',
    headers: nagłówki,
  }, konfig);
}

// =============================================================================
// apiPost() – skrót dla żądań POST z automatyczną serializacją JSON
//   @param {string} url
//   @param {unknown} ciało         – dane do serializacji (JSON.stringify)
//   @param {Record<string,string>} nagłówki
//   @param {object} konfig – opcje retry/timeout (patrz apiFetch)
//   @returns {Promise<Response>}
// =============================================================================
export async function apiPost(url, ciało = {}, nagłówki = {}, konfig = {}) {
  return apiFetch(url, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
      ...nagłówki,
    },
    body: JSON.stringify(ciało),
  }, konfig);
}

// =============================================================================
// END OF FILE
// =============================================================================
