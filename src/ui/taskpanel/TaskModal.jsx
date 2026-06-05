// =============================================================================
// FILE: TaskModal.jsx
// PATH: src/ui/taskpanel/TaskModal.jsx
// VERSION: 0.0.3
// PURPOSE: Modal dodawania i edycji zadania. Status wybierany przez użytkownika – sekcja jest wyznaczana automatycznie (status→section). Priorytety: A–E. Pola: name, status, priority, desc, version, comment, pinned.
// FUNCTIONS: TaskModal
// DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useContext, useEffect } from 'react';
import { logInfo, logError, logWarn, logDebug } from '../../utils/loggerRenderer.js';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';

// Mapowanie status→section (mirror backendu – bez roundtripa IPC)
const STATUS_TO_SECTION = {
  in_progress: 'active',
  todo:        'backlog',
  blocked:     'backlog',
  done:        'done',
  cancelled:   'done',
};

// Statusy dostępne przy tworzeniu (nie można tworzyć jako 'done'/'cancelled' bezpośrednio)
const STATUSES_CREATE = ['todo', 'blocked'];
// Wszystkie statusy przy edycji
const STATUSES_ALL    = ['in_progress', 'todo', 'blocked', 'done', 'cancelled'];
const PRIORITIES      = ['A', 'B', 'C', 'D', 'E'];

// ─── TaskModal() – modal dodawania / edycji zadania
//   @param {Object|null} props.task         – istniejące zadanie (tryb edycji) lub null
//   @param {string}      props.taskGroupId  – ID grupy (przekazywane przy addTask)
//   @param {Function}    props.onSave       – callback (taskData) => void
//   @param {Function}    props.onClose      – callback zamknięcia
export default function TaskModal({ task, taskGroupId, onSave, onClose }) {
  useEffect(() => { logDebug('tasks', 'TaskModal mounted, edit=' + !!task); }, []);
  const { t } = useContext(TranslationContext);
  const isEdit = !!task;

  const [name,     setName]     = useState(task?.name     || '');
  const [desc,     setDesc]     = useState(task?.desc     || '');
  const [priority, setPriority] = useState(task?.priority || 'C');
  const [status,   setStatus]   = useState(task?.status   || 'todo');
  const [version,  setVersion]  = useState(task?.version  || '');
  const [comment,  setComment]  = useState(task?.comment  || '');
  const [pinned,   setPinned]   = useState(task?.pinned   || false);

  // Sekcja wyświetlana jako informacja (readonly – wyznaczana ze statusu)
  const derivedSection = STATUS_TO_SECTION[status] || 'backlog';

  // ─── handleSave() – waliduje formularz i wywołuje onSave z danymi zadania
  const handleSave = () => {
    try {
      if (!name.trim()) {
        logWarn('tasks', 'TaskModal: name wymagany');
        return;
      }
      onSave({
        ...(isEdit ? { id: task.id } : {}),
        name:        name.trim(),
        desc:        desc.trim(),
        priority,
        status,
        section:     derivedSection,   // wysyłamy też section – backend i tak normalizuje
        version:     version.trim(),
        comment:     comment.trim(),
        pinned,
        taskGroupId: task?.taskGroupId || taskGroupId,
      });
      logInfo('tasks', `TaskModal: task ${isEdit ? 'updated' : 'created'}`);
      onClose();
    } catch (err) {
      logError('tasks', 'TaskModal: save failed', err.message);
    }
  };

  const availableStatuses = isEdit ? STATUSES_ALL : STATUSES_CREATE;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 520 }}>
        {/* ─── Nagłówek ─── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
            {isEdit ? t('tasks.modal_title_edit') : t('tasks.modal_title_add')}
          </h2>
          <button className="btn-icon" onClick={onClose}>{ICONS.CLOSE}</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Nazwa */}
          <div>
            <label className="form-label">{t('tasks.field_name')} *</label>
            <input className="form-input" value={name} autoFocus
              placeholder={t('tasks.field_name_placeholder')}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()} />
          </div>

          {/* Status + Priorytet */}
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label className="form-label">{t('tasks.field_status')}</label>
              <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
                {availableStatuses.map(s => (
                  <option key={s} value={s}>{t(`tasks.status_${s}`)}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label className="form-label">{t('tasks.field_priority')}</label>
              <select className="form-select" value={priority} onChange={e => setPriority(e.target.value)}>
                {PRIORITIES.map(p => (
                  <option key={p} value={p}>{t(`tasks.priority_${p.toLowerCase()}`)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sekcja – informacja readonly */}
          <div style={{ fontSize: 11, color: 'var(--text-muted)', padding: '2px 0' }}>
            {t('tasks.field_category')}: <strong>{t(`tasks.section_${derivedSection}`)}</strong>
            {' '}— {t('tasks.section_auto_info')}
          </div>

          {/* Opis */}
          <div>
            <label className="form-label">{t('tasks.field_desc')}</label>
            <textarea className="form-textarea" style={{ minHeight: 64 }}
              value={desc} placeholder={t('tasks.field_desc_placeholder')}
              onChange={e => setDesc(e.target.value)} />
          </div>

          {/* Wersja */}
          <div>
            <label className="form-label">{t('tasks.field_version')}</label>
            <input className="form-input" value={version}
              placeholder={t('tasks.field_version_placeholder')}
              onChange={e => setVersion(e.target.value)} />
          </div>

          {/* Komentarz techniczny */}
          <div>
            <label className="form-label">{t('tasks.field_comment')}</label>
            <textarea className="form-textarea" style={{ minHeight: 80 }}
              value={comment} placeholder={t('tasks.field_comment_placeholder')}
              onChange={e => setComment(e.target.value)} />
          </div>

          {/* Przypięcie */}
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
          <button className="btn btn-primary" onClick={handleSave} disabled={!name.trim()}>
            {ICONS.SAVE} {t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
}

