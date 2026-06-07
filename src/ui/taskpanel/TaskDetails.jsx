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
import { logInfo, logError, logWarn } from '../../utils/loggerRenderer.js';
import { TASK_PRIORITIES } from "../../constants/constants.js";
import { TranslationContext } from '../../utils/translations.js';

// Model danych zadania: name, desc, comment, priority, section, version, pinned, projectId
// Sekcje: active | backlog | done (zamiast TASK_STATUS z constants.js)

export default function TaskDetails({ task, onBack, onEdit }) {
  const { t } = React.useContext(TranslationContext);
  const [local, setLocal] = useState(task);

  // ─── updateField() – aktualizuje pole zadania przez IPC
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
    }
  }

  return (
    <div className="taskdetails">
      <button className="btn btn-secondary" onClick={onBack}>
        {t("tasks.details.back")}
      </button>
      <h2>{local.name}</h2>

      {/* Priorytet */}
      <div className="taskdetails-section">
        <label>{t("tasks.details.priority")}</label>
        <select
          className="form-select"
          value={local.priority || 'C'}
          onChange={e => updateField("priority", e.target.value)}
        >
          {TASK_PRIORITIES.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Sekcja (zamiast status) */}
      <div className="taskdetails-section">
        <label>{t("tasks.field_section")}</label>
        <select
          className="form-select"
          value={local.section || 'active'}
          onChange={e => updateField("section", e.target.value)}
        >
          <option value="active">{t("tasks.section_active")}</option>
          <option value="backlog">{t("tasks.section_backlog")}</option>
          <option value="done">{t("tasks.section_done")}</option>
        </select>
      </div>

      {/* Opis */}
      <div className="taskdetails-section">
        <label>{t("tasks.field_desc")}</label>
        <textarea
          className="form-textarea"
          value={local.desc || ""}
          onChange={e => updateField("desc", e.target.value)}
        />
      </div>

      {/* Komentarz / notatka techniczna */}
      {local.comment && (
        <div className="taskdetails-section">
          <label>{t("tasks.field_comment")}</label>
          <pre style={{ fontSize: 12, background: 'var(--bg-secondary)', padding: 8, borderRadius: 6 }}>{local.comment}</pre>
        </div>
      )}

      <button className="btn btn-primary" onClick={() => onEdit(local)}>
        {t("tasks.details.edit")}
      </button>
    </div>
  );
}
