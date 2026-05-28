// =============================================================================
// FILE: ProjectManager.jsx
// PATH: src/ui/projects/ProjectManager.jsx
// VERSION: 0.0.3
// PURPOSE: Główny menedżer projektów – lista, dodawanie, usuwanie
// FUNCTIONS: ProjectManager
// DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js, ProjectModal, ProjectList
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useEffect, useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
import { log } from '../../utils/loggerRenderer.js';
import ProjectModal from './ProjectModal';
import ProjectList from './ProjectList';
export default function ProjectManager({ onOpenTasks, onOpenTerminal }) {
  const { t } = useContext(TranslationContext);
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    window.electronAPI.getSettings()
      .then(settings => {
        setProjects(settings.projects || []);
        setLoading(false);
        log('ProjectManager: loaded', (settings.projects || []).length, 'projects');
      })
      .catch(() => setLoading(false));
  }, []);
  const saveProjects = async (newProjects) => {
    setProjects(newProjects);
    await window.electronAPI.saveSettings({ projects: newProjects });
    log('ProjectManager: saved', newProjects.length, 'projects');
  };
  const addProject = async ({ name, path }) => {
    const newProjects = [...projects, { name, path, id: Date.now().toString() }];
    await saveProjects(newProjects);
    setShowModal(false);
    log('ProjectManager: added project:', name);
  };
  const deleteProject = async (projectId) => {
    if (!window.confirm(t('projectManager.delete_project') + '?')) return;
    await saveProjects(projects.filter(p => p.id !== projectId));
    log('ProjectManager: deleted project:', projectId);
  };
  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>{ICONS.LOADING} {t('common.loading')}</div>;
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '20px 24px', background: 'var(--bg-primary)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
            {ICONS.PROJECTMANAGER} {t('projectManager.title')}
          </h1>
          <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={() => setShowModal(true)}>
            {ICONS.PLUS} {t('projectManager.add_project')}
          </button>
        </div>
        <ProjectList projects={projects} onDelete={deleteProject} onOpenTasks={onOpenTasks} onOpenTerminal={onOpenTerminal} />
        {showModal && <ProjectModal onSave={addProject} onClose={() => setShowModal(false)} />}
      </div>
    </div>
  );
}