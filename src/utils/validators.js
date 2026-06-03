// =============================================================================
// FILE: validators.js
// PATH: src/utils/validators.js
// VERSION: 0.0.3
// PURPOSE: Walidatory typów danych wykorzystywane przy sprawdzaniu poprawności payloadów IPC i stanów magazynów.
// FUNCTIONS: ensureString, ensureObject, validateUrl, validateEmail, validateLength, validateNoSpecialChars, validatePassword, validatePhone
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

// =============================================================================
// WALIDATORY ROZSZERZONE – gotowe do aktywacji
// Zakomentowane celowo – aktywować przy wdrożeniu odpowiednich formularzy.
// Każda funkcja zwraca { valid: boolean, error?: string }
// =============================================================================

// ─── validateUrl() – sprawdza czy string jest poprawnym URL (http/https)
// Zastosowanie: ProfileModal (pole URL), AppLibrary, MiniPostman
export function validateUrl(value) {
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return { valid: false, error: 'URL_PROTOCOL_INVALID' };
    }
    return { valid: true };
  } catch {
    return { valid: false, error: 'URL_INVALID' };
  }
}

// ─── validateEmail() – sprawdza format adresu email (RFC 5322 uproszczony)
// Zastosowanie: formularze kont, eksport/import (jeśli będzie pole email)
export function validateEmail(value) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return re.test(String(value || '').toLowerCase())
    ? { valid: true }
    : { valid: false, error: 'EMAIL_INVALID' };
}

// ─── validateLength() – sprawdza czy string mieści się w granicach długości
// Zastosowanie: nazwy profili, projektów, zakładek notatek, hotkeys
// @param {string} value
// @param {number} min – minimalna długość (domyślnie 1)
// @param {number} max – maksymalna długość (domyślnie 255)
export function validateLength(value, min = 1, max = 255) {
  const len = String(value || '').trim().length;
  if (len < min) return { valid: false, error: 'VALUE_TOO_SHORT' };
  if (len > max) return { valid: false, error: 'VALUE_TOO_LONG' };
  return { valid: true };
}

// ─── validateNoSpecialChars() – odrzuca niebezpieczne znaki specjalne w polach tekstowych
// Zastosowanie: nazwy profili, kategorii, projektów (nie URL, nie hasła)
// Blokuje: < > " ' ` ; \ / oraz null bytes
export function validateNoSpecialChars(value) {
  const forbidden = /[<>"'`;\\/\u0000]/;
  return forbidden.test(value)
    ? { valid: false, error: 'SPECIAL_CHARS_FORBIDDEN' }
    : { valid: true };
}

// ─── validatePassword() – minimalna siła hasła (jeśli apka będzie miała auth)
// Zastosowanie: ekran logowania / zmiany hasła (jeśli zaimplementowany)
// Wymaga: min 8 znaków, 1 wielka litera, 1 cyfra, 1 znak specjalny
export function validatePassword(value) {
  if (!value || value.length < 8)  return { valid: false, error: 'PASSWORD_TOO_SHORT' };
  if (!/[A-Z]/.test(value))         return { valid: false, error: 'PASSWORD_NO_UPPERCASE' };
  if (!/[0-9]/.test(value))         return { valid: false, error: 'PASSWORD_NO_DIGIT' };
  if (!/[^A-Za-z0-9]/.test(value))  return { valid: false, error: 'PASSWORD_NO_SPECIAL' };
  return { valid: true };
}

// ─── validatePhone() – międzynarodowy format telefonu (E.164 lub lokalny)
// Zastosowanie: formularze kontaktowe, jeśli apka będzie je zawierać
export function validatePhone(value) {
  const re = /^\+?[\d\s\-().]{7,20}$/;
  return re.test(String(value || ''))
    ? { valid: true }
    : { valid: false, error: 'PHONE_INVALID' };
}