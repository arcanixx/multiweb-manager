// =============================================================================
// FILE: Tasks.jsx
// PATH: src/ui/modules/Tasks.jsx
// VERSION: 0.0.3
// PURPOSE: Tasks manager UI
//          - load() pobiera taski przez IPC (tasks:getAll) i ustawia stan
//          - wyświetla listę tasków z tytułem, priorytetem i statusem
// =============================================================================

import React, { useEffect, useState } from "react";

export function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await window.mw.invoke("tasks:getAll");
    if (res.ok) setTasks(res.data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="module-container">
      <h2>Tasks</h2>

      {loading && <div className="module-loading">Loading...</div>}

      {!loading && tasks.length === 0 && (
        <div className="module-empty">No tasks defined.</div>
      )}

      {!loading && tasks.length > 0 && (
        <ul className="list">
          {tasks.map((t) => (
            <li key={t.id} className="list-item">
              <div className="list-item-title">{t.title}</div>
              <div className="list-item-sub">
                {t.priority || "no priority"}{" "}
                {t.status ? `• ${t.status}` : ""}
              </div>
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
