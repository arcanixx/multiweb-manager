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

// ─── pingUrl() – sprawdza czy URL odpowiada (HEAD request) z timeout i retry
//   @param {string} url – URL do sprawdzenia
//   @param {Object} options – opcje (timeoutMs, retries)
//   @returns {Promise<boolean>} czy URL odpowiada poprawnie
export async function pingUrl(url, options = {}) {
  const { timeoutMs = 5000, retries = 2 } = options;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    let timeoutId;
    try {
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      
      const res = await fetch(url, { 
        method: "HEAD",
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      logInfo("webview", "pingUrl result", { url, ok: res.ok, attempt: attempt + 1 });
      return res.ok;
    } catch (err) {
      clearTimeout(timeoutId);
      if (attempt === retries) {
        logWarn("webview", `pingUrl failed for ${url} after ${retries + 1} attempts`, err.message);
        return false;
      }
      // Wait before retry (exponential backoff: 100ms, 200ms, 400ms, etc.)
      await new Promise(resolve => setTimeout(resolve, 100 * Math.pow(2, attempt)));
    }
  }
  
  return false;
}

