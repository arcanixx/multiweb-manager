// =============================================================================
// FILE: AggregatedTasks.jsx
// PATH: src/ui/tasks/AggregatedTasks.jsx
// VERSION: 0.0.3
// PURPOSE: Widok zbiorczy zadań ze wszystkich grup (TaskGroup). Filtrowanie po statusie, priorytecie, sekcji. Zwijanie/rozwijanie per grupa.
// FUNCTIONS: AggregatedTasks
// DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js, AggregatedProjectSection.jsx
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
import { logError, logInfo } from '../../utils/loggerRenderer.js';
import AggregatedProjectSection from './AggregatedProjectSection.jsx';

const STATUSES   = ['in_progress', 'todo', 'blocked', 'done', 'cancelled'];
const PRIORITIES = ['A', 'B', 'C', 'D', 'E'];
const SECTIONS   = ['active', 'backlog', 'done'];

// ─── AggregatedTasks() – dashboard zbiorczy zadań
export default function AggregatedTasks() {
  const { t } = useContext(TranslationContext);

  const [allTasks,   setAllTasks]   = useState([]);  // płaska lista Task[] z groupName
  const [collapsed,  setCollapsed]  = useState({});  // { groupId: bool }
  const [hidden,     setHidden]     = useState({});  // { groupId: bool }
  const [loading,    setLoading]    = useState(true);

  // Filtry
  const [filterText,     setFilterText]     = useState('');
  const [filterStatus,   setFilterStatus]   = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterSection,  setFilterSection]  = useState('');

  // ─── loadData() – ładuje wszystkie zadania przez aggregatedTasks:getAll
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [tasksRes, settings] = await Promise.all([
        window.electronAPI.invoke('aggregatedTasks:getAll'),
        window.electronAPI.getSettings(),
      ]);
      if (tasksRes?.ok) {
        setAllTasks(tasksRes.data || []);
        logInfo('tasks', 'AggregatedTasks: loaded', tasksRes.data?.length);
      } else {
        logError('tasks', 'AggregatedTasks: load failed', tasksRes?.error);
      }
      setHidden(settings?.hiddenTaskGroups   || {});
      setCollapsed(settings?.collapsedTaskGroups || {});
    } catch (err) {
      logError('tasks', 'AggregatedTasks: load exception', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ─── grouped – grupuje płaską listę per groupId po zastosowaniu filtrów
  const grouped = useMemo(() => {
    let tasks = allTasks;
    if (filterStatus)   tasks = tasks.filter(t => t.status   === filterStatus);
    if (filterPriority) tasks = tasks.filter(t => t.priority === filterPriority);
    if (filterSection)  tasks = tasks.filter(t => t.section  === filterSection);
    if (filterText)     tasks = tasks.filter(t =>
      (t.groupName || '').toLowerCase().includes(filterText.toLowerCase()) ||
      (t.name || '').toLowerCase().includes(filterText.toLowerCase())
    );

    const map = {};
    for (const task of tasks) {
      const key = task.taskGroupId || 'unknown';
      if (!map[key]) map[key] = { groupId: key, groupName: task.groupName || key, tasks: [] };
      map[key].tasks.push(task);
    }
    return Object.values(map);
  }, [allTasks, filterStatus, filterPriority, filterSection, filterText]);

  // Statystyki nagłówka (z pełnej listy, bez filtrów)
  const totalActive = allTasks.filter(t => t.section === 'active').length;
  const totalAll    = allTasks.length;
  const totalGroups = new Set(allTasks.map(t => t.taskGroupId)).size;

  // ─── toggleCollapse / toggleHidden – z persist w settings
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
  const hasFilter = filterText || filterStatus || filterPriority || filterSection;

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
        <span style={{ fontSize: 24 }}>{ICONS.LOADING}</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)' }}>

      {/* ─── Nagłówek ─── */}
      <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 20 }}>{ICONS.AGGREGATEDTASKS}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>
              {t('aggregatedTasks.title')}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {totalActive} {t('aggregatedTasks.stat_active')} · {totalAll} {t('aggregatedTasks.stat_total')} · {totalGroups} {t('aggregatedTasks.stat_groups')}
            </div>
          </div>
          <button className="btn-icon" style={{ marginLeft: 'auto' }} onClick={loadData} title={t('common.refresh')}>
            {ICONS.REFRESH}
          </button>
        </div>

        {/* ─── Filtry ─── */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            className="form-input"
            style={{ height: 28, fontSize: 12, flex: '1 1 120px', minWidth: 80 }}
            placeholder={t('aggregatedTasks.filter_label')}
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
          />
          <select className="form-select" style={{ height: 28, fontSize: 12, flex: '0 0 auto' }}
            value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">{t('aggregatedTasks.filter_all_statuses')}</option>
            {STATUSES.map(s => <option key={s} value={s}>{t(`tasks.status_${s}`)}</option>)}
          </select>
          <select className="form-select" style={{ height: 28, fontSize: 12, flex: '0 0 auto' }}
            value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
            <option value="">{t('aggregatedTasks.filter_all_priorities')}</option>
            {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select className="form-select" style={{ height: 28, fontSize: 12, flex: '0 0 auto' }}
            value={filterSection} onChange={e => setFilterSection(e.target.value)}>
            <option value="">{t('aggregatedTasks.filter_all_sections')}</option>
            {SECTIONS.map(s => <option key={s} value={s}>{t(`tasks.section_${s}`)}</option>)}
          </select>
        </div>

        {/* ─── Akcje zwijania ─── */}
        <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
          <button className="btn btn-secondary" style={{ fontSize: 11, padding: '3px 8px' }} onClick={collapseAll}>
            {t('aggregatedTasks.collapse_all')}
          </button>
          <button className="btn btn-secondary" style={{ fontSize: 11, padding: '3px 8px' }} onClick={expandAll}>
            {t('aggregatedTasks.expand_all')}
          </button>
          {hasFilter && (
            <button className="btn btn-secondary" style={{ fontSize: 11, padding: '3px 8px' }} onClick={clearFilters}>
              {t('aggregatedTasks.clear_filters')}
            </button>
          )}
        </div>
      </div>

      {/* ─── Lista grup ─── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px' }}>
        {grouped.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 13 }}>
            {hasFilter ? t('aggregatedTasks.no_results') : t('aggregatedTasks.no_tasks')}
          </div>
        )}
        {grouped.map(({ groupId, groupName, tasks }) => (
          <AggregatedProjectSection
            key={groupId}
            groupId={groupId}
            groupName={groupName}
            tasks={tasks}
            hidden={hidden[groupId]}
            collapsed={collapsed[groupId]}
            onToggleHidden={() => toggleHidden(groupId)}
            onToggleCollapse={() => toggleCollapse(groupId)}
          />
        ))}
      </div>
    </div>
  );
}