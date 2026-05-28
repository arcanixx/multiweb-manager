// =============================================================================
// FILE: Profiles.jsx
// PATH: src/ui/profiles/Profiles.jsx
// VERSION: 0.0.3
// PURPOSE: Profiles manager UI
// FUNCTIONS: Profiles
// DEPENDS ON: react
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useEffect, useState } from "react";
export function Profiles() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    const res = await window.mw.invoke("profiles:getAll");
    if (res.ok) setProfiles(res.data || []);
    setLoading(false);
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

