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
/**
 * Rejestruje WebView w mapach
 * @param {string} tabId - identyfikator zakładki
 * @param {number} webContentsId - ID WebContents z Electron
 */
export function registerWebView(tabId, webContentsId) {
  webviewMap.set(tabId, { webContentsId, registeredAt: Date.now() });
  webviewProfileMap.set(webContentsId, tabId);
  logDebug(`WebView registered: ${tabId} -> ${webContentsId}`);
}
/**
 * Usuwa WebView z map
 * @param {string} tabId - identyfikator zakładki
 */
export function unregisterWebView(tabId) {
  const entry = webviewMap.get(tabId);
  if (entry) {
    webviewProfileMap.delete(entry.webContentsId);
    webviewMap.delete(tabId);
    logDebug(`WebView unregistered: ${tabId}`);
  }
}
/**
 * Pobiera wpis WebView po tabId
 * @param {string} tabId
 */
export function getWebViewEntry(tabId) {
  return webviewMap.get(tabId);
}
/**
 * Pobiera wszystkie WebContents (pomocnicza)
 */
export function getAllWebContents() {
  const { webContents } = require('electron');
  return webContents.getAllWebContents();
}