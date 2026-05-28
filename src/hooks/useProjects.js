// =============================================================================
// FILE: useProjects.js
// PATH: src/hooks/useProjects.js
// VERSION: 0.0.3
// PURPOSE: Hook do projectsStore – lista projektów, CRUD load()           pobiera wszystkie projekty (projects:getAll) add(project)     dodaje projekt (projects:add) update(id,patch) aktualizuje projekt (projects:update) remove(id)       usuwa projekt (projects:delete)
// FUNCTIONS: useProjects
// DEPENDS ON: react
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useEffect, useState } from "react";
export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    const res = await window.electronAPI.invoke("projects:getAll");
    if (res?.ok) setProjects(res.data);
    setLoading(false);
  }
  async function add(project) {
    const res = await window.electronAPI.invoke("projects:add", project);
    if (res?.ok) load();
    return res;
  }
  async function update(id, patch) {
    const res = await window.electronAPI.invoke("projects:update", { id, patch });
    if (res?.ok) load();
    return res;
  }
  async function remove(id) {
    const res = await window.electronAPI.invoke("projects:delete", { id });
    if (res?.ok) load();
    return res;
  }
  useEffect(() => {
    load();
  }, []);
  return { projects, loading, reloadProjects: load, addProject: add, updateProject: update, deleteProject: remove };
}

