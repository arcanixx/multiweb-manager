// =============================================================================
// FILE: useTasks.js
// PATH: src/hooks/useTasks.js
// VERSION: 0.0.3
// PURPOSE: Hook do tasksStore – pobieranie, dodawanie, aktualizacja, usuwanie load()        pobiera wszystkie taski (tasks:getAll) add(task)     dodaje task (tasks:add) update(id, patch) aktualizuje task (tasks:update) remove(id)    usuwa task (tasks:delete)
// FUNCTIONS: useTasks
// DEPENDS ON: react
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useEffect, useState } from "react";
export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    const res = await window.electronAPI.invoke("tasks:getAll");
    if (res?.ok) setTasks(res.data);
    setLoading(false);
  }
  async function add(task) {
    const res = await window.electronAPI.invoke("tasks:add", task);
    if (res?.ok) load();
    return res;
  }
  async function update(id, patch) {
    const res = await window.electronAPI.invoke("tasks:update", { id, patch });
    if (res?.ok) load();
    return res;
  }
  async function remove(id) {
    const res = await window.electronAPI.invoke("tasks:delete", { id });
    if (res?.ok) load();
    return res;
  }
  useEffect(() => {
    load();
  }, []);
  return { tasks, loading, reloadTasks: load, addTask: add, updateTask: update, deleteTask: remove };
}

