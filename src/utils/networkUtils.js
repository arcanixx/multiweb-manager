// =============================================================================
// FILE: networkUtils.js
// PATH: src/utils/networkUtils.js
// VERSION: 0.0.3
// PURPOSE: Simple network helpers.
//          - pingUrl(url) – sprawdza dostępność URL (HEAD request)
//            Zwraca true gdy odpowiedź OK, false lub rzuca przy błędzie sieci.
// DEPENDS ON: fetch (Node 18+ / Electron)
// =============================================================================

// ----------------------------------------------------------------
// pingUrl() – sprawdza czy URL odpowiada (HEAD request)
//   Używaj do sprawdzenia połączenia przed wywołaniem API
// ----------------------------------------------------------------
export async function pingUrl(url) {
  const res = await fetch(url, { method: "HEAD" });
  return res.ok;
}

// =============================================================================
// END OF FILE
// =============================================================================
