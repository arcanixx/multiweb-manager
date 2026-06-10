// =============================================================================
// FILE: useProjects.js
// PATH: src/hooks/useProjects.js
// VERSION: 0.0.3
// PURPOSE: Hook React do zarządzania projektami użytkownika – CRUD przez mostek IPC z optimistic updates i rollbackiem.
// FUNCTIONS: useProjects
// DEPENDS ON: react, loggerRenderer.js, useAsync.js, ipcChannels.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useCallback, useState, useEffect } from 'react';
import { logWarn } from '../utils/loggerRenderer.js';
import { useAsync, useAsyncMutation } from './useAsync.js';
import { IPC_CHANNELS } from '../constants/ipcChannels.js';

// ─── useProjects() – hook do zarządzania projektami z optimistic updates
//   @returns {Object} – projects, loading, error, reloadProjects, addProject, updateProject, deleteProject
export function useProjects() {
  // Lokalny stan dla optimistic updates (zsynchronizowany z danymi z useAsync)
  const [projects, setProjects] = useState([]);

  // ─── loadFn – ładuje wszystkie projekty przez IPC
  const loadFn = useCallback(
    () => window.electronAPI.invoke(IPC_CHANNELS.PROJECTS.GET_ALL),
    []
  );

  const { data: serverProjects, loading, error, execute: reloadProjects } = useAsync(loadFn, {
    key: 'useProjects',
    initialData: [],
    runOnMount: true,
  });

  // Synchronizuj lokalny stan z danymi serwera po każdym załadowaniu
  useEffect(() => {
    if (serverProjects) setProjects(serverProjects);
  }, [serverProjects]);

  if (error) logWarn('store', `useProjects: ${error}`);

  // ─── addProject – dodaje nowy projekt z optimistic update
  const { execute: addProject, loading: adding } = useAsyncMutation(
    (project) => window.electronAPI.invoke(IPC_CHANNELS.PROJECTS.CREATE, project),
    {
      key: 'useProjects.add',
      onMutate: (project) => {
        const snapshot = [...projects];
        setProjects(prev => [...prev, { ...project, _optimistic: true }]);
        return { snapshot };
      },
      onSuccess: (data) => { if (data) setProjects(data); else reloadProjects(); },
      onError:   (_, ctx) => setProjects(ctx?.snapshot ?? projects),
    }
  );

  // ─── updateProject – aktualizuje istniejący projekt z optimistic update
  //   @param {string} id    – ID projektu
  //   @param {Object} patch – pola do zaktualizowania
  const { execute: _updateExecute, loading: updating } = useAsyncMutation(
    ({ id, patch }) => window.electronAPI.invoke(IPC_CHANNELS.PROJECTS.UPDATE, { id, patch }),
    {
      key: 'useProjects.update',
      onMutate: ({ id, patch }) => {
        const snapshot = [...projects];
        setProjects(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p));
        return { snapshot };
      },
      onSuccess: (data) => { if (data) setProjects(data); else reloadProjects(); },
      onError:   (_, ctx) => setProjects(ctx?.snapshot ?? projects),
    }
  );
  const updateProject = useCallback(
    (id, patch) => _updateExecute({ id, patch }),
    [_updateExecute]
  );

  // ─── deleteProject – usuwa projekt z optimistic update
  const { execute: deleteProject, loading: deleting } = useAsyncMutation(
    (id) => window.electronAPI.invoke(IPC_CHANNELS.PROJECTS.DELETE, { id }),
    {
      key: 'useProjects.delete',
      onMutate: (id) => {
        const snapshot = [...projects];
        setProjects(prev => prev.filter(p => p.id !== id));
        return { snapshot };
      },
      onSuccess: (data) => { if (data) setProjects(data); else reloadProjects(); },
      onError:   (_, ctx) => setProjects(ctx?.snapshot ?? projects),
    }
  );

  return {
    projects, loading, error,
    reloadProjects,
    addProject,    adding,
    updateProject, updating,
    deleteProject, deleting,
  };
}
