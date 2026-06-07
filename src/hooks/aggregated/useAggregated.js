// =============================================================================
// FILE: useAggregatedTasks.js
// PATH: src/hooks/useAggregatedTasks.js
// VERSION: 0.0.3
// PURPOSE: Hook logiki widoku zbiorczego zadań – ładowanie danych, filtrowanie, grupowanie, zwijanie/ukrywanie grup
// FUNCTIONS: useAggregatedTasks
// DEPENDS ON: react, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import { logError, logInfo } from '../../utils/loggerRenderer.js';

export const STATUSES   = ['in_progress', 'todo', 'blocked', 'done', 'cancelled'];
export const PRIORITIES = ['A', 'B', 'C', 'D', 'E'];
export const SECTIONS   = ['active', 'backlog', 'done'];

// ─── useAggregatedTasks() – dane i logika widoku zbiorczego zadań
export function useAggregatedTasks() {
  const [allTasks,       setAllTasks]       = useState([]);
  const [collapsed,      setCollapsed]      = useState({});
  const [hidden,         setHidden]         = useState({});
  const [loading,        setLoading]        = useState(true);
  const [filterText,     setFilterText]     = useState('');
  const [filterStatus,   setFilterStatus]   = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterSection,  setFilterSection]  = useState('');

  // ─── loadData() – ładuje zadania i stan UI z IPC
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [tasksRes, settings] = await Promise.all([
        window.electronAPI.invoke('tasks:getAllGrouped'),
        window.electronAPI.getSettings(),
      ]);
      if (tasksRes?.ok) {
        setAllTasks(tasksRes.data || []);
        logInfo('tasks', 'useAggregatedTasks: loaded', tasksRes.data?.length);
      } else {
        logError('tasks', 'useAggregatedTasks: load failed', tasksRes?.error);
      }
      setHidden(settings?.hiddenTaskGroups    || {});
      setCollapsed(settings?.collapsedTaskGroups || {});
    } catch (err) {
      logError('tasks', 'useAggregatedTasks: exception', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ─── grouped – grupuje płaską listę per groupId z zastosowanymi filtrami
  const grouped = useMemo(() => {
    let tasks = allTasks;
    if (filterStatus)   tasks = tasks.filter(t => t.status   === filterStatus);
    if (filterPriority) tasks = tasks.filter(t => t.priority === filterPriority);
    if (filterSection)  tasks = tasks.filter(t => t.section  === filterSection);
    if (filterText)     tasks = tasks.filter(t =>
      (t.groupName || '').toLowerCase().includes(filterText.toLowerCase()) ||
      (t.name      || '').toLowerCase().includes(filterText.toLowerCase())
    );
    const map = {};
    for (const task of tasks) {
      const key = task.taskGroupId || 'unknown';
      if (!map[key]) map[key] = { groupId: key, groupName: task.groupName || key, tasks: [] };
      map[key].tasks.push(task);
    }
    return Object.values(map);
  }, [allTasks, filterStatus, filterPriority, filterSection, filterText]);

  const totalActive = allTasks.filter(t => t.section === 'active').length;
  const totalAll    = allTasks.length;
  const totalGroups = new Set(allTasks.map(t => t.taskGroupId)).size;
  const hasFilter   = filterText || filterStatus || filterPriority || filterSection;

  const toggleCollapse = useCallback((groupId) => {
    const next = { ...collapsed, [groupId]: !collapsed[groupId] };
    setCollapsed(next);
    window.electronAPI.saveSettings({ collapsedTaskGroups: next }).catch(() => {});
  }, [collapsed]);

  const toggleHidden = useCallback((groupId) => {
    const next = { ...hidden, [groupId]: !hidden[groupId] };
    setHidden(next);
    window.electronAPI.saveSettings({ hiddenTaskGroups: next }).catch(() => {});
  }, [hidden]);

  const collapseAll = () => {
    const next = Object.fromEntries(grouped.map(g => [g.groupId, true]));
    setCollapsed(next);
    window.electronAPI.saveSettings({ collapsedTaskGroups: next }).catch(() => {});
  };

  const expandAll = () => {
    setCollapsed({});
    window.electronAPI.saveSettings({ collapsedTaskGroups: {} }).catch(() => {});
  };

  const clearFilters = () => {
    setFilterText(''); setFilterStatus(''); setFilterPriority(''); setFilterSection('');
  };

  return {
    loading, grouped, hasFilter,
    totalActive, totalAll, totalGroups,
    collapsed, hidden,
    filterText, filterStatus, filterPriority, filterSection,
    setFilterText, setFilterStatus, setFilterPriority, setFilterSection,
    loadData, toggleCollapse, toggleHidden, collapseAll, expandAll, clearFilters,
  };
}
