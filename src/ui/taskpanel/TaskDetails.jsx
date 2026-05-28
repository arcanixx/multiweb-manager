// =============================================================================
// FILE: TaskDetails.jsx
// PATH: src/ui/taskpanel/TaskDetails.jsx
// VERSION: 0.0.3
// PURPOSE: Szczegóły zadania – pełny widok, zmiana statusu,
// FUNCTIONS: TaskDetails
// DEPENDS ON: react, constants.js, translations.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState } from "react";
import { logInfo, logError, logWarn, logDebug } from '../utils/loggerRenderer.js';
import { TASK_PRIORITIES, TASK_STATUS } from "../../constants.js";
import { TranslationContext } from '../utils/translations.js';

// ---------------------------------------------------------------------------
// TaskDetails
// Props:
//   task    – obiekt zadania do wyświetlenia
//   onBack  – callback powrotu do listy
//   onEdit  – callback otwarcia edytora dla tego zadania
// ---------------------------------------------------------------------------
export default function TaskDetails({ task, onBack, onEdit }) {
  const { t } = React.useContext(TranslationContext);
  const [local, setLocal] = useState(task);
  /** Wysyła patch do IPC i aktualizuje lokalny stan. */
  async function updateField(field, value) {
    const res = await window.electronAPI.invoke("tasks:update", {
      id: local.id,
      patch: { [field]: value }
    });
    if (res?.ok) {
      setLocal({ ...local, [field]: value });
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

=============================================================================
