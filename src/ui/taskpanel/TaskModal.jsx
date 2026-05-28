// =============================================================================
// FILE: TaskModal.jsx
// PATH: src/ui/taskpanel/TaskModal.jsx
// VERSION: 0.0.3
// PURPOSE: Modal dodawania/edycji zadania (nazwa, opis, priorytet, sekcja, projekt, wersja, komentarz, pin)
// FUNCTIONS: TaskModal
// DEPENDS ON: react, translations.js, icons.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
export default function TaskModal({ task, availableProjects, currentProject, onSave, onClose }) {
  const { t } = useContext(TranslationContext);
  const isEdit = !!task;
  const [name, setName] = useState(task?.name || '');
  const [desc, setDesc] = useState(task?.desc || '');
  const [priority, setPriority] = useState(task?.priority || 'C');
  const [section, setSection] = useState(task?.section || 'active');
  const [version, setVersion] = useState(task?.version || '');
  const [comment, setComment] = useState(task?.comment || '');
  const [project, setProject] = useState(task?.project || currentProject || '');
  const [pinned, setPinned] = useState(task?.pinned || false);
  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: task?.id || Date.now().toString(),
      name: name.trim(),
      desc: desc.trim(),
      priority: section === 'done' ? 'E' : priority,
      section,
      version: version.trim(),
      comment: comment.trim(),
      project: project || currentProject,
      pinned,
    });
  };
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 520 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
            {isEdit ? t('tasks.modal_title_edit') : t('tasks.modal_title_add')}
          </h2>
          <button className="btn-icon" onClick={onClose}>{ICONS.CLOSE}</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label className="form-label">{t('tasks.field_name')} *</label>
            <input className="form-input" value={name} autoFocus placeholder={t('tasks.field_name_placeholder')} onChange={e => setName(e.target.value)} />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label className="form-label">{t('tasks.field_priority')}</label>
              <select className="form-select" value={priority} onChange={e => setPriority(e.target.value)} disabled={section === 'done'}>
                <option value="A">{t('tasks.priority_a')}</option>
                <option value="B">{t('tasks.priority_b')}</option>
                <option value="C">{t('tasks.priority_c')}</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label className="form-label">{t('tasks.field_section')}</label>
              <select className="form-select" value={section} onChange={e => setSection(e.target.value)}>
                <option value="active">{t('tasks.section_active')}</option>
                <option value="backlog">{t('tasks.section_backlog')}</option>
                <option value="done">{t('tasks.section_done')}</option>
              </select>
            </div>
          </div>

          {availableProjects?.length > 0 && (
            <div>
              <label className="form-label">{t('tasks.field_project')}</label>
              <select className="form-select" value={project} onChange={e => setProject(e.target.value)}>
                <option value="">{t('tasks.field_project_placeholder')}</option>
                {availableProjects.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          )}

          <div>
            <label className="form-label">{t('tasks.field_desc')}</label>
            <textarea className="form-textarea" style={{ minHeight: 64 }} value={desc} placeholder={t('tasks.field_desc_placeholder')} onChange={e => setDesc(e.target.value)} />
          </div>

          <div>
            <label className="form-label">{t('tasks.field_version')}</label>
            <input className="form-input" value={version} placeholder={t('tasks.field_version_placeholder')} onChange={e => setVersion(e.target.value)} />
          </div>

          <div>
            <label className="form-label">{t('tasks.field_comment')}</label>
            <textarea className="form-textarea" style={{ minHeight: 100 }} value={comment} placeholder={t('tasks.field_comment_placeholder')} onChange={e => setComment(e.target.value)} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{ICONS.PIN} {t('tasks.pin')}</span>
            <label className="toggle">
              <input type="checkbox" checked={pinned} onChange={e => setPinned(e.target.checked)} />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 18, justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>{t('common.cancel')}</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={!name.trim()}>{ICONS.SAVE} {t('common.save')}</button>
        </div>
      </div>
    </div>
  );
}