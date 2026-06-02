// =============================================================================
// FILE: ProjectList.jsx
// PATH: src/ui/projects/ProjectList.jsx
// VERSION: 0.0.3
// PURPOSE: Lista projektów z akcjami (zadania, terminal, usuwanie)
// FUNCTIONS: ProjectList
// DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
import { logInfo, logError, logWarn } from '../../utils/loggerRenderer.js';

// ─── ProjectList() – lista projektów z przyciskami akcji (zadania, terminal, usuwanie)
//   @param {Object} props – właściwości komponentu
//   @param {Array} props.projects – lista projektów
//   @param {Function} props.onDelete – callback usuwania projektu
//   @param {Function} props.onOpenTasks – callback otwierania zadań projektu
//   @param {Function} props.onOpenTerminal – callback otwierania terminala projektu
//   @returns {JSX.Element} – renderowana lista projektów lub komunikat o braku
export default function ProjectList({ projects, onDelete, onOpenTasks, onOpenTerminal }) {
  const { t } = useContext(TranslationContext);

  // ─── handleDelete() – obsługa usuwania projektu z logowaniem
  //   @param {string} projectId – identyfikator projektu
  //   @returns {void}
  const handleDelete = (projectId) => {
    try {
      logInfo(`ProjectList: deleting project ${projectId}`);
      onDelete?.(projectId);
    } catch (err) {
      logError('ProjectList: delete failed', err);
      logWarn('Wystąpił błąd podczas usuwania projektu');
    }
  };

  // ─── handleOpenTasks() – obsługa otwierania zadań projektu z logowaniem
  //   @param {string} projectName – nazwa projektu
  //   @returns {void}
  const handleOpenTasks = (projectName) => {
    try {
      logInfo(`ProjectList: opening tasks for ${projectName}`);
      onOpenTasks?.(projectName);
    } catch (err) {
      logError('ProjectList: open tasks failed', err);
      logWarn('Wystąpił błąd podczas otwierania zadań');
    }
  };

  // ─── handleOpenTerminal() – obsługa otwierania terminala projektu z logowaniem
  //   @param {Object} terminalConfig – konfiguracja terminala
  //   @returns {void}
  const handleOpenTerminal = (terminalConfig) => {
    try {
      logInfo(`ProjectList: opening terminal for ${terminalConfig.cwd}`);
      onOpenTerminal?.(terminalConfig);
    } catch (err) {
      logError('ProjectList: open terminal failed', err);
      logWarn('Wystąpił błąd podczas otwierania terminala');
    }
  };

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
              <button className="btn btn-secondary" style={{ fontSize: 12 }} onClick={() => handleOpenTasks(project.name)} title={t('projectManager.open_tasks')}>
              {ICONS.TASKS} {t('projectManager.open_tasks')}
            </button>
              <button className="btn btn-secondary" style={{ fontSize: 12 }} onClick={() => handleOpenTerminal({ id: 'terminal', type: 'special', cwd: project.path })} title={t('projectManager.open_terminal')}>
              {ICONS.TERMINAL} {t('projectManager.open_terminal')}
            </button>
              <button className="btn-icon" onClick={() => handleDelete(project.id)} title={t('projectManager.delete_project')} style={{ color: 'var(--danger)' }}>
              {ICONS.DELETE}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}