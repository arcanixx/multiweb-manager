// =============================================================================
// FILE: validators.js
// PATH: src/utils/validators.js
// VERSION: 0.0.3
// PURPOSE: Common validation helpers used across IPC handlers and stores.
// FUNCTIONS: ensureString, ensureObject
// DEPENDS ON: -
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

// ----------------------------------------------------------------
// ensureString() – waliduje, że value jest niepustym stringiem
// ----------------------------------------------------------------
export function ensureString(value, name) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${name}_INVALID`);
  }
}
// ----------------------------------------------------------------
// ensureObject() – waliduje, że value jest niepustym obiektem
// ----------------------------------------------------------------
export function ensureObject(value, name) {
  if (!value || typeof value !== "object") {
    throw new Error(`${name}_INVALID`);
  }
}

