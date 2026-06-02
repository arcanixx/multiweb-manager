// =============================================================================
// FILE: networkUtils.js
// PATH: src/utils/networkUtils.js
// VERSION: 0.0.3
// PURPOSE: Funkcje pomocnicze do diagnostyki sieciowej i sprawdzania dostępności zewnętrznych zasobów.
// FUNCTIONS: pingUrl
// DEPENDS ON: logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { logInfo, logWarn } from './logger.js';

// ─── pingUrl() – sprawdza czy URL odpowiada (HEAD request)
//   @param {string} url – URL do sprawdzenia
//   @returns {Promise<boolean>} czy URL odpowiada poprawnie
//   Używaj do sprawdzenia połączenia przed wywołaniem API
export async function pingUrl(url) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    logInfo("webview", "pingUrl result", { url, ok: res.ok });
    return res.ok;
  } catch (err) {
    logWarn("webview", `pingUrl failed for ${url}`, err.message);
    return false;
  }
}
