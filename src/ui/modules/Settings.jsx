// =============================================================================
// FILE: Settings.jsx
// PATH: src/ui/modules/Settings.jsx
// VERSION: 0.0.3
// PURPOSE: Settings UI
//          - load() pobiera ustawienia przez IPC (settings:get) i ustawia stan
//          - wyświetla surowy JSON ustawień
// =============================================================================

import React, { useEffect, useState } from "react";

export function Settings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await window.mw.invoke("settings:get");
    if (res.ok) setSettings(res.data || {});
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="module-container">
      <h2>Settings</h2>

      {loading && <div className="module-loading">Loading...</div>}

      {!loading && (
        <pre className="settings-json">
          {JSON.stringify(settings, null, 2)}
        </pre>
      )}
    </div>
  );
}

// =============================================================================
// END OF FILE
// =============================================================================
