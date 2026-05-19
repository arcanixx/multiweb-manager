// =============================================================================
// FILE: src/components/TaskPanel.jsx
// PATH: multiweb-manager/src/components/TaskPanel.jsx
// VERSION: v1
// PURPOSE: Prawy panel zarządzania zadaniami dla wybranego projektu.
//          Zadania podzielone na sekcje: Aktualne / Backlog / Zrobione.
//          Dodawanie/edycja przez JEDEN MODAL z polami: nazwa, opis, priorytet
//          (A/B/C), sekcja (dropdown), wersja, komentarz, projekt, pin.
//          Priorytety: A=Krytyk(czerwony), B=Major(pomarańczowy), C=Minor(żółty)
//          Sekcja Backlog automatycznie używa priorytetu D (niebieski).
//          Sekcja Done automatycznie używa priorytetu E (zielony).
//          Zadania z pinem wyświetlają się na górze sekcji.
// DEPENDS ON: icons.js, useTranslation.js, logger.js
// FUNCTIONS: loadTasks, saveFullState, addOrEditTask (modal), moveTask,
//            togglePin, deleteTask, sortByPin, renderTask
// =============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { ICONS } from '../../utils/icons';
import { useTranslation } from '../../hooks/useTranslation';
import { log, error as logError } from '../../utils/logger';

// Kolory priorytetów jako klasy CSS (zdefiniowane w index.css)
const PRIORITY_COLORS = {
  A: '#ef4444',
  B: '#f97316',
  C: '#eab308',
  D: '#3b82f6',
  E: '#22c55e',
};

