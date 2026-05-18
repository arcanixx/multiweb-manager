// =============================================================================
// FILE: ToolsPanel.jsx
// PATH: src/ui/tools/ToolsPanel.jsx
// VERSION: 0.0.4
// PURPOSE: Kontener narzędzi – przełączanie między:
//          RemoveBgTool, StringCombiner i kolejnymi modułami tools.
// =============================================================================

import React, { useState } from "react";
import { useTranslation } from "../../hooks/useTranslation";
import { ICONS } from "../../utils/icons";
import RemoveBgTool from "../../components/RemoveBgTool.jsx";
import StringCombiner from "../../components/StringCombiner.jsx";

export default function ToolsPanel({ removeBgApiKey, plan = "free" }) {
  const { t } = useTranslation();
  const [activeTool, setActiveTool] = useState("removebg");

  const tools = [
    { id: "removebg", icon: ICONS.REMOVEBG, label: t("tools.removebg") },
    {
      id: "stringCombiner",
      icon: ICONS.STRINGCOMBINER,
      label: t("tools.stringCombiner")
    }
    // kolejne narzędzia będą dokładane tutaj (formatter, regex, markdown, svg2png, previewer, miniPostman, screenshot)
  ];

  return (
    <div className="tools-panel">
      <div className="tools-sidebar">
        {tools.map(tool => (
          <button
            key={tool.id}
            className={`tools-tab ${
              activeTool === tool.id ? "active" : ""
            }`}
            onClick={() => setActiveTool(tool.id)}
          >
            <span className="tools-tab-icon">{tool.icon}</span>
            <span className="tools-tab-label">{tool.label}</span>
          </button>
        ))}
      </div>

      <div className="tools-content">
        {activeTool === "removebg" && (
          <RemoveBgTool apiKey={removeBgApiKey} plan={plan} />
        )}
        {activeTool === "stringCombiner" && <StringCombiner />}
      </div>
    </div>
  );
}
