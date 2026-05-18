// =============================================================================
// FILE: accountsStore.js
// PATH: src/core/accountsStore.js
// VERSION: 0.0.3
// PURPOSE: Zarządzanie kontami użytkownika (Google, GitHub, AI, itp.)
//          - przechowywanie credentiali (zaszyfrowanych w przyszłości)
//          - mapowanie profili na konta
//          - przygotowanie pod Multi‑Account Login (DO‑ANALYSIS)
// =============================================================================

import fs from "fs";
import path from "path";
import { app } from "electron";
import { logInfo, logError } from "../utils/logger.js";

const ACCOUNTS_FILE = path.join(app.getPath("userData"), "accounts.json");

// ---------------------------------------------------------------------------
// Wewnętrzne helpers – odczyt / zapis pliku JSON
// ---------------------------------------------------------------------------

function loadAccounts() {
  try {
    if (!fs.existsSync(ACCOUNTS_FILE)) {
      return { version: "0.0.3", data: [] };
    }
    const raw = fs.readFileSync(ACCOUNTS_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    logError("accountsStore.loadAccounts error", err);
    return { version: "0.0.3", data: [] };
  }
}

function saveAccounts(store) {
  try {
    fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(store, null, 2), "utf8");
    return true;
  } catch (err) {
    logError("accountsStore.saveAccounts error", err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Publiczne API
// ---------------------------------------------------------------------------

/** Zwraca listę wszystkich kont. */
export function getAllAccounts() {
  return loadAccounts().data;
}

/** Dodaje nowe konto i zapisuje plik. */
export function addAccount(account) {
  const store = loadAccounts();
  store.data.push(account);
  saveAccounts(store);
  logInfo("accountsStore.addAccount", account.id);
  return account;
}

/** Aktualizuje istniejące konto po id. Zwraca zaktualizowany obiekt lub null. */
export function updateAccount(id, patch) {
  const store = loadAccounts();
  const idx = store.data.findIndex(a => a.id === id);
  if (idx === -1) return null;
  store.data[idx] = { ...store.data[idx], ...patch };
  saveAccounts(store);
  logInfo("accountsStore.updateAccount", id);
  return store.data[idx];
}

/** Usuwa konto po id. */
export function deleteAccount(id) {
  const store = loadAccounts();
  store.data = store.data.filter(a => a.id !== id);
  saveAccounts(store);
  logInfo("accountsStore.deleteAccount", id);
  return true;
}

// =============================================================================
// END OF FILE
// =============================================================================
