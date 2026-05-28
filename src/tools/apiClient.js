// =============================================================================
// FILE: apiClient.js
// PATH: src/tools/apiClient.js
// VERSION: 0.0.3
// PURPOSE: Prosty wrapper HTTP do testowania API apiRequest(url, method, headers, body)
//         wykonuje żądanie i zwraca { status, headers, body }
// FUNCTIONS: apiRequest
// DEPENDS ON: logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { logDebug, logError } from "../utils/logger.js";
export async function apiRequest(url, method, headers, body) {
  try {
    logDebug(`apiClient.apiRequest: ${method} ${url}`);
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
    logDebug(`apiClient.apiRequest: response status ${result.status}`);
    return result;
  } catch (err) {
    logError("apiClient.apiRequest failed", err);
    throw err;
  }
}

