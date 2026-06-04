// =============================================================================
// FILE: ProjectManager.jsx
// PATH: src/ui/projects/ProjectManager.jsx
// VERSION: 0.0.3
// PURPOSE: Zarządzanie projektami – lista, dodawanie, usuwanie, edycja przez hook IPC useProjects.
// FUNCTIONS: ProjectManager
// DEPENDS ON: react, useProjects.js, translations.js, loggerRenderer.js, icons.js, ConfirmModal.jsx, ProjectModal.jsx
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useContext } from 'react';
import { useProjects } from '../../hooks/useProjects.js';
import { TranslationContext } from '../../utils/translations.js';
import { logInfo, logError } from '../../utils/loggerRenderer.js';
import { ICONS } from '../../utils/icons.js';
import ConfirmModal from '../modals/ConfirmModal.jsx';
import ProjectModal from './ProjectModal.jsx';

export default function ProjectManager() {
  const { t } = useContext(TranslationContext);

  // ─── hook IPC – komunikacja z backendem przez invoke()
  const { projects, loading, addProject, updateProject, deleteProject } = useProjects();

  // ─── stan lokalny – tylko UI
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // ─── handleSaveProject() – zapisuje nowy lub aktualizuje istniejący projekt przez IPC
  const handleSaveProject = async (projectData) => {
    try {
      let res;
      if (editingProject) {
        res = await updateProject(editingProject.id, projectData);
        if (res?.ok) logInfo('ui', `ProjectManager: updated project ${editingProject.id}`);
        else logError('ui', 'ProjectManager: update failed', res?.error);
      } else {
        res = await addProject({ ...projectData, id: Date.now() });
        if (res?.ok) logInfo('ui', 'ProjectManager: added project');
        else logError('ui', 'ProjectManager: add failed', res?.error);
      }
      if (res?.ok) {
        setShowProjectModal(false);
        setEditingProject(null);
      }
    } catch (error) {
      logError('ui', 'ProjectManager: handleSaveProject exception', error.message);
    }
  };

  // ─── handleDeleteClick() – ustawia projekt do usunięcia i otwiera modal potwierdzenia
  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setShowDeleteConfirm(true);
  };

  // ─── handleDeleteConfirm() – usuwa projekt przez IPC po potwierdzeniu
  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    try {
      const res = await deleteProject(projectToDelete.id);
      if (res?.ok) logInfo('ui', `ProjectManager: deleted project ${projectToDelete.id}`);
      else logError('ui', 'ProjectManager: delete failed', res?.error);
    } catch (error) {
      logError('ui', 'ProjectManager: handleDeleteConfirm exception', error.message);
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
