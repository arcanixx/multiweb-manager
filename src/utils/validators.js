// =============================================================================
// FILE: validators.js
// PATH: src/utils/validators.js
// VERSION: 0.0.3
// PURPOSE: Walidatory typów danych wykorzystywane przy sprawdzaniu poprawności payloadów IPC i stanów magazynów.
// FUNCTIONS: ensureString, ensureObject
// DEPENDS ON: logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { logError } from "./logger.js";

// UWAGA: Ten plik nie zawiera eksportowalnych stałych wzorców (URL_PATTERN, EMAIL_PATTERN itp.).
// Walidacja opiera się na logice funkcji – funkcje ensureString i ensureObject pozostają
// w tym pliku i nie powinny być przenoszone do constants.js.

// ─── ensureString() – waliduje, że wartość jest niepustym stringiem
export function ensureString(value, name) {
  if (typeof value !== "string" || !value.trim()) {
    logError("ui", `Validation failed: ${name} is not a valid string`);
    throw new Error(`${name}_INVALID`);
  }
}

// ─── ensureObject() – waliduje, że wartość jest niepustym obiektem
export function ensureObject(value, name) {
  if (!value || typeof value !== "object") {
    logError("ui", `Validation failed: ${name} is not a valid object`);
    throw new Error(`${name}_INVALID`);
  }
}
