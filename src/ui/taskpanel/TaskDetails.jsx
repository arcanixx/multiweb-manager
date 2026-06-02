// =============================================================================
// FILE: TaskDetails.jsx
// PATH: src/ui/taskpanel/TaskDetails.jsx
// VERSION: 0.0.3
// PURPOSE: Widok szczegółowy pojedynczego zadania. Umożliwia szybką edycję statusu i priorytetu bezpośrednio z poziomu podglądu oraz synchronizację tych zmian przez IPC.
// FUNCTIONS: TaskDetails
// DEPENDS ON: react, loggerRenderer.js, constants.js, translations.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState } from "react";
import { logInfo, logError, logWarn, logDebug } from '../utils/loggerRenderer.js';
import { TASK_PRIORITIES, TASK_STATUS } from "../../constants.js";
import { TranslationContext } from '../utils/translations.js';

// ─── TaskDetails() – szczegółowy widok zadania z możliwością edycji pól
//   @param {Object} props – właściwości komponentu
//   @param {Object} props.task – obiekt zadania do wyświetlenia
//   @param {Function} props.onBack – callback powrotu do listy zadań
//   @param {Function} props.onEdit – callback otwarcia edytora zadania
//   @returns {JSX.Element} – renderowany widok szczegółów zadania

// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
export default function TaskDetails({ task, onBack, onEdit }) {
  const { t } = React.useContext(TranslationContext);
  const [local, setLocal] = useState(task);

  // ─── updateField() – aktualizuje pole zadania przez IPC
  //   @param {string} field – nazwa pola do aktualizacji
  //   @param {any} value – nowa wartość pola
  //   @returns {Promise<void>}
  async function updateField(field, value) {
    try {
      const res = await window.electronAPI.invoke("tasks:update", {
        id: local.id,
        patch: { [field]: value }
      });
      if (res?.ok) {
        setLocal({ ...local, [field]: value });
        logInfo('tasks', `TaskDetails: updated ${field}`);
      } else {
        logWarn('tasks', `Nie można zaktualizować pola ${field}`);
      }
    } catch (err) {
      logError('tasks', 'TaskDetails.updateField failed', err.message);
      logWarn('tasks', 'Wystąpił błąd podczas aktualizacji pola');
    }
  }
  return (
    <div className="taskdetails">
      <button className="btn btn-secondary" onClick={onBack}>
        {t("tasks.details.back")}
      </button>
      <h2>{local.title}</h2>
      {/* Zmiana statusu zadania */}
      <div className="taskdetails-section">
        <label>{t("tasks.details.status")}</label>
        <select
          className="form-select"
          value={local.status}
          onChange={e => updateField("status", e.target.value)}
        >
          {Object.values(TASK_STATUS).map(s => (
            <option key={s} value={s}>
              {t(`tasks.status.${s}`)}
            </option>
          ))}
        </select>
      </div>

      {/* Zmiana priorytetu zadania */}
      <div className="taskdetails-section">
        <label>{t("tasks.details.priority")}</label>
        <select
          className="form-select"
          value={local.priority}
          onChange={e => updateField("priority", e.target.value)}
        >
          {TASK_PRIORITIES.map(p => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Edycja opisu zadania */}
      <div className="taskdetails-section">
        <label>{t("tasks.details.description")}</label>
        <textarea
          className="form-textarea"
          value={local.description || ""}
          onChange={e => updateField("description", e.target.value)}
        />
      </div>

      <button className="btn btn-primary" onClick={onEdit}>
        {t("tasks.details.edit")}
      </button>
    </div>
  );
}