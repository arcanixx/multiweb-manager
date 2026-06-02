// =============================================================================
// FILE: urlUtils.js
// PATH: src/utils/urlUtils.js
// VERSION: 0.0.3
// PURPOSE: Narzędzia do walidacji, normalizacji i sanityzacji adresów URL dla modułu WebView.
// FUNCTIONS: normalizeWebUrl, isValidWebUrl, isSafeUrl
// DEPENDS ON: logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { logError } from "./logger.js";

// ─── normalizeWebUrl(raw) – Normalizuje surowy adres URL, dodając brakujący protokół i weryfikując format (localhost, IP, domeny)
export function normalizeWebUrl(raw) {
  if (raw == null || typeof raw !== 'string') {
    logError("webview", "urlUtils.normalizeWebUrl received invalid input type", { 
      type: typeof raw, 
      value: raw 
    });
    return null;
  }

  let u = raw.trim();
  if (!u) return null;
  // ─── Blokada niebezpiecznych schematów przed normalizacją ───
  if (!isSafeUrl(u)) return null;
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
  } catch (err) {
    logError("webview", "urlUtils.normalizeWebUrl failed", { raw, error: err.message });
    return null;
  }
}

// ─── isValidWebUrl(raw) – Weryfikuje poprawność formatu adresu URL przez normalizeWebUrl
export function isValidWebUrl(raw) {
  return normalizeWebUrl(raw) !== null;
}

// ─── isSafeUrl() – blokuje niebezpieczne schematy URL (javascript:, file:, data: itp.)

//   @returns {boolean} – true jeśli URL jest bezpieczny, false jeśli zablokowany
export function isSafeUrl(raw) {
  if (!raw || typeof raw !== 'string') return false;
  const u = raw.trim().toLowerCase();
  const BLOCKED_SCHEMES = [
    'javascript:',
    'vbscript:',
    'data:',
    'file:',
    'about:',
    'blob:',
  ];
  return !BLOCKED_SCHEMES.some(scheme => u.startsWith(scheme));
}
