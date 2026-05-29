// =============================================================================
// FILE: AggregatedProjectSection.jsx
// PATH: src/ui/tasks/AggregatedProjectSection.jsx
// VERSION: 0.0.3
// PURPOSE: Pojedyncza sekcja projektu w widoku zbiorczym
// FUNCTIONS: AggregatedProjectSection
// DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js, AggregatedTaskItem
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useContext } from 'react';
import { logInfo, logError, logWarn, logDebug } from '../utils/loggerRenderer.js';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
import AggregatedTaskItem from './AggregatedTaskItem';

// ─── AggregatedProjectSection() – sekcja projektu z zadaniami w widoku zbiorczym
//   @param {Object} props – właściwości komponentu
//   @param {string} props.project – nazwa projektu
//   @param {Object} props.taskData – dane zadań (active, backlog, done)
//   @param {boolean} props.hidden – czy projekt jest ukryty
//   @param {boolean} props.collapsed – czy sekcja jest zwinięta
//   @param {Function} props.onToggleVisibility – callback przełączania widoczności
//   @param {Function} props.onToggleCollapse – callback przełączania collapse
//   @returns {JSX.Element} – renderowana sekcja projektu

export default function AggregatedProjectSection({ project, taskData, hidden, collapsed, onToggleVisibility, onToggleCollapse }) {
  const { t } = useContext(TranslationContext);
  const active = taskData.active || [];
  const backlog = taskData.backlog || [];
  const done = taskData.done || [];
  if (hidden) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', marginBottom: 4, borderRadius: 6, background: 'var(--bg-secondary)', opacity: 0.5 }}>
        <span style={{ flex: 1, fontSize: 12, color: 'var(--text-muted)' }}>{project} (ukryty)</span>
        <button className="btn-icon" style={{ fontSize: 11 }} onClick={onToggleVisibility} title={t('aggregatedTasks.show_project')}>{ICONS.EYE}</button>
      </div>
    );
  }
  const pinnedTasks = [...active, ...backlog].filter(t => t.pinned);
  const unpinnedActive = active.filter(t => !t.pinned);
  const unpinnedBacklog = backlog.filter(t => !t.pinned);
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 8, marginBottom: 10, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--bg-secondary)', cursor: 'pointer' }} onClick={onToggleCollapse}>
        <span style={{ fontSize: 12 }}>{collapsed ? ICONS.CHEVRON_RIGHT : ICONS.CHEVRON_DOWN}</span>
        <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', flex: 1 }}>{ICONS.FOLDER} {project}</span>
        <span style={{ fontSize: 11, color: '#ef4444' }}>{active.length} aktywnych</span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>· {backlog.length} backlog</span>
        <span style={{ fontSize: 11, color: '#22c55e' }}>· {done.length} done</span>
        <button className="btn-icon" style={{ fontSize: 11 }} onClick={e => { e.stopPropagation(); onToggleVisibility(); }} title={t('aggregatedTasks.hide_project')}>{ICONS.EYE_OFF}</button>
      </div>
      {!collapsed && (
        <div style={{ padding: '6px 8px' }}>
          {pinnedTasks.length > 0 && (
            <div style={{ borderBottom: '1px solid var(--border)', marginBottom: 4, paddingBottom: 4 }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2, paddingLeft: 8 }}>{ICONS.PIN} {t('tasks.pinned_label')}</div>
              {pinnedTasks.map(task => <AggregatedTaskItem key={task.id} task={task} section="active" />)}
            </div>
          )}
          {unpinnedActive.map(task => <AggregatedTaskItem key={task.id} task={task} section="active" />)}
          {unpinnedBacklog.length > 0 && (
            <div style={{ marginTop: 4, paddingTop: 4, borderTop: '1px dashed var(--border)' }}>
              {unpinnedBacklog.map(task => <AggregatedTaskItem key={task.id} task={task} section="backlog" />)}
            </div>
          )}
          {done.length > 0 && (
            <div style={{ marginTop: 4, paddingTop: 4, borderTop: '1px dashed var(--border)' }}>
              {done.map(task => <AggregatedTaskItem key={task.id} task={task} section="done" />)}
            </div>
          )}
          {active.length === 0 && backlog.length === 0 && done.length === 0 && (
            <div style={{ fontSize: 11, color: 'var(--text-muted)', padding: '4px 8px' }}>{t('aggregatedTasks.no_tasks')}</div>
          )}
        </div>
      )}
    </div>
  );
}