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


// ─── setMainWindow() – Zapisuje referencję do głównego okna aplikacji Electron (BrowserWindow), która jest wykorzystywana do przesyłania zdarzeń IPC po wyzwoleniu skrótu
export function setMainWindow(win) {
  mainWindow = win;
}


// ─── unregisterAllHotkeys() – Wyrejestrowuje wszystkie aktualnie zarejestrowane globalne skróty klawiszowe z pamięci systemu operacyjnego za pomocą modułu globalShortcut Electrona
export function unregisterAllHotkeys() {
  registeredHotkeys.forEach(hk => {
    try { globalShortcut.unregister(hk); } catch(e) {}
  });
  registeredHotkeys = [];
  logDebug('All hotkeys unregistered');
}


// ─── registerGlobalHotkeys() – Rejestruje przekazaną listę skrótów klawiszowych w systemie operacyjnym; po ich naciśnięciu wysyła odpowiednie powiadomienie IPC do procesu renderowania
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


// ─── getAllHotkeys() – Odczytuje konfigurację i listę skrótów klawiszowych z trwałego magazynu (electron-store) o nazwie 'hotkeys' i zwraca je w postaci tablicy
export async function getAllHotkeys() {
  const store = new Store({ name: 'hotkeys', defaults: { hotkeys: [] } });
  return store.get('hotkeys', []);
}


// ─── saveHotkeys() – Zapisuje nową listę skrótów klawiszowych do bazy danych (electron-store), wywołuje proces ich globalnej rejestracji w systemie i zwraca zapisaną listę
export async function saveHotkeys(hotkeys) {
  const store = new Store({ name: 'hotkeys', defaults: { hotkeys: [] } });
  store.set('hotkeys', hotkeys);
  await registerGlobalHotkeys(hotkeys);
  return hotkeys;
}


// ─── registerHotkeysFromList() – Uruchamia proces rejestracji globalnych skrótów klawiszowych bezpośrednio na przekazanej liście, bez modyfikacji danych zapisanych w bazie
export async function registerHotkeysFromList(hotkeys) {
  await registerGlobalHotkeys(hotkeys);
}
