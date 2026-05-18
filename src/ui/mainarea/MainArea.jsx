// =============================================================================
// FILE: MainArea.jsx
// PATH: src/ui/MainArea/MainArea.jsx
// VERSION: 0.0.3
// PURPOSE: Main content area
//          - renderuje wybrany moduł na podstawie props `active`
// =============================================================================

import React from "react";
import { Profiles } from "../modules/Profiles.jsx";
import { Tasks } from "../modules/Tasks.jsx";
import { Projects } from "../modules/Projects.jsx";
import { TerminalView } from "../modules/TerminalView.jsx";
import { Tools } from "../modules/Tools.jsx";
import { Settings } from "../modules/Settings.jsx";

export function MainArea({ active }) {
  let content = null;

  switch (active) {
    case "profiles":
      content = <Profiles />;
      break;
    case "tasks":
      content = <Tasks />;
      break;
    case "projects":
      content = <Projects />;
      break;
    case "terminal":
      content = <TerminalView />;
      break;
    case "tools":
      content = <Tools />;
      break;
    case "settings":
      content = <Settings />;
      break;
    default:
      content = (
        <div className="main-placeholder">
          Select a module from the sidebar.
        </div>
      );
  }

  return <div className="main-area">{content}</div>;
}

// =============================================================================
// END OF FILE
// =============================================================================
