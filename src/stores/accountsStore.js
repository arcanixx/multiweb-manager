// =============================================================================
// FILE: accountsStore.js
// PATH: src/stores/accountsStore.js
// VERSION: 0.0.3
// PURPOSE: Zarządzanie kontami użytkownika (Google, GitHub, AI, itp.) – obsługa trwałości i operacji CRUD na danych kont.
// FUNCTIONS: getAllAccounts, addAccount, updateAccount, deleteAccount
// DEPENDS ON: fs, path, electron, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import fs from "fs";
import path from "path";
import { app } from "electron";
import { logError, logInfo } from "../utils/logger.js";

const ACCOUNTS_FILE = path.join(app.getPath("userData"), "accounts.json");

// ─── loadAccounts() – Wczytuje dane kont użytkowników z pliku konfiguracyjnego JSON; w przypadku braku pliku lub błędu odczytu zwraca domyślny obiekt z pustą tablicą
function loadAccounts() {
  try {
    if (!fs.existsSync(ACCOUNTS_FILE)) {
      return { version: "0.0.3", data: [] };
    }
    const raw = fs.readFileSync(ACCOUNTS_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    logError("store", "accountsStore.loadAccounts failed", err.message);
    return { version: "0.0.3", data: [] };
  }
}

// ─── saveAccounts() – Zapisuje aktualny stan kont użytkowników do pliku JSON w katalogu danych użytkownika (userData); zwraca true przy powodzeniu, false przy błędzie
function saveAccounts(store) {
  try {
    if (!store || !Array.isArray(store.data)) throw new Error("Invalid accounts data structure");
    fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(store, null, 2), "utf8");
    logInfo("store", "accountsStore.saveAccounts success");
    return true;
  } catch (err) {
    logError("store", "accountsStore.saveAccounts failed: " + err.message);
    return false;
  }
}

// ─── getAllAccounts() – Pobiera i zwraca tablicę wszystkich zarejestrowanych kont użytkowników ze sklepu danych
export function getAllAccounts() {
  try {
    return loadAccounts().data || [];
  } catch (err) {
    logError("store", "accountsStore.getAllAccounts failed", err.message);
    return [];
  }
}

// ─── addAccount() – Dodaje nowy obiekt konta do listy kont użytkowników, zapisuje zmiany na dysku i zwraca dodane konto
export function addAccount(account) {
  try {
    const store = loadAccounts();
    store.data.push(account);
    saveAccounts(store);
    logInfo("store", "accountsStore.addAccount success", account.id);
    return account;
  } catch (err) {
    logError("store", "accountsStore.addAccount failed", err.message);
    return account;
  }
}

// ─── updateAccount() – Aktualizuje istniejące konto o podanym identyfikatorze poprzez shallow merge nowych pól z aktualnymi; zwraca zaktualizowany obiekt konta lub null, gdy nie istnieje
export function updateAccount(id, patch) {
  try {
    const store = loadAccounts();
    const idx = store.data.findIndex(a => a.id === id);
    if (idx === -1) return null;
    store.data[idx] = { ...store.data[idx], ...patch };
    saveAccounts(store);
    logInfo("store", "accountsStore.updateAccount success", id);
    return store.data[idx];
  } catch (err) {
    logError("store", "accountsStore.updateAccount failed", err.message);
    return null;
  }
}

// ─── deleteAccount() – Usuwa konto o podanym identyfikatorze z listy zapisanych kont użytkowników, zapisuje zmiany na dysku i zwraca true
export function deleteAccount(id) {
  try {
    const store = loadAccounts();
    store.data = store.data.filter(a => a.id !== id);
    saveAccounts(store);
    logInfo("store", "accountsStore.deleteAccount success", id);
    return true;
  } catch (err) {
    logError("store", "accountsStore.deleteAccount failed", err.message);
    return false;
  }
}