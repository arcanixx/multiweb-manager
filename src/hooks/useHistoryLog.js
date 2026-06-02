// =============================================================================
// FILE: useHistoryLog.js
// PATH: src/hooks/useHistoryLog.js
// VERSION: 0.0.3
// PURPOSE: Hook React do zarządzania i odświeżania logów historii aktywności użytkownika. Komunikuje się z historyStore przez mostek IPC.
// FUNCTIONS: useHistoryLog
// DEPENDS ON: react, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useEffect, useState } from "react";
import { logInfo, logError, logWarn } from "../utils/loggerRenderer.js";

// ─── useHistoryLog() – hook do zarządzania historią akcji użytkownika
//   @returns {Object} – obiekt z entries, loading i reloadHistory
export function useHistoryLog() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ─── load() – ładuje wszystkie wpisy historii z backendu
  //   @returns {Promise<void>}
  async function load() {
    try {
      setLoading(true);
      const res = await window.electronAPI.invoke("history:getAll");
      if (res?.ok) {
        setEntries(res.data);
        logInfo("store", "useHistoryLog.load success", res.data.length);
      } else {
        logError("store", "useHistoryLog.load failed", res?.error);
        logWarn("store", "Nie można załadować historii");
      }
      setLoading(false);
    } catch (err) {
      logError("store", "useHistoryLog.load exception", err.message);
      logWarn("store", "Wystąpił błąd podczas ładowania historii");
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);
  return { entries, loading, reloadHistory: load };
}