// ─── TaskModal – modal dodawania/edycji zadania ──────────────────────────────
function TaskModal({ task, availableProjects, currentProject, onSave, onClose, t }) {
  const isEdit = !!task;
  const [name,     setName]     = useState(task?.name     || '');
  const [desc,     setDesc]     = useState(task?.desc     || '');
  const [priority, setPriority] = useState(task?.priority || 'C');
  const [section,  setSection]  = useState(task?.section  || 'active');
  const [version,  setVersion]  = useState(task?.version  || '');
  const [comment,  setComment]  = useState(task?.comment  || '');
  const [project,  setProject]  = useState(task?.project  || currentProject || '');
  const [pinned,   setPinned]   = useState(task?.pinned   || false);

  // Priorytet dostosowuje się do sekcji – done zawsze E, backlog D (opcjonalnie)
  const effectivePriority = section === 'done' ? 'E' : section === 'backlog' && priority === 'C' ? priority : priority;

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id:       task?.id || Date.now().toString(),
      name:     name.trim(),
      desc:     desc.trim(),
      priority: section === 'done' ? 'E' : priority,
      section,
      version:  version.trim(),
      comment:  comment.trim(),
      project:  project || currentProject,
      pinned,
    });
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 520 }}>
        {/* Nagłówek */}
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
              onChange={e => setName(e.target.value)} />
          </div>

          {/* Priorytet + Sekcja – jedna linia */}
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label className="form-label">{t('tasks.field_priority')}</label>
              <select className="form-select" value={priority}
                onChange={e => setPriority(e.target.value)}
                disabled={section === 'done'}>
                <option value="A">{t('tasks.priority_a')}</option>
                <option value="B">{t('tasks.priority_b')}</option>
                <option value="C">{t('tasks.priority_c')}</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label className="form-label">{t('tasks.field_section')}</label>
              <select className="form-select" value={section}
                onChange={e => setSection(e.target.value)}>
                <option value="active">{t('tasks.section_active')}</option>
                <option value="backlog">{t('tasks.section_backlog')}</option>
                <option value="done">{t('tasks.section_done')}</option>
              </select>
            </div>
          </div>

          {/* Projekt */}
          {availableProjects?.length > 0 && (
            <div>
              <label className="form-label">{t('tasks.field_project')}</label>
              <select className="form-select" value={project}
                onChange={e => setProject(e.target.value)}>
                <option value="">{t('tasks.field_project_placeholder')}</option>
                {availableProjects.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          )}

          {/* Opis */}
          <div>
            <label className="form-label">{t('tasks.field_desc')}</label>
            <textarea className="form-textarea" style={{ minHeight: 64 }} value={desc}
              placeholder={t('tasks.field_desc_placeholder')}
              onChange={e => setDesc(e.target.value)} />
          </div>

          {/* Wersja */}
          <div>
            <label className="form-label">{t('tasks.field_version')}</label>
            <input className="form-input" value={version}
              placeholder={t('tasks.field_version_placeholder')}
              onChange={e => setVersion(e.target.value)} />
          </div>

          {/* Komentarz / kod */}
          <div>
            <label className="form-label">{t('tasks.field_comment')}</label>
            <textarea className="form-textarea" style={{ minHeight: 100 }} value={comment}
              placeholder={t('tasks.field_comment_placeholder')}
              onChange={e => setComment(e.target.value)} />
          </div>

          {/* Przypnij */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              {ICONS.PIN} {t('tasks.pin')}
            </span>
            <label className="toggle">
              <input type="checkbox" checked={pinned} onChange={e => setPinned(e.target.checked)} />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* Przyciski */}
        <div style={{ display: 'flex', gap: 8, marginTop: 18, justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>{t('tasks.cancel')}</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={!name.trim()}>
            {ICONS.SAVE} {t('tasks.save')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CommentModal – podgląd komentarza/kodu do zadania ──────────────────────
function CommentModal({ task, onClose, t }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 560 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>
            {ICONS.COMMENT} {task.name}
          </h3>
          <button className="btn-icon" onClick={onClose}>{ICONS.CLOSE}</button>
        </div>
        {task.desc && (
          <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--text-secondary)' }}>
            {task.desc}
          </div>
        )}
        {task.comment && (
          <pre style={{
            background: 'var(--bg-secondary)', padding: 12, borderRadius: 8,
            fontSize: 12, overflowX: 'auto', whiteSpace: 'pre-wrap',
            color: 'var(--text-primary)', fontFamily: "'Cascadia Code','Consolas',monospace"
          }}>
            {task.comment}
          </pre>
        )}
        {task.version && (
          <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-muted)' }}>
            {ICONS.VERSION} v{task.version}
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// TaskPanel – główny komponent panelu zadań
// =============================================================================
export default function TaskPanel({ projectName, onClose, visible, availableProjects }) {
  const { t } = useTranslation();
  const [tasks,   setTasks]   = useState({ active: [], backlog: [], done: [] });
  const [modal,   setModal]   = useState(null);   // null | { task? } – modal edycji
  const [comment, setComment] = useState(null);   // null | task – modal komentarza
  const [collapsed, setCollapsed] = useState({});  // { 'active': bool, ... }

  // ----------------------------------------------------------------
  // Ładowanie tasków dla projektu przy każdym otwarciu panelu
  // ----------------------------------------------------------------
  useEffect(() => {
    if (!visible || !projectName) return;
    window.electronAPI.getTasks(projectName)
      .then(data => {
        setTasks(data.tasks || { active: [], backlog: [], done: [] });
        log('TaskPanel: loaded for', projectName);
      })
      .catch(err => logError('TaskPanel: load failed', err.message));
  }, [projectName, visible]);

  // ----------------------------------------------------------------
  // saveFullState() – zapisuje aktualny stan tasków do store
  // ----------------------------------------------------------------
  const saveFullState = useCallback((newTasks) => {
    setTasks(newTasks);
    window.electronAPI.saveTasks(projectName, { tasks: newTasks })
      .catch(err => logError('TaskPanel: save failed', err.message));
    log('TaskPanel: saved for', projectName);
  }, [projectName]);

  // ----------------------------------------------------------------
  // handleSaveTask() – obsługuje zapis z modalu (nowy lub edycja)
  //   Przenosi zadanie do odpowiedniej sekcji na podstawie task.section
  // ----------------------------------------------------------------
  const handleSaveTask = (taskData) => {
    const { section } = taskData;
    // Usuń z wszystkich sekcji (edycja może zmieniać sekcję)
    const cleaned = {
      active:  tasks.active.filter(t => t.id !== taskData.id),
      backlog: tasks.backlog.filter(t => t.id !== taskData.id),
      done:    tasks.done.filter(t => t.id !== taskData.id),
    };
    // Dodaj do właściwej sekcji
    const sectionKey = section === 'done' ? 'done' : section === 'backlog' ? 'backlog' : 'active';
    const newTasks = {
      ...cleaned,
      [sectionKey]: taskData.pinned
        ? [taskData, ...cleaned[sectionKey]]
        : [...cleaned[sectionKey], taskData]
    };
    saveFullState(newTasks);
    setModal(null);
    log('TaskPanel: task saved:', taskData.name, '→', sectionKey);
  };

  // ----------------------------------------------------------------
  // moveTask() – przenosi zadanie między sekcjami
  // ----------------------------------------------------------------
  const moveTask = (taskId, from, to) => {
    const task = tasks[from].find(t => t.id === taskId);
    if (!task) return;
    // Przy przeniesieniu do done – ustaw priorytet E
    const updatedTask = to === 'done'
      ? { ...task, priority: 'E', section: 'done' }
      : { ...task, section: to };
    const newTasks = {
      ...tasks,
      [from]: tasks[from].filter(t => t.id !== taskId),
      [to]:   [...tasks[to], updatedTask],
    };
    saveFullState(newTasks);
    log('TaskPanel: moved', task.name, from, '→', to);
  };

  // ----------------------------------------------------------------
  // togglePin() – przełącza pin i sortuje listę
  // ----------------------------------------------------------------
  const togglePin = (taskId, section) => {
    const newTasks = {
      ...tasks,
      [section]: tasks[section].map(t =>
        t.id === taskId ? { ...t, pinned: !t.pinned } : t
      )
    };
    saveFullState(newTasks);
    log('TaskPanel: pin toggled:', taskId);
  };

  // ----------------------------------------------------------------
  // deleteTask() – usuwa zadanie ze wszystkich sekcji
  // ----------------------------------------------------------------
  const deleteTask = (taskId) => {
    if (!window.confirm('Usunąć zadanie?')) return;
    const newTasks = {
      active:  tasks.active.filter(t => t.id !== taskId),
      backlog: tasks.backlog.filter(t => t.id !== taskId),
      done:    tasks.done.filter(t => t.id !== taskId),
    };
    saveFullState(newTasks);
    log('TaskPanel: deleted:', taskId);
  };

  // ----------------------------------------------------------------
  // sortByPin() – przypięte wyświetla na górze sekcji
  // ----------------------------------------------------------------
  const sortByPin = (list) =>
    [...list].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  // ----------------------------------------------------------------
  // renderTask() – renderuje pojedyncze zadanie z akcjami
  // ----------------------------------------------------------------
  const renderTask = (task, sectionKey) => {
    const pColor = PRIORITY_COLORS[task.priority] || '#94a3b8';
    return (
      <div key={task.id}
        onContextMenu={e => {
          e.preventDefault();
          if (task.comment || task.desc) setComment(task);
        }}
        style={{
          border: '1px solid var(--border)', borderRadius: 6,
          padding: '6px 8px', marginBottom: 4,
          background: task.pinned ? 'var(--bg-active)' : 'var(--bg-card)',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>

        {/* Górna linia: dot + nazwa + akcje */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Dot priorytetu */}
          <div className="priority-dot" style={{ background: pColor }} title={`Priorytet: ${task.priority}`} />

          {/* Nazwa */}
          <span style={{
            flex: 1, fontSize: 12, fontWeight: 600, color: 'var(--text-primary)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
          }} title={task.name}>
            {task.pinned && <span style={{ marginRight: 4, fontSize: 10 }}>{ICONS.PIN}</span>}
            {task.name}
          </span>

          {/* Indykator komentarza */}
          {(task.comment || task.desc) && (
            <span style={{ fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer' }}
              onClick={() => setComment(task)} title={t('tasks.has_comment')}>
              {ICONS.COMMENT}
            </span>
          )}

          {/* Przyciski akcji */}
          <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
            <button className="btn-icon" style={{ fontSize: 11, padding: '2px 5px' }}
              onClick={() => togglePin(task.id, sectionKey)}
              title={task.pinned ? t('tasks.unpin') : t('tasks.pin')}>
              {task.pinned ? ICONS.PIN : ICONS.UNPIN}
            </button>
            <button className="btn-icon" style={{ fontSize: 11, padding: '2px 5px' }}
              onClick={() => setModal({ task })} title={t('tasks.edit')}>
              {ICONS.EDIT}
            </button>
            {sectionKey === 'active' && (
              <>
                <button className="btn-icon" style={{ fontSize: 11, padding: '2px 5px' }}
                  onClick={() => moveTask(task.id, 'active', 'done')} title={t('tasks.move_to_done')}>
                  {ICONS.DONE}
                </button>
                <button className="btn-icon" style={{ fontSize: 11, padding: '2px 5px' }}
                  onClick={() => moveTask(task.id, 'active', 'backlog')} title={t('tasks.move_to_backlog')}>
                  {ICONS.CHEVRON_LEFT}
                </button>
              </>
            )}
            {sectionKey === 'backlog' && (
              <button className="btn-icon" style={{ fontSize: 11, padding: '2px 5px' }}
                onClick={() => moveTask(task.id, 'backlog', 'active')} title={t('tasks.move_to_active')}>
                {ICONS.CHEVRON_RIGHT}
              </button>
            )}
            {sectionKey === 'done' && (
              <button className="btn-icon" style={{ fontSize: 11, padding: '2px 5px' }}
                onClick={() => moveTask(task.id, 'done', 'active')} title={t('tasks.restore')}>
                {ICONS.REFRESH}
              </button>
            )}
            <button className="btn-icon" style={{ fontSize: 11, padding: '2px 5px', color: 'var(--danger)' }}
              onClick={() => deleteTask(task.id)} title={t('tasks.delete')}>
              {ICONS.DELETE}
            </button>
          </div>
        </div>

        {/* Wersja (jeśli jest) */}
        {task.version && (
          <div style={{ fontSize: 10, color: 'var(--text-muted)', paddingLeft: 16 }}>
            {ICONS.VERSION} v{task.version}
          </div>
        )}
      </div>
    );
  };

  const toggleCollapse = (key) =>
    setCollapsed(c => ({ ...c, [key]: !c[key] }));

  const sections = [
    { key: 'active',  labelKey: 'tasks.active',  dotColor: '#3b82f6' },
    { key: 'backlog', labelKey: 'tasks.backlog',  dotColor: '#94a3b8' },
    { key: 'done',    labelKey: 'tasks.done',     dotColor: '#22c55e' },
  ];

  if (!visible) return null;

  return (
    <>
      <div style={{
        width: 'var(--taskpanel-width)', minWidth: 260,
        background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', height: '100vh', flexShrink: 0
      }}>
        {/* ─── Nagłówek ─── */}
        <div style={{
          padding: '10px 12px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
              {ICONS.TASKS} {t('tasks.title')}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{projectName}</div>
          </div>
          <button className="btn-icon" onClick={onClose}>{ICONS.CLOSE}</button>
        </div>

        {/* ─── Dodaj zadanie ─── */}
        <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border)' }}>
          <button className="btn btn-primary" style={{ width: '100%', fontSize: 12 }}
            onClick={() => setModal({})}>
            {ICONS.PLUS} {t('tasks.add')}
          </button>
        </div>

        {/* ─── Sekcje ─── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 8px' }}>
          {sections.map(({ key, labelKey, dotColor }) => {
            const list = sortByPin(tasks[key] || []);
            const isCollapsed = collapsed[key];
            return (
              <div key={key} style={{ marginBottom: 12 }}>
                {/* Nagłówek sekcji */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  cursor: 'pointer', marginBottom: 6, padding: '2px 4px',
                  borderRadius: 4
                }} onClick={() => toggleCollapse(key)}>
                  <div style={{
                    width: 8, height: 8, borderRadius: 2, background: dotColor, flexShrink: 0
                  }} />
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.06em', color: 'var(--text-muted)', flex: 1 }}>
                    {t(labelKey)}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {list.length}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                    {isCollapsed ? ICONS.CHEVRON_RIGHT : ICONS.CHEVRON_DOWN}
                  </span>
                </div>

                {/* Lista zadań */}
                {!isCollapsed && (
                  list.length === 0
                    ? <div style={{ fontSize: 11, color: 'var(--text-muted)', padding: '4px 8px', fontStyle: 'italic' }}>
                        {t('tasks.no_tasks')}
                      </div>
                    : list.map(task => renderTask(task, key))
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Modal dodaj/edytuj ─── */}
      {modal !== null && (
        <TaskModal
          task={modal.task || null}
          availableProjects={availableProjects}
          currentProject={projectName}
          onSave={handleSaveTask}
          onClose={() => setModal(null)}
          t={t}
        />
      )}

      {/* ─── Modal komentarza (PPM) ─── */}
      {comment && (
        <CommentModal
          task={comment}
          onClose={() => setComment(null)}
          t={t}
        />
      )}
    </>
  );
}
