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
import { log, logInfo, logError, logWarn } from '../../utils/loggerRenderer.js';
import ProjectModal from './ProjectModal';
import ProjectList from './ProjectList';

// ─── ProjectManager() – główny menedżer projektów z listą, dodawaniem i usuwaniem
//   @param {Object} props – właściwości komponentu
//   @param {Function} props.onOpenTasks – callback otwierania zadań projektu
//   @param {Function} props.onOpenTerminal – callback otwierania terminala projektu
//   @returns {JSX.Element} – renderowany interfejs menedżera projektów
export default function ProjectManager({ onOpenTasks, onOpenTerminal }) {
  const { t } = useContext(TranslationContext);
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  

  // ─── useEffect – ładowanie projektów przy montowaniu
  useEffect(() => {
    try {
      window.electronAPI.getSettings()
        .then(settings => {
          setProjects(settings.projects || []);
          log('ProjectManager: loaded', (settings.projects || []).length, 'projects');
          logInfo(`ProjectManager: loaded ${(settings.projects || []).length} projects`);
        })
        .catch(err => {
          logError('ProjectManager: failed to load settings', err);
          logWarn('Nie można załadować ustawień');
        })
        .finally(() => setLoading(false));
    } catch (err) {
      logError('ProjectManager: load failed', err);
      logWarn('Wystąpił błąd podczas ładowania projektów');
      setLoading(false);
    }
  }, []);
  
  // ─── saveProjects() – zapisuje listę projektów do ustawień
  //   @param {Array} newProjects – nowa lista projektów
  //   @returns {Promise<void>}
  const saveProjects = async (newProjects) => {
    try {
      setProjects(newProjects);
      await window.electronAPI.saveSettings({ projects: newProjects });
      log('ProjectManager: saved', newProjects.length, 'projects');
      logInfo(`ProjectManager: saved ${newProjects.length} projects`);
    } catch (err) {
      logError('ProjectManager: save failed', err);
      logWarn('Wystąpił błąd podczas zapisu projektów');
      throw err;
    }
  };
  
  // ─── addProject() – dodaje nowy projekt do listy
  //   @param {Object} projectData – dane nowego projektu
  //   @param {string} projectData.name – nazwa projektu
  //   @param {string} projectData.path – ścieżka projektu
  //   @returns {Promise<void>}
  const addProject = async ({ name, path }) => {
    try {
      const newProjects = [...projects, { name, path, id: Date.now().toString() }];
      await saveProjects(newProjects);
      setShowModal(false);
      log('ProjectManager: added project:', name);
      logInfo(`ProjectManager: added project ${name}`);
    } catch (err) {
      logError('ProjectManager: add project failed', err);
      logWarn('Wystąpił błąd podczas dodawania projektu');
    }
  };
  
  // ─── deleteProject() – usuwa projekt z listy po potwierdzeniu
  //   @param {string} projectId – identyfikator projektu do usunięcia
  //   @returns {Promise<void>}
  const deleteProject = async (projectId) => {
    try {
      if (!window.confirm(t('projectManager.delete_project') + '?')) return;
      await saveProjects(projects.filter(p => p.id !== projectId));
      log('ProjectManager: deleted project:', projectId);
      logInfo(`ProjectManager: deleted project ${projectId}`);
    } catch (err) {
      logError('ProjectManager: delete project failed', err);
      logWarn('Wystąpił błąd podczas usuwania projektu');
    }
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
