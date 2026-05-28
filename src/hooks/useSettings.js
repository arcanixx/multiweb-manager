// =============================================================================
// FILE: useSettings.js
// PATH: src/hooks/useSettings.js
// VERSION: 0.0.3
// PURPOSE: Hook do settingsStore – pobieranie i zapisywanie ustawień load() pobiera ustawienia przez IPC (settings:get) save(patch) wysyła patch przez IPC (settings:update) i odświeża stan
// FUNCTIONS: useSettings
// DEPENDS ON: react
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useEffect, useState } from "react";
import { logInfo, logError, logWarn } from "../utils/loggerRenderer.js";
// ─── useSettings() – hook do zarządzania ustawieniami
//   @returns {Object} – obiekt z settings, loading i funkcjami CRUD
export function useSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // ─── load() – ładuje ustawienia z backendu
  //   @returns {Promise<void>}
  async function load() {
    try {
      setLoading(true);
      const res = await window.electronAPI.invoke("settings:get");
      if (res?.ok) {
        setSettings(res.data);
        logInfo("useSettings.load", Object.keys(res.data).length);
      } else {
        logError("useSettings.load failed", res?.error);
        logWarn("Nie można załadować ustawień");
      }
      setLoading(false);
    } catch (err) {
      logError("useSettings.load exception", err);
      logWarn("Wystąpił błąd podczas ładowania ustawień");
      setLoading(false);
    }
  }

  // ─── save() – zapisuje zmiany w ustawieniach
  //   @param {Object} patch – obiekt z polami do zaktualizowania
  //   @returns {Promise<Object>} – wynik operacji
  async function save(patch) {
    try {
      const res = await window.electronAPI.invoke("settings:update", patch);
      if (res?.ok) {
        setSettings(res.data);
        logInfo("useSettings.save success");
      } else {
        logError("useSettings.save failed", res?.error);
        logWarn("Nie można zapisać ustawień");
      }
      return res;
    } catch (err) {
      logError("useSettings.save exception", err);
      logWarn("Wystąpił błąd podczas zapisu ustawień");
      return { ok: false, error: err.message };
    }
  }

  useEffect(() => {
    load();
  }, []);

  return { settings, loading, reloadSettings: load, saveSettings: save };
}

