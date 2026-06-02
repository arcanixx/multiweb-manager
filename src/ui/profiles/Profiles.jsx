// =============================================================================
// FILE: Profiles.jsx
// PATH: src/ui/profiles/Profiles.jsx
// VERSION: 0.0.3
// PURPOSE: UI zarządzania profilami WebView — wyświetlanie listy profili z danych IPC (load, wyświetlanie nazwy, URL, obsługa błędów). Używa window.electronAPI.invoke zamiast window.mw.
// FUNCTIONS: Profiles
// DEPENDS ON: react, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useEffect, useState } from "react";
import { logInfo, logError, logWarn } from '../../utils/loggerRenderer.js';

// ─── Profiles() – komponent zarządzania profilami WebView
//   @returns {JSX.Element} – renderowany interfejs zarządzania profilami
export function Profiles() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // ─── load() – ładuje listę profili z backendu
  //   @returns {Promise<void>}
  async function load() {
    try {
      setLoading(true);
      const res = await window.electronAPI.invoke("profiles:getAll");
      if (res.ok) {
        setProfiles(res.data || []);
        logInfo('ui', `Profiles: loaded ${res.data?.length || 0} profiles`);
      } else {
        logError('ui', 'Profiles: failed to load', res.error);
        logWarn('ui', 'Nie można załadować profili');
      }
    } catch (err) {
      logError('ui', 'Profiles: load failed', err);
      logWarn('ui', 'Wystąpił błąd podczas ładowania profili');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);
  return (
    <div className="module-container">
      <h2>Profiles</h2>
      {loading && <div className="module-loading">Loading...</div>}
      {!loading && profiles.length === 0 && (
        <div className="module-empty">No profiles defined.</div>
      )}
      {!loading && profiles.length > 0 && (
        <ul className="list">
          {profiles.map((p) => (
            <li key={p.id} className="list-item">
              <div className="list-item-title">{p.name}</div>
              {p.url && <div className="list-item-sub">{p.url}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}