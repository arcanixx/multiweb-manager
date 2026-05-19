// =============================================================================
// FILE: src/components/ProjectManager.jsx
// PATH: multiweb-manager/src/components/ProjectManager.jsx
// VERSION: v1
// PURPOSE: Menedżer projektów. Wyświetla listę projektów (nazwa + ścieżka
//          na dysku). Dla każdego projektu: otwórz zadania, otwórz w terminalu.
//          NAPRAWIONE: saveSettings używa partial patch { projects: [...] }
//          żeby nie nadpisywać innych ustawień.
//          Dodawanie projektu przez modal (nie prompt).
// DEPENDS ON: icons.js, useTranslation.js, logger.js
// FUNCTIONS: loadProjects, addProject, deleteProject,
//            openInTerminal (przez onSelect callback)
// =============================================================================

import React, { useState, useEffect } from 'react';
import { ICONS } from '../../utils/icons';
import { useTranslation } from '../../hooks/useTranslation';
import { log } from '../../utils/loggerRenderer';

// ─── Modal dodawania projektu ────────────────────────────────────────────────
function AddProjectModal({ onSave, onClose, t }) {
  const [name, setName] = useState('');
  const [path, setPath] = useState('');

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 460 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
            {ICONS.FOLDER_ADD} {t('projectManager.add_project')}
          </h2>
          <button className="btn-icon" onClick={onClose}>{ICONS.CLOSE}</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="form-label">{t('projectManager.project_name')}</label>
            <input className="form-input" value={name} autoFocus
              placeholder="np. Unicorn"
              onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="form-label">{t('projectManager.add_project')} – {t('projectManager.project_path')}</label>
            <input className="form-input" value={path}
              placeholder="D:/projects/unicorn"
              onChange={e => setPath(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && name && path && onSave({ name: name.trim(), path: path.trim() })} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 18, justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>{t('profile_modal.cancel')}</button>
          <button className="btn btn-primary"
            onClick={() => name.trim() && path.trim() && onSave({ name: name.trim(), path: path.trim() })}
            disabled={!name.trim() || !path.trim()}>
            {ICONS.SAVE} {t('profile_modal.save')}
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
export default function ProjectManager({ onOpenTasks, onOpenTerminal }) {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // ----------------------------------------------------------------
  // Ładowanie projektów z settings przy starcie
  // ----------------------------------------------------------------
  useEffect(() => {
    window.electronAPI.getSettings()
      .then(settings => {
        setProjects(settings.projects || []);
        setLoading(false);
        log('ProjectManager: loaded', (settings.projects || []).length, 'projects');
      })
      .catch(() => setLoading(false));
  }, []);

  // ----------------------------------------------------------------
  // saveProjects() – zapisuje listę projektów (partial patch)
  //   Nie nadpisuje innych kluczy w settings
  // ----------------------------------------------------------------
  const saveProjects = async (newProjects) => {
    setProjects(newProjects);
    await window.electronAPI.saveSettings({ projects: newProjects });
    log('ProjectManager: saved', newProjects.length, 'projects');
  };

  // ----------------------------------------------------------------
  // addProject() – dodaje nowy projekt i zapisuje
  // ----------------------------------------------------------------
  const addProject = async ({ name, path }) => {
    const newProjects = [...projects, { name, path, id: Date.now().toString() }];
    await saveProjects(newProjects);
    setShowModal(false);
    log('ProjectManager: added project:', name);
  };

  // ----------------------------------------------------------------
  // deleteProject() – usuwa projekt (zadania pozostają w store)
  // ----------------------------------------------------------------
  const deleteProject = async (projectId) => {
    if (!window.confirm(t('projectManager.delete_project') + '?')) return;
    await saveProjects(projects.filter(p => p.id !== projectId));
    log('ProjectManager: deleted project:', projectId);
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '20px 24px', background: 'var(--bg-primary)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* ─── Nagłówek ─── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: 'var(--text-primary)',
            display: 'flex', alignItems: 'center', gap: 10 }}>
            {ICONS.PROJECTMANAGER} {t('projectManager.title')}
          </h1>
          <button className="btn btn-primary" style={{ fontSize: 13 }}
            onClick={() => setShowModal(true)}>
            {ICONS.PLUS} {t('projectManager.add_project')}
          </button>
        </div>

        {/* ─── Loading ─── */}
        {loading && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
            {ICONS.LOADING} Ładowanie...
          </div>
        )}

        {/* ─── Brak projektów ─── */}
        {!loading && projects.length === 0 && (
          <div style={{
            textAlign: 'center', padding: 48,
            color: 'var(--text-muted)', fontSize: 14,
            border: '2px dashed var(--border)', borderRadius: 12
          }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>{ICONS.FOLDER}</div>
            {t('projectManager.no_projects')}
          </div>
        )}

        {/* ─── Lista projektów ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {projects.map(project => (
            <div key={project.id} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 12,
              transition: 'border-color 0.15s'
            }}>
              {/* Ikona + info */}
              <span style={{ fontSize: 24, flexShrink: 0 }}>{ICONS.FOLDER}</span>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>
                  {project.name}
                </div>
                <div style={{
                  fontSize: 12, color: 'var(--text-muted)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}>
                  {ICONS.LINK} {project.path}
                </div>
              </div>

              {/* Akcje */}
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button className="btn btn-secondary" style={{ fontSize: 12 }}
                  onClick={() => onOpenTasks?.(project.name)}
                  title={t('projectManager.open_tasks')}>
                  {ICONS.TASKS} {t('projectManager.open_tasks')}
                </button>
                <button className="btn btn-secondary" style={{ fontSize: 12 }}
                  onClick={() => onOpenTerminal?.({ id: 'terminal', type: 'special', cwd: project.path })}
                  title={t('projectManager.open_terminal')}>
                  {ICONS.TERMINAL} {t('projectManager.open_terminal')}
                </button>
                <button className="btn-icon"
                  onClick={() => deleteProject(project.id)}
                  title={t('projectManager.delete_project')}
                  style={{ color: 'var(--danger)' }}>
                  {ICONS.DELETE}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Modal ─── */}
      {showModal && (
        <AddProjectModal
          onSave={addProject}
          onClose={() => setShowModal(false)}
          t={t}
        />
      )}
    </div>
  );
}
