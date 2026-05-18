// =============================================================================
// FILE: useHistoryLog.js
// PATH: src/hooks/useHistoryLog.js
// VERSION: 0.0.3
// PURPOSE: Hook do historyStore – logi akcji, filtrowanie, reload
//          - load() pobiera wszystkie wpisy historii (history:getAll)
// =============================================================================

import { useEffect, useState } from "react";

export function useHistoryLog() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await window.electronAPI.invoke("history:getAll");
    if (res?.ok) setEntries(res.data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return { entries, loading, reloadHistory: load };
}

// =============================================================================
// END OF FILE
// =============================================================================
