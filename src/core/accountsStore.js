// =============================================================================
// FILE: accountsStore.js
// PATH: src/core/accountsStore.js
// VERSION: 0.0.3
// PURPOSE: Zarządzanie kontami użytkownika (Google, GitHub, AI, itp.).
// FUNCTIONS: getAllAccounts, addAccount, updateAccount, deleteAccount
// DEPENDS ON: fs, path, electron, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import fs from "fs";
import path from "path";
import { app } from "electron";
import { logError } from "../utils/logger.js";
const ACCOUNTS_FILE = path.join(app.getPath("userData"), "accounts.json");
// ----------------------------------------------------------------
// loadAccounts() – wczytuje accounts.json, zwraca fallback przy błędzie
// ----------------------------------------------------------------
// ─── loadAccounts() – TODO: opis funkcji
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
// ----------------------------------------------------------------
// saveAccounts() – zapisuje store do accounts.json
// ----------------------------------------------------------------
// ─── saveAccounts() – TODO: opis funkcji
function saveAccounts(store) {
  try {
    fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(store, null, 2), "utf8");
    return true;
  } catch (err) {
    logError("accountsStore.saveAccounts error", err);
    return false;
  }
}
// ----------------------------------------------------------------
// getAllAccounts() – zwraca listę wszystkich kont
// ----------------------------------------------------------------
// ─── getAllAccounts() – TODO: opis funkcji
export function getAllAccounts() {
  return loadAccounts().data;
}
// ----------------------------------------------------------------
// addAccount() – dodaje nowe konto do listy i zapisuje
// ----------------------------------------------------------------
// ─── addAccount() – TODO: opis funkcji
export function addAccount(account) {
  const store = loadAccounts();
  store.data.push(account);
  saveAccounts(store);
  return account;
}

// ----------------------------------------------------------------
// updateAccount() – aktualizuje konto (shallow merge pól)
//   Zwraca zaktualizowane konto lub null gdy nie znaleziono
// ----------------------------------------------------------------
// ─── updateAccount() – TODO: opis funkcji
export function updateAccount(id, patch) {
  const store = loadAccounts();
  const idx = store.data.findIndex(a => a.id === id);
  if (idx === -1) return null;
  store.data[idx] = { ...store.data[idx], ...patch };
  saveAccounts(store);
  return store.data[idx];
}

// ----------------------------------------------------------------
// deleteAccount() – usuwa konto z listy i zapisuje
// ----------------------------------------------------------------
// ─── deleteAccount() – TODO: opis funkcji
export function deleteAccount(id) {
  const store = loadAccounts();
  store.data = store.data.filter(a => a.id !== id);
  saveAccounts(store);
  return true;
}
