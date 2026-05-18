// =============================================================================
// FILE: src/components/AggregatedTasks.jsx
// PATH: multiweb-manager/src/components/AggregatedTasks.jsx
// VERSION: v1
// PURPOSE: Widok zbiorczy zadań ze wszystkich projektów. Każdy projekt to
//          sekcja rozwijana/zwijana, z możliwością ukrycia widoczności.
//          Ustawienia widoczności i zwijania zapisywane do settings (partial).
//          NAPRAWIONE: saveSettings używa partial patch zamiast nadpisywać całe settings.
// DEPENDS ON: icons.js, useTranslation.js, logger.js
// FUNCTIONS: loadData, toggleVisibility, toggleCollapse, renderTask
// =============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { ICONS } from '../utils/icons';
import { useTranslation } from '../hooks/useTranslation';
import { log, error as logError } from '../utils/logger';

const PRIORITY_COLORS = {
  A: '#ef4444',
  B: '#f97316',
  C: '#eab308',
  D: '#3b82f6',
  E: '#22c55e',
};

export default function AggregatedTasks() {
  const { t } = useTranslation();
  const [allData,  setAllData]  = useState({});  // { projectName: { active, backlog, done } }
  const [hidden,   setHidden]   = useState({});  // { projectName: bool }
  const [collapsed,setCollapsed]= useState({});  // { projectName: bool }
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('');  // Filtr nazwy projektu

  // ----------------------------------------------------------------
  // Ładowanie danych przy starcie
  // ----------------------------------------------------------------
  useEffect(() => {
    loadData();
  }, []);

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
      logError('AggregatedTasks: load failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------------------
  // toggleVisibility() – ukrywa/pokazuje projekt w widoku
  //   WAŻNE: używa partial patch żeby nie nadpisać reszty settings
  // ----------------------------------------------------------------
  const toggleVisibility = useCallback((project) => {
    const newHidden = { ...hidden, [project]: !hidden[project] };
    setHidden(newHidden);
    window.electronAPI.saveSettings({ hiddenTaskProjects: newHidden });
    log('AggregatedTasks: visibility toggled:', project);
  }, [hidden]);

  // ----------------------------------------------------------------
  // toggleCollapse() – zwija/rozwija projekt
  // ----------------------------------------------------------------
  const toggleCollapse = useCallback((project) => {
    const newCollapsed = { ...collapsed, [project]: !collapsed[project] };
    setCollapsed(newCollapsed);
    window.electronAPI.saveSettings({ collapsedTaskProjects: newCollapsed });
    log('AggregatedTasks: collapse toggled:', project);
  }, [collapsed]);

  // ----------------------------------------------------------------
  // collapseAll() / expandAll() – masowe operacje
  // ----------------------------------------------------------------
  const collapseAll = () => {
    const all = Object.fromEntries(Object.keys(allData).map(k => [k, true]));
    setCollapsed(all);
    window.electronAPI.saveSettings({ collapsedTaskProjects: all });
  };

  const expandAll = () => {
    setCollapsed({});
    window.electronAPI.saveSettings({ collapsedTaskProjects: {} });
  };

  // ----------------------------------------------------------------
  // renderTask() – renderuje pojedyncze zadanie w widoku zbiorczym
  // ----------------------------------------------------------------
  const renderTask = (task, section) => {
    const pColor = PRIORITY_COLORS[task.priority] || '#94a3b8';
    return (
      <div key={task.id} style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '4px 8px', borderRadius: 4, fontSize: 12,
        color: section === 'done' ? 'var(--text-muted)' : 'var(--text-primary)',
        textDecoration: section === 'done' ? 'line-through' : 'none',
      }}>
        <div className="priority-dot" style={{ background: pColor, flexShrink: 0 }} />
        {task.pinned && <span style={{ fontSize: 10 }}>{ICONS.PIN}</span>}
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {task.name}
        </span>
        {task.comment && (
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{ICONS.COMMENT}</span>
        )}
        {task.version && (
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>v{task.version}</span>
        )}
      </div>
    );
  };

  // Filtrowanie projektów
  const projects = Object.entries(allData).filter(([name]) =>
    !filter || name.toLowerCase().includes(filter.toLowerCase())
  );

  // Liczniki zadań
  const totalActive = Object.values(allData).reduce((s, d) => s + (d.active?.length || 0), 0);
  const totalAll    = Object.values(allData).reduce((s, d) =>
    s + (d.active?.length || 0) + (d.backlog?.length || 0) + (d.done?.length || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)' }}>

      {/* ─── Nagłówek ─── */}
      <div style={{
        padding: '14px 16px 10px', borderBottom: '1px solid var(--border)',
        background: 'var(--bg-secondary)', flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 20 }}>{ICONS.AGGREGATEDTASKS}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>
              {t('aggregatedTasks.title')}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {totalActive} aktywnych · {totalAll} łącznie · {projects.length} projektów
            </div>
          </div>
          <button className="btn-icon" style={{ marginLeft: 'auto' }}
            onClick={loadData} title="Odśwież">
            {ICONS.REFRESH}
          </button>
        </div>

        {/* Filtry + akcje */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <input className="form-input" style={{ height: 28, fontSize: 12, flex: 1 }}
            placeholder={t('aggregatedTasks.filter_label') + '...'}
            value={filter} onChange={e => setFilter(e.target.value)} />
          <button className="btn btn-secondary" style={{ fontSize: 11, padding: '4px 8px' }}
            onClick={collapseAll}>{t('aggregatedTasks.collapse_all')}</button>
          <button className="btn btn-secondary" style={{ fontSize: 11, padding: '4px 8px' }}
            onClick={expandAll}>{t('aggregatedTasks.expand_all')}</button>
        </div>
      </div>

      {/* ─── Lista projektów ─── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px' }}>

        {loading && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
            <span style={{ fontSize: 24, animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
          </div>
        )}

        {!loading && projects.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 13 }}>
            {t('aggregatedTasks.no_tasks')}
          </div>
        )}

        {!loading && projects.map(([project, taskData]) => {
          if (hidden[project]) {
            // Ukryty – pokaż tylko nagłówek z przyciskiem przywracania
            return (
              <div key={project} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '4px 8px', marginBottom: 4, borderRadius: 6,
                background: 'var(--bg-secondary)', opacity: 0.5
              }}>
                <span style={{ flex: 1, fontSize: 12, color: 'var(--text-muted)' }}>
                  {project} (ukryty)
                </span>
                <button className="btn-icon" style={{ fontSize: 11 }}
                  onClick={() => toggleVisibility(project)} title={t('aggregatedTasks.show_project')}>
                  {ICONS.EYE}
                </button>
              </div>
            );
          }

          const active  = taskData.active  || [];
          const backlog = taskData.backlog  || [];
          const done    = taskData.done     || [];
          const isCollapsed = collapsed[project];

          return (
            <div key={project} style={{
              border: '1px solid var(--border)', borderRadius: 8,
              marginBottom: 10, overflow: 'hidden'
            }}>
              {/* Nagłówek projektu */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 12px', background: 'var(--bg-secondary)',
                cursor: 'pointer'
              }} onClick={() => toggleCollapse(project)}>
                <span style={{ fontSize: 12 }}>
                  {isCollapsed ? ICONS.CHEVRON_RIGHT : ICONS.CHEVRON_DOWN}
                </span>
                <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', flex: 1 }}>
                  {ICONS.FOLDER} {project}
                </span>
                {/* Liczniki */}
                <span style={{ fontSize: 11, color: '#ef4444' }}>{active.length} aktywnych</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>· {backlog.length} backlog</span>
                <span style={{ fontSize: 11, color: '#22c55e' }}>· {done.length} done</span>
                <button className="btn-icon" style={{ fontSize: 11 }}
                  onClick={e => { e.stopPropagation(); toggleVisibility(project); }}
                  title={t('aggregatedTasks.hide_project')}>
                  {ICONS.EYE_OFF}
                </button>
              </div>

              {/* Zadania */}
              {!isCollapsed && (
                <div style={{ padding: '6px 8px' }}>
                  {/* Przypięte na górze */}
                  {[...active, ...backlog].filter(t => t.pinned).length > 0 && (
                    <div style={{
                      borderBottom: '1px solid var(--border)', marginBottom: 4, paddingBottom: 4
                    }}>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2, paddingLeft: 8 }}>
                        {ICONS.PIN} {t('tasks.pinned_label')}
                      </div>
                      {[...active, ...backlog].filter(t => t.pinned).map(task =>
                        renderTask(task, 'active')
                      )}
                    </div>
                  )}

                  {/* Aktywne */}
                  {active.filter(t => !t.pinned).map(task => renderTask(task, 'active'))}

                  {/* Backlog */}
                  {backlog.filter(t => !t.pinned).length > 0 && (
                    <div style={{ marginTop: 4, paddingTop: 4, borderTop: '1px dashed var(--border)' }}>
                      {backlog.filter(t => !t.pinned).map(task => renderTask(task, 'backlog'))}
                    </div>
                  )}

                  {/* Done */}
                  {done.length > 0 && (
                    <div style={{ marginTop: 4, paddingTop: 4, borderTop: '1px dashed var(--border)' }}>
                      {done.map(task => renderTask(task, 'done'))}
                    </div>
                  )}

                  {active.length === 0 && backlog.length === 0 && done.length === 0 && (
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', padding: '4px 8px' }}>
                      {t('aggregatedTasks.no_tasks')}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
