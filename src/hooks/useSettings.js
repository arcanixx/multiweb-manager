// =============================================================================
// FILE: useSettings.js
// PATH: src/hooks/useSettings.js
// VERSION: 0.0.3
// PURPOSE: Hook React do zarządzania ustawieniami użytkownika – ładowanie, aktualizacja i synchronizacja stanu z settingsStore przez mostek IPC.
// FUNCTIONS: useSettings
// DEPENDS ON: react, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useEffect, useState } from "react";
import { logInfo, logError, logWarn } from "../utils/loggerRenderer.js";

// ─── useSettings() – Hook React do zarządzania ustawieniami użytkownika
//   @returns {Object} – Obiekt zawierający aktualne settings, stan loading oraz funkcje reloadSettings i saveSettings
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
        logInfo("settings", "useSettings.load success", Object.keys(res.data).length);
      } else {
        logError("settings", "useSettings.load failed", res?.error);
        logWarn("settings", "Nie można załadować ustawień");
      }
      setLoading(false);
    } catch (err) {
      logError("settings", "useSettings.load exception", err.message);
      logWarn("settings", "Wystąpił błąd podczas ładowania ustawień");
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
        logInfo("settings", "useSettings.save success");
      } else {
        logError("settings", "useSettings.save failed", res?.error);
        logWarn("settings", "Nie można zapisać ustawień");
      }
      return res;
    } catch (err) {
      logError("settings", "useSettings.save exception", err.message);
      logWarn("settings", "Wystąpił błąd podczas zapisu ustawień");
      return { ok: false, error: err.message };
    }
  }

  useEffect(() => {
    load();
  }, []);

  return { settings, loading, reloadSettings: load, saveSettings: save };
}