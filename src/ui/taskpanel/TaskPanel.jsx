// =============================================================================
// FILE: TaskPanel.jsx
// PATH: src/ui/taskpanel/TaskPanel.jsx
// VERSION: 0.0.3
// PURPOSE: Główny moduł TaskPanel – zarządza:
//          - pobieraniem listy zadań
//          - przełączaniem widoków (lista / szczegóły / edycja)
//          - integracją z IPC (tasks:*)
// =============================================================================

import React, { useEffect, useState } from "react";
import TaskList    from "./TaskList.jsx";
import TaskDetails from "./TaskDetails.jsx";
import TaskEditor  from "./TaskEditor.jsx";
import { t } from "../../locales/locale.js";

// ---------------------------------------------------------------------------
// TaskPanel – główny kontener modułu zadań
// ---------------------------------------------------------------------------

export default function TaskPanel() {
  const [tasks,        setTasks]        = useState([]);
  const [view,         setView]         = useState("list");   // "list" | "details" | "editor"
  const [selectedTask, setSelectedTask] = useState(null);

  /** Pobiera wszystkie zadania przez IPC tasks:getAll. */
  async function loadTasks() {
    const res = await window.electronAPI.invoke("tasks:getAll");
    if (res?.ok) setTasks(res.data);
  }

  // Ładuje zadania przy pierwszym renderze
  useEffect(() => {
    loadTasks();
  }, []);

  /** Otwiera widok szczegółów wybranego zadania. */
  function openDetails(task) {
    setSelectedTask(task);
    setView("details");
  }

  /** Otwiera edytor (null = nowe zadanie, obiekt = edycja istniejącego). */
  function openEditor(task = null) {
    setSelectedTask(task);
    setView("editor");
  }

  /** Wraca do listy i odświeża dane. */
  function backToList() {
    setSelectedTask(null);
    setView("list");
    loadTasks();
  }

  return (
    <div className="taskpanel-container">
      {view === "list" && (
        <TaskList
          tasks={tasks}
          onOpenDetails={openDetails}
          onOpenEditor={openEditor}
        />
      )}

      {view === "details" && (
        <TaskDetails
          task={selectedTask}
          onBack={backToList}
          onEdit={() => openEditor(selectedTask)}
        />
      )}

      {view === "editor" && (
        <TaskEditor
          task={selectedTask}
          onCancel={backToList}
          onSaved={backToList}
        />
      )}
    </div>
  );
}

// =============================================================================
// END OF FILE
// =============================================================================
