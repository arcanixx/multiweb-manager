// =============================================================================
// FILE: urlUtils.js
// PATH: src/utils/urlUtils.js
// VERSION: 0.0.3
// PURPOSE: Normalizacja URL dla WebView — zawsze pelny adres z https://.
// FUNCTIONS: normalizeWebUrl, isValidWebUrl
// DEPENDS ON: -
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

/**
 * @param {string} raw
 * @returns {string|null} gotowy URL lub null gdy pusty / niepoprawny
 */
export function normalizeWebUrl(raw) {
  if (raw == null || typeof raw !== 'string') return null;
  let u = raw.trim();
  if (!u) return null;
  if (!/^https?:\/\//i.test(u)) {
    u = `https://${u}`;
  }
  try {
    const parsed = new URL(u);
    const host = parsed.hostname;
    if (!host) return null;
    if (host === 'localhost' || host.endsWith('.localhost')) return parsed.href;
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return parsed.href;
    if (!host.includes('.')) return null;
    return parsed.href;
  } catch {
    return null;
  }
}
export function isValidWebUrl(raw) {
  return normalizeWebUrl(raw) !== null;
}
