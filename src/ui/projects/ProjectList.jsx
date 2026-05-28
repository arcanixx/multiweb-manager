// =============================================================================
// FILE: ProjectList.jsx
// PATH: src/ui/projects/ProjectList.jsx
// VERSION: 0.0.3
// PURPOSE: Lista projektów z akcjami (zadania, terminal, usuwanie)
// FUNCTIONS: ProjectList
// DEPENDS ON: react, translations.js, icons.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
export default function ProjectList({ projects, onDelete, onOpenTasks, onOpenTerminal }) {
  const { t } = useContext(TranslationContext);
  if (projects.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)', fontSize: 14,
        border: '2px dashed var(--border)', borderRadius: 12 }}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>{ICONS.FOLDER}</div>
        {t('projectManager.no_projects')}
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {projects.map(project => (
        <div key={project.id} style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10,
          padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12
        }}>
          <span style={{ fontSize: 24, flexShrink: 0 }}>{ICONS.FOLDER}</span>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{project.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {ICONS.LINK} {project.path}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <button className="btn btn-secondary" style={{ fontSize: 12 }} onClick={() => onOpenTasks?.(project.name)} title={t('projectManager.open_tasks')}>
              {ICONS.TASKS} {t('projectManager.open_tasks')}
            </button>
            <button className="btn btn-secondary" style={{ fontSize: 12 }} onClick={() => onOpenTerminal?.({ id: 'terminal', type: 'special', cwd: project.path })} title={t('projectManager.open_terminal')}>
              {ICONS.TERMINAL} {t('projectManager.open_terminal')}
            </button>
            <button className="btn-icon" onClick={() => onDelete(project.id)} title={t('projectManager.delete_project')} style={{ color: 'var(--danger)' }}>
              {ICONS.DELETE}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}