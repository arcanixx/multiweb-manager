// =============================================================================
// FILE: networkUtils.js
// PATH: src/utils/networkUtils.js
// VERSION: 0.0.3
// PURPOSE: Narzędzia sieciowe – sprawdzanie dostępności URL (pingUrl).
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
    logInfo("pingUrl", { url, ok: res.ok });
    return res.ok;
  } catch (err) {
    logWarn(`pingUrl failed for ${url}`);
    return false;
  }
}
