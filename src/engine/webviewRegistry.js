// =============================================================================
// FILE: webviewRegistry.js
// PATH: src/engine/webviewRegistry.js
// VERSION: 0.0.3
// PURPOSE: Rejestracja WebView (mapy tabId ↔ webContentsId)
// FUNCTIONS: registerWebView, unregisterWebView, getWebViewEntry, getAllWebContents
// DEPENDS ON: logger.js, electron
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { logDebug } from '../utils/logger.js';
// Mapy dla WebView i AdBlockera
export const webviewMap = new Map();        // tabId → { webContentsId, registeredAt }
export const webviewProfileMap = new Map(); // webContentsId → profileId

// ─── registerWebView() – Kojarzy identyfikator zakładki (tabId) z identyfikatorem instancji webContentsId z Electrona w rejestrze i zapisuje czas rejestracji
export function registerWebView(tabId, webContentsId) {
  webviewMap.set(tabId, { webContentsId, registeredAt: Date.now() });
  webviewProfileMap.set(webContentsId, tabId);
  logDebug('engine', `WebView registered: ${tabId} -> ${webContentsId}`);
}

// ─── unregisterWebView() – Wyrejestrowuje i usuwa powiązania danego tabId oraz skojarzonego webContentsId z map rejestru WebView
export function unregisterWebView(tabId) {
  const entry = webviewMap.get(tabId);
  if (entry) {
    webviewProfileMap.delete(entry.webContentsId);
    webviewMap.delete(tabId);
    logDebug('engine', `WebView unregistered: ${tabId}`);
  }
}

// ─── getWebViewEntry() – Pobiera z map rejestru dane powiązane z podanym identyfikatorem zakładki (tabId), w tym webContentsId
export function getWebViewEntry(tabId) {
  return webviewMap.get(tabId);
}

// ─── getAllWebContents() – Zwraca listę wszystkich aktywnych obiektów WebContents z Electrona za pomocą natywnego modułu
export function getAllWebContents() {
  const { webContents } = require('electron');
  return webContents.getAllWebContents();
}