// =============================================================================
// FILE: TaskEditor.jsx
// PATH: src/ui/taskpanel/TaskEditor.jsx
// VERSION: 0.0.3
// PURPOSE: Modal dodawania/edycji zadania – walidacja, zapis,
// FUNCTIONS: TaskEditor
// DEPENDS ON: react, loggerRenderer.js, constants.js, translations.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState } from "react";
import { logInfo, logError, logWarn, logDebug } from '../utils/loggerRenderer.js';
import { TASK_PRIORITIES, TASK_STATUS } from "../../constants.js";
import { TranslationContext } from '../utils/translations.js';

// ─── TaskEditor() – modal edycji/dodawania zadania z formularzem
//   @param {Object} props – właściwości komponentu
//   @param {Object|null} props.task – istniejące zadanie (tryb edycji) lub null
//   @param {Function} props.onCancel – callback anulowania
//   @param {Function} props.onSaved – callback po zapisaniu
//   @returns {JSX.Element} – renderowany formularz zadania

// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
export default function TaskEditor({ task, onCancel, onSaved }) {
  const { t } = React.useContext(TranslationContext);
  const isEdit = !!task;
  const [form, setForm] = useState(
    task || {
      title: "",
      description: "",
      priority: "C",
      status: TASK_STATUS.TODO
    }
  );

  // ─── update() – aktualizuje pole formularza
  //   @param {string} field – nazwa pola
  //   @param {any} value – nowa wartość
  //   @returns {void}
  function update(field, value) {
    setForm({ ...form, [field]: value });
  }

  // ─── save() – waliduje i zapisuje zadanie przez IPC
  //   @returns {Promise<void>}
  async function save() {
    try {
      if (!form.title.trim()) {
        logWarn('tasks', 'TaskEditor: title is required');
        window.showToast("error", t("tasks.editor.error.titleRequired"));
        return;
      }
      const channel = isEdit ? "tasks:update" : "tasks:add";
      const payload = isEdit ? { id: task.id, patch: form } : form;
      const res = await window.electronAPI.invoke(channel, payload);
      if (res?.ok) {
        logInfo('tasks', `TaskEditor: task ${isEdit ? 'updated' : 'created'}`);
        window.showToast("success", t("tasks.editor.saved"));
        onSaved();
      } else {
        logError('tasks', 'TaskEditor: save failed', res?.error);
        logWarn('tasks', 'Nie można zapisać zadania');
        window.showToast("error", t("tasks.editor.error.saveFailed"));
      }
    } catch (err) {
      logError('tasks', 'TaskEditor.save exception', err);
      logWarn('tasks', 'Wystąpił błąd podczas zapisu zadania');
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>
          {isEdit ? t("tasks.editor.titleEdit") : t("tasks.editor.titleNew")}
        </h2>

        {/* Tytuł */}
        <label className="form-label">{t("tasks.editor.field.title")}</label>
        <input
          className="form-input"
          value={form.title}
          onChange={e => update("title", e.target.value)}
        />

        {/* Opis */}
        <label className="form-label">{t("tasks.editor.field.description")}</label>
        <textarea
          className="form-textarea"
          value={form.description}
          onChange={e => update("description", e.target.value)}
        />

        {/* Priorytet */}
        <label className="form-label">{t("tasks.editor.field.priority")}</label>
        <select
          className="form-select"
          value={form.priority}
          onChange={e => update("priority", e.target.value)}
        >
          {TASK_PRIORITIES.map(p => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        {/* Status */}
        <label className="form-label">{t("tasks.editor.field.status")}</label>
        <select
          className="form-select"
          value={form.status}
          onChange={e => update("status", e.target.value)}
        >
          {Object.values(TASK_STATUS).map(s => (
            <option key={s} value={s}>
              {t(`tasks.status.${s}`)}
            </option>
          ))}
        </select>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            {t("tasks.editor.cancel")}
          </button>
          <button className="btn btn-primary" onClick={save}>
            {t("tasks.editor.save")}
          </button>
        </div>
      </div>
    </div>
  );
}