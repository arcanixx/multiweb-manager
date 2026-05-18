// =============================================================================
// FILE: Projects.jsx
// PATH: src/ui/modules/Projects.jsx
// VERSION: 0.0.3
// PURPOSE: Projects manager UI
//          - load() pobiera projekty przez IPC (projects:getAll) i ustawia stan
//          - wyświetla listę projektów; dla zarchiwizowanych pokazuje badge
// =============================================================================

import React, { useEffect, useState } from "react";

export function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await window.mw.invoke("projects:getAll");
    if (res.ok) setProjects(res.data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="module-container">
      <h2>Projects</h2>

      {loading && <div className="module-loading">Loading...</div>}

      {!loading && projects.length === 0 && (
        <div className="module-empty">No projects defined.</div>
      )}

      {!loading && projects.length > 0 && (
        <ul className="list">
          {projects.map((p) => (
            <li key={p.id} className="list-item">
              <div className="list-item-title">{p.name}</div>
              {p.archived && <div className="badge badge-archived">Archived</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// =============================================================================
// END OF FILE
// =============================================================================
