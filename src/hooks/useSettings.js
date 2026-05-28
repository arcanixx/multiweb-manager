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
export function useSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    const res = await window.electronAPI.invoke("settings:get");
    if (res?.ok) setSettings(res.data);
    setLoading(false);
  }
  async function save(patch) {
    const res = await window.electronAPI.invoke("settings:update", patch);
    if (res?.ok) setSettings(res.data);
    return res;
  }
  useEffect(() => {
    load();
  }, []);
  return { settings, loading, reloadSettings: load, saveSettings: save };
}

