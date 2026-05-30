// =============================================================================
// FILE: validators.js
// PATH: src/utils/validators.js
// VERSION: 0.0.3
// PURPOSE: Walidatory danych – string, obiekt, tablica (ensureString, ensureObject).
// FUNCTIONS: ensureString, ensureObject
// DEPENDS ON: -
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

// ----------------------------------------------------------------
// ensureString() – waliduje, że value jest niepustym stringiem
// ----------------------------------------------------------------
// ─── ensureString() – waliduje, że wartość jest niepustym stringiem
//   @param {*} value - wartość do walidacji
//   @param {string} name - nazwa pola dla komunikatu błędu
//   @throws {Error} - jeśli value nie jest niepustym stringiem
export function ensureString(value, name) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${name}_INVALID`);
  }
}

// ----------------------------------------------------------------
// ensureObject() – waliduje, że value jest niepustym obiektem
// ----------------------------------------------------------------
// ─── ensureObject() – waliduje, że wartość jest niepustym obiektem
//   @param {*} value - wartość do walidacji
//   @param {string} name - nazwa pola dla komunikatu błędu
//   @throws {Error} - jeśli value nie jest niepustym obiektem
export function ensureObject(value, name) {
  if (!value || typeof value !== "object") {
    throw new Error(`${name}_INVALID`);
  }
}
