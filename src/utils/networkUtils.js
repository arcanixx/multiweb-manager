// =============================================================================
// FILE: networkUtils.js
// PATH: src/utils/networkUtils.js
// VERSION: 0.0.3
// PURPOSE: Simple network helpers.
// FUNCTIONS: pingUrl
// DEPENDS ON: -
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

// ----------------------------------------------------------------
// pingUrl() – sprawdza czy URL odpowiada (HEAD request)
//   Używaj do sprawdzenia połączenia przed wywołaniem API
// ----------------------------------------------------------------
export async function pingUrl(url) {
  const res = await fetch(url, { method: "HEAD" });
  return res.ok;
}
