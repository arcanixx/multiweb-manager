// =============================================================================
// FILE: webviewScriptInjector.js
// PATH: src/engine/webviewScriptInjector.js
// VERSION: 0.0.3
// PURPOSE: Wstrzykiwanie CSS i skryptów użytkownika (user styles, user scripts) do webview po załadowaniu strony. Uruchamiany przez main process przy zdarzeniu did-finish-load. Oddzielony od adBlocker.js – tamten blokuje requesty na poziomie sieciowym, ten modyfikuje DOM po załadowaniu.
// FUNCTIONS: injectUserCSS, removeUserCSS, injectUserScript, scheduleInjectionOnLoad, removeInjectionListeners
// DEPENDS ON: config.js, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { isFeatureEnabled } from '../config.js';
import { logDebug, logInfo, logError, logWarn } from '../utils/logger.js';

// ─── #injectionListeners – mapa: webContentsId → handler did-finish-load
// Potrzebna do cleanup przy zamknięciu profilu (removeInjectionListeners)
// UWAGA: Ta stała celowo pozostaje w tym pliku – dotyczy wyłącznie logiki injectora.
const injectionListeners = new Map();

// ─── injectUserCSS() – wstrzykuje CSS użytkownika do webContents
//   @param {Electron.WebContents} wc  – docelowy webContents
//   @param {string}               css – kod CSS do wstrzyknięcia
//   @returns {Promise<string|null>}   – klucz wstrzykniętego CSS (do późniejszego usunięcia) lub null
export async function injectUserCSS(wc, css) {
  if (!css?.trim()) return null;
  try {
    const key = await wc.insertCSS(css);
    logDebug('engine', `webviewScriptInjector.injectUserCSS: injected ${css.length} chars (key=${key})`);
    return key;
  } catch (err) {
    logError('engine', 'webviewScriptInjector.injectUserCSS failed', err.message);
    return null;
  }
}

// ─── removeUserCSS() – usuwa wcześniej wstrzyknięty CSS
//   @param {Electron.WebContents} wc  – docelowy webContents
//   @param {string}               key – klucz zwrócony przez injectUserCSS
//   @returns {Promise<void>}
export async function removeUserCSS(wc, key) {
  if (!key) return;
  try {
    await wc.removeInsertedCSS(key);
    logDebug('engine', `webviewScriptInjector.removeUserCSS: removed key=${key}`);
  } catch (err) {
    logError('engine', 'webviewScriptInjector.removeUserCSS failed', err.message);
  }
}

// ─── injectUserScript() – wykonuje skrypt JavaScript w kontekście strony webview
//   Uwaga bezpieczeństwa: skrypt pochodzi z ustawień użytkownika – to celowy user scripts feature
//   (Greasemonkey-like). NIE wstrzykuj zewnętrznych skryptów bez weryfikacji.
//   @param {Electron.WebContents} wc     – docelowy webContents
//   @param {string}               script – kod JS do wykonania
//   @returns {Promise<any>}              – wynik executeJavaScript lub null przy błędzie
export async function injectUserScript(wc, script) {
  if (!script?.trim()) return null;
  try {
    const result = await wc.executeJavaScript(script, true);
    logDebug('engine', `webviewScriptInjector.injectUserScript: executed ${script.length} chars`);
    return result;
  } catch (err) {
    logError('engine', 'webviewScriptInjector.injectUserScript failed', err.message);
    return null;
  }
}

// ─── scheduleInjectionOnLoad() – rejestruje listener did-finish-load dla webContents
//   Automatycznie wstrzykuje CSS i skrypty przy każdym załadowaniu strony.
//   @param {Electron.WebContents} wc      – docelowy webContents
//   @param {string}               profileId – ID profilu (do logowania)
//   @param {Object}               options
//   @param {string}               [options.userCSS]    – CSS do wstrzyknięcia
//   @param {string}               [options.userScript] – skrypt do wstrzyknięcia
//   @returns {void}
export function scheduleInjectionOnLoad(wc, profileId, { userCSS, userScript } = {}) {
  if (!isFeatureEnabled('webviewScriptInjector')) {
    logDebug('engine', `webviewScriptInjector: feature disabled, skipping for profile ${profileId}`);
    return;
  }

  if (!userCSS?.trim() && !userScript?.trim()) {
    logDebug('engine', `webviewScriptInjector: no CSS/script for profile ${profileId}, skipping`);
    return;
  }

  // Usuń poprzedni listener jeśli istnieje (np. przy zmianie ustawień profilu)
  removeInjectionListeners(wc);

  // ─── handler – wykonywany przy każdym did-finish-load
  const handler = async () => {
    logInfo('engine', `webviewScriptInjector: injecting for profile ${profileId} (url: ${wc.getURL()})`);

    if (userCSS?.trim()) {
      await injectUserCSS(wc, userCSS);
    }
    if (userScript?.trim()) {
      await injectUserScript(wc, userScript);
    }
  };

  wc.on('did-finish-load', handler);
  injectionListeners.set(wc.id, { wc, handler });

  logDebug('engine', `webviewScriptInjector: scheduled injection for profile ${profileId} (wcId=${wc.id})`);
}

// ─── removeInjectionListeners() – usuwa listener did-finish-load dla webContents
//   Wywołaj przy zamknięciu/usunięciu profilu, żeby uniknąć memory leaks.
//   @param {Electron.WebContents} wc – docelowy webContents
//   @returns {void}
export function removeInjectionListeners(wc) {
  const entry = injectionListeners.get(wc.id);
  if (!entry) return;
  try {
    entry.wc.removeListener('did-finish-load', entry.handler);
    injectionListeners.delete(wc.id);
    logDebug('engine', `webviewScriptInjector: removed listener for wcId=${wc.id}`);
  } catch (err) {
    logWarn('engine', `webviewScriptInjector.removeInjectionListeners: ${err.message}`);
  }
}