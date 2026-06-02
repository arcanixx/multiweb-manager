// =============================================================================
// FILE: apiClient.js
// PATH: src/tools/apiClient.js
// VERSION: 0.0.3
// PURPOSE: Prosty wrapper HTTP do testowania API apiRequest(url, method, headers, body)
//          wykonuje żądanie i zwraca { status, headers, body }
// FUNCTIONS: apiRequest
// DEPENDS ON: logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { logDebug, logError } from "../utils/logger.js";

// ─── apiRequest() – Wykonuje asynchroniczne żądanie HTTP o podanych parametrach (URL, metoda, nagłówki, treść), loguje szczegóły i zwraca status oraz dane odpowiedzi
export async function apiRequest(url, method, headers, body) {
  try {
    logDebug('tools', `apiClient.apiRequest: ${method} ${url}`);
    const res = await fetch(url, {
      method,
      headers,
      body: method !== "GET" && method !== "HEAD" ? body : undefined
    });
    const result = {
      status: res.status,
      headers: Object.fromEntries(res.headers.entries()),
      body: await res.text()
    };
    logDebug('tools', `apiClient.apiRequest: response status ${result.status}`);
    return result;
  } catch (err) {
    logError('tools', "apiClient.apiRequest failed", err);
    throw err;
  }
}