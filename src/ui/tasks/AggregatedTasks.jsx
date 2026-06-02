// =============================================================================
// FILE: AggregatedTasks.jsx
// PATH: src/ui/tasks/AggregatedTasks.jsx
// VERSION: 0.0.3
// PURPOSE: Widok zbiorczy zadań ze wszystkich projektów
// FUNCTIONS: AggregatedTasks
// DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js, AggregatedProjectSection, AggregatedTaskItem
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useEffect, useCallback, useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
import { logDebug as log, logError, logInfo, logWarn } from '../../utils/loggerRenderer.js';
import AggregatedProjectSection from './AggregatedProjectSection';
import AggregatedTaskItem from './AggregatedTaskItem';

// ─── AggregatedTasks() – widok zbiorczy zadań ze wszystkich projektów
//   @returns {JSX.Element} – renderowany widok zadań

export default function AggregatedTasks() {
  const { t } = useContext(TranslationContext);
  const [allData, setAllData] = useState({});
  const [hidden, setHidden] = useState({});
  const [collapsed, setCollapsed] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  // ─── loadData() – ładuję wszystkie zadania i ustawienia widoczności
//   @returns {Promise<void>}
  const loadData = async () => {
    setLoading(true);
    try {
      const [data, settings] = await Promise.all([
        window.electronAPI.getAllTasks(),
        window.electronAPI.getSettings(),
      ]);
      setAllData(data || {});
      setHidden(settings.hiddenTaskProjects || {});
      setCollapsed(settings.collapsedTaskProjects || {});
      log('AggregatedTasks: loaded, projects:', Object.keys(data || {}).length);
    } catch (err) {
      logError('tasks', 'AggregatedTasks: load failed', err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { loadData(); }, []);
  const toggleVisibility = useCallback((project) => {
    const newHidden = { ...hidden, [project]: !hidden[project] };
    setHidden(newHidden);
    window.electronAPI.saveSettings({ hiddenTaskProjects: newHidden });
  }, [hidden]);
  const toggleCollapse = useCallback((project) => {
    const newCollapsed = { ...collapsed, [project]: !collapsed[project] };
    setCollapsed(newCollapsed);
    window.electronAPI.saveSettings({ collapsedTaskProjects: newCollapsed });
  }, [collapsed]);

// ─── collapseAll() – zwiń wszystkie sekcje projektów
  const collapseAll = () => {
    const all = Object.fromEntries(Object.keys(allData).map(k => [k, true]));
    setCollapsed(all);
    window.electronAPI.saveSettings({ collapsedTaskProjects: all });
  };

  // ─── expandAll() – rozwiń wszystkie sekcje projektów
  const expandAll = () => {
    setCollapsed({});
    window.electronAPI.saveSettings({ collapsedTaskProjects: {} });
  };

  const projects = Object.entries(allData).filter(([name]) =>
    !filter || name.toLowerCase().includes(filter.toLowerCase())
  );

  const totalActive = Object.values(allData).reduce((s, d) => s + (d.active?.length || 0), 0);
  const totalAll = Object.values(allData).reduce((s, d) => s + (d.active?.length || 0) + (d.backlog?.length || 0) + (d.done?.length || 0), 0);

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}><span style={{ fontSize: 24, animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span></div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)' }}>
      <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 20 }}>{ICONS.AGGREGATEDTASKS}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{t('aggregatedTasks.title')}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{totalActive} aktywnych · {totalAll} łącznie · {projects.length} projektów</div>
          </div>
          <button className="btn-icon" style={{ marginLeft: 'auto' }} onClick={loadData} title="Odśwież">{ICONS.REFRESH}</button>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <input className="form-input" style={{ height: 28, fontSize: 12, flex: 1 }} placeholder={t('aggregatedTasks.filter_label') + '...'} value={filter} onChange={e => setFilter(e.target.value)} />
          <button className="btn btn-secondary" style={{ fontSize: 11, padding: '4px 8px' }} onClick={collapseAll}>{t('aggregatedTasks.collapse_all')}</button>
          <button className="btn btn-secondary" style={{ fontSize: 11, padding: '4px 8px' }} onClick={expandAll}>{t('aggregatedTasks.expand_all')}</button>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px' }}>
        {projects.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 13 }}>{t('aggregatedTasks.no_tasks')}</div>}
        {projects.map(([project, taskData]) => (
          <AggregatedProjectSection
            key={project}
            project={project}
            taskData={taskData}
            hidden={hidden[project]}
            collapsed={collapsed[project]}
            onToggleVisibility={() => toggleVisibility(project)}
            onToggleCollapse={() => toggleCollapse(project)}
          />
        ))}
      </div>
    </div>
  );
}
