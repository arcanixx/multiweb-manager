// =============================================================================
// FILE: TaskList.jsx
// PATH: src/ui/taskpanel/TaskList.jsx
// VERSION: 0.0.3
// PURPOSE: Lista zadań – grupowanie po statusie, sortowanie po priorytecie,
// FUNCTIONS: TaskList
// DEPENDS ON: react, constants.js, translations.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState } from "react";
import { logInfo, logError, logWarn, logDebug } from '../utils/loggerRenderer.js';
import { TASK_PRIORITIES, TASK_STATUS } from "../../constants.js";
import { TranslationContext } from '../utils/translations.js';

// ---------------------------------------------------------------------------
// TaskList
// Props:
//   tasks          – tablica zadań
//   onOpenDetails  – callback otwierający TaskDetails dla zadania
//   onOpenEditor   – callback otwierający TaskEditor (null = nowe zadanie)
// ---------------------------------------------------------------------------
export default function TaskList({ tasks, onOpenDetails, onOpenEditor }) {
  const { t } = React.useContext(TranslationContext);
  const [filter, setFilter] = useState("all");
  /** Sortuje zadania według priorytetu A → E. */
  function sortByPriority(list) {
    const order = ["A", "B", "C", "D", "E"];
    return [...list].sort((a, b) => order.indexOf(a.priority) - order.indexOf(b.priority));
  }
  // Grupowanie zadań po statusie z uwzględnieniem aktywnego filtra priorytetu
  const grouped = {
    [TASK_STATUS.TODO]:        [],
    [TASK_STATUS.IN_PROGRESS]: [],
    [TASK_STATUS.BLOCKED]:     [],
    [TASK_STATUS.DONE]:        []
  };
  tasks.forEach(task => {
    if (filter !== "all" && task.priority !== filter) return;
    if (!grouped[task.status]) return;
    grouped[task.status].push(task);
  });
  // Sortowanie każdej grupy po priorytecie
  Object.keys(grouped).forEach(status => {
    grouped[status] = sortByPriority(grouped[status]);
  });
  // ---------------------------------------------------------------------------
  // Helper – renderuje pojedynczą sekcję statusu
  // ---------------------------------------------------------------------------
  function renderSection(statusKey, labelKey) {
    const items = grouped[statusKey];
    return (
      <div className="tasklist-section">
        <h3>{t(labelKey)}</h3>
        {items.length === 0 && (
          <div className="tasklist-empty">{t("tasks.list.empty")}</div>
        )}
        {items.map(task => (
          <div
            key={task.id}
            className="tasklist-item"
            onClick={() => onOpenDetails(task)}
          >
            <div className={`priority-dot priority-${task.priority}`} />
            <div className="tasklist-title">{task.title}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="tasklist">
      {/* Nagłówek z filtrem i przyciskiem dodawania */}
      <div className="tasklist-header">
        <h2>{t("tasks.list.title")}</h2>

        <select
          className="form-select"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="all">{t("tasks.list.filter.all")}</option>
          {TASK_PRIORITIES.map(p => (
            <option key={p} value={p}>
              {t("tasks.priority")} {p}
            </option>
          ))}
        </select>

        <button className="btn btn-primary" onClick={() => onOpenEditor(null)}>
          {t("tasks.list.add")}
        </button>
      </div>

      {/* Sekcje pogrupowane po statusie */}
      <div className="tasklist-sections">
        {renderSection(TASK_STATUS.TODO,        "tasks.status.todo")}
        {renderSection(TASK_STATUS.IN_PROGRESS, "tasks.status.in_progress")}
        {renderSection(TASK_STATUS.BLOCKED,     "tasks.status.blocked")}
        {renderSection(TASK_STATUS.DONE,        "tasks.status.done")}
      </div>
    </div>
  );
}
