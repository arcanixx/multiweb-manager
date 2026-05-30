// =============================================================================
// FILE: hotkeysManager.js
// PATH: src/engine/hotkeysManager.js
// VERSION: 0.0.3
// PURPOSE: Zarządzanie globalnymi skrótami klawiszowymi (globalShortcut)
// FUNCTIONS: setMainWindow, unregisterAllHotkeys, registerGlobalHotkeys, getAllHotkeys, saveHotkeys, registerHotkeysFromList
// DEPENDS ON: electron, logger.js, electron-store
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { globalShortcut } from 'electron';
import { logDebug, logWarn, logError } from '../utils/logger.js';
import Store from 'electron-store';
let registeredHotkeys = [];
let mainWindow = null;
/**
 * Ustawia referencję do głównego okna (potrzebne do wysyłania eventów)
 */
// ─── setMainWindow() – TODO: opis funkcji
export function setMainWindow(win) {
  mainWindow = win;
}
/**
 * Odrejestrowuje wszystkie aktywne skróty
 */
// ─── unregisterAllHotkeys() – TODO: opis funkcji
export function unregisterAllHotkeys() {
  registeredHotkeys.forEach(hk => {
    try { globalShortcut.unregister(hk); } catch(e) {}
  });
  registeredHotkeys = [];
  logDebug('All hotkeys unregistered');
}
/**
 * Rejestruje listę skrótów (zapisanych w store)
 */
// ─── registerGlobalHotkeys() – TODO: opis funkcji
export async function registerGlobalHotkeys(hotkeys) {
  unregisterAllHotkeys();
  for (const hk of hotkeys) {
    if (!hk.enabled || !hk.shortcut) continue;
    const shortcut = hk.shortcut;
    const id = hk.id;
    const action = hk.action;
    const text = hk.text;
    const name = hk.name;
    const windowRef = mainWindow;
    try {
      const success = globalShortcut.register(shortcut, () => {
        if (windowRef) {
          windowRef.webContents.send('hotkey:trigger', {
            id,
            action,
            text
          });
          logDebug(`Hotkey triggered: ${shortcut} -> ${name}`);
        }
      });

      if (success) registeredHotkeys.push(shortcut);
      else logWarn(`Failed to register hotkey: ${shortcut}`);
    } catch (err) {
      logError(`Hotkey registration error: ${shortcut}`, err);
    }
  }
}

/**
 * Pobiera wszystkie skróty z store
 */
// ─── getAllHotkeys() – TODO: opis funkcji
export async function getAllHotkeys() {
  const store = new Store({ name: 'hotkeys', defaults: { hotkeys: [] } });
  return store.get('hotkeys', []);
}

/**
 * Zapisuje skróty do store i rejestruje je
 */
// ─── saveHotkeys() – TODO: opis funkcji
export async function saveHotkeys(hotkeys) {
  const store = new Store({ name: 'hotkeys', defaults: { hotkeys: [] } });
  store.set('hotkeys', hotkeys);
  await registerGlobalHotkeys(hotkeys);
  return hotkeys;
}

/**
 * Rejestruje hotkeys (bez zapisu do store – tylko aktywacja)
 */
// ─── registerHotkeysFromList() – TODO: opis funkcji
export async function registerHotkeysFromList(hotkeys) {
  await registerGlobalHotkeys(hotkeys);
}