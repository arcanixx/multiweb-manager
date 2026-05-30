// =============================================================================
// FILE: ProjectManager.jsx
// PATH: src/ui/projects/ProjectManager.jsx
// VERSION: 0.0.3
// PURPOSE: Zarządzanie projektami – lista, dodawanie, usuwanie, edycja
// FUNCTIONS: ProjectManager
// DEPENDS ON: react, projectsStore.js, translations.js, loggerRenderer.js, icons.js, ConfirmModal.jsx, ProjectModal.jsx
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useEffect, useContext } from 'react';
import { loadProjects, saveProjects, deleteProject, updateProject } from '../../core/projectsStore.js';
import { TranslationContext } from '../../utils/translations.js';
import { logInfo, logError } from '../../utils/loggerRenderer.js';
import { ICONS } from '../../utils/icons.js';
import ConfirmModal from '../modals/ConfirmModal.jsx';
import ProjectModal from './ProjectModal.jsx';

export default function ProjectManager() {
  const { t } = useContext(TranslationContext);
  const [projects, setProjects] = useState([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  // ─── loadData() – ładuję listę projektów
  const loadData = async () => {
    try {
      setLoading(true);
      const projectsData = await loadProjects();
      setProjects(projectsData);
      logInfo('ProjectManager: loaded projects');
    } catch (error) {
      logError('ProjectManager: failed to load projects', error);
    } finally {
      setLoading(false);
    }
  };

  // ─── handleSaveProject() – zapisuje nowy lub aktualizuje istniejący projekt
  const handleSaveProject = async (projectData) => {
    try {
      let updatedProjects;
      if (editingProject) {
        updatedProjects = projects.map(p =>
          p.id === editingProject.id ? { ...projectData, id: editingProject.id } : p
        );
        await updateProject(editingProject.id, projectData);
        logInfo(`ProjectManager: updated project ${editingProject.id}`);
      } else {
        const newProject = { ...projectData, id: Date.now() };
        updatedProjects = [...projects, newProject];
        await saveProjects(updatedProjects);
        logInfo(`ProjectManager: added project ${newProject.id}`);
      }
      setProjects(updatedProjects);
      setShowProjectModal(false);
      setEditingProject(null);
    } catch (error) {
      logError('ProjectManager: failed to save project', error);
    }
  };

  // ─── handleDeleteClick() – ustawia projekt do usunięcia i otwiera modal potwierdzenia
  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setShowDeleteConfirm(true);
  };

  // ─── handleDeleteConfirm() – usuwa projekt po potwierdzeniu
  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    try {
      await deleteProject(projectToDelete.id);
      setProjects(projects.filter(p => p.id !== projectToDelete.id));
      logInfo(`ProjectManager: deleted project ${projectToDelete.id}`);
    } catch (error) {
      logError('ProjectManager: failed to delete project', error);
    } finally {
      setShowDeleteConfirm(false);
      setProjectToDelete(null);
    }
  };

  // ─── handleEdit() – otwiera modal edycji projektu
  const handleEdit = (project) => {
    setEditingProject(project);
    setShowProjectModal(true);
  };

  if (loading) return <div className="loading">{t('common.loading')}</div>;

  return (
    <div className="project-manager">
      <div className="project-manager-header">
        <h2>{t('projectManager.title')}</h2>
        <button className="btn-primary" onClick={() => {
          setEditingProject(null);
          setShowProjectModal(true);
        }}>
          {ICONS.ADD} {t('projectManager.add_project')}
        </button>
      </div>

      <div className="project-list">
        {projects.length === 0 && (
          <div className="empty-state">{t('projectManager.no_projects')}</div>
        )}
        {projects.map(project => (
          <div key={project.id} className="project-item">
            <div className="project-info">
              <span className="project-name">{project.name}</span>
              <span className="project-path">{project.path}</span>
            </div>
            <div className="project-actions">
              <button className="btn-icon" onClick={() => handleEdit(project)} title={t('common.edit')}>
                {ICONS.EDIT}
              </button>
              <button className="btn-icon" onClick={() => handleDeleteClick(project)} title={t('common.delete')}>
                {ICONS.DELETE}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showProjectModal && (
        <ProjectModal
          project={editingProject}
          onSave={handleSaveProject}
          onClose={() => {
            setShowProjectModal(false);
            setEditingProject(null);
          }}
        />
      )}

      <ConfirmModal
        isOpen={showDeleteConfirm}
        title={t('projects.delete')}
        message={t('projects.delete_confirm')}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setProjectToDelete(null);
        }}
      />
    </div>
  );
}