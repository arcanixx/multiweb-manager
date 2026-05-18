// =============================================================================
// FILE: useWorkspaces.js
// PATH: src/hooks/useWorkspaces.js
// VERSION: 0.0.3
// PURPOSE: Hook do workspacesStore – lista, zapis, usuwanie
//          - load()           pobiera wszystkie workspace'y (workspaces:getAll)
//          - save(workspace)  zapisuje workspace (workspaces:save)
//          - remove(id)       usuwa workspace (workspaces:delete)
// =============================================================================

import { useEffect, useState } from "react";

export function useWorkspaces() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await window.electronAPI.invoke("workspaces:getAll");
    if (res?.ok) setWorkspaces(res.data);
    setLoading(false);
  }

  async function save(workspace) {
    const res = await window.electronAPI.invoke("workspaces:save", workspace);
    if (res?.ok) load();
    return res;
  }

  async function remove(id) {
    const res = await window.electronAPI.invoke("workspaces:delete", { id });
    if (res?.ok) load();
    return res;
  }

  useEffect(() => {
    load();
  }, []);

  return { workspaces, loading, reloadWorkspaces: load, saveWorkspace: save, deleteWorkspace: remove };
}

// =============================================================================
// END OF FILE
// =============================================================================
