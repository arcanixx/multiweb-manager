// =============================================================================
// FILE: apiClient.js
// PATH: src/tools/apiClient.js
// VERSION: 0.0.3
// PURPOSE: Prosty wrapper HTTP do testowania API
//          - apiRequest(url, method, headers, body)
//            wykonuje żądanie i zwraca { status, headers, body }
// =============================================================================

export async function apiRequest(url, method, headers, body) {
  const res = await fetch(url, {
    method,
    headers,
    body: method !== "GET" && method !== "HEAD" ? body : undefined
  });

  return {
    status: res.status,
    headers: Object.fromEntries(res.headers.entries()),
    body: await res.text()
  };
}

// =============================================================================
// END OF FILE
// =============================================================================
