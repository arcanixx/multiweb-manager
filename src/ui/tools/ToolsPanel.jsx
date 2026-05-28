// =============================================================================
// FILE: ToolsPanel.jsx
// PATH: src/ui/tools/ToolsPanel.jsx
// VERSION: 0.0.3
// PURPOSE: Kontener narzędzi – przełączanie między wszystkimi toolami
// FUNCTIONS: ToolsPanel
// DEPENDS ON: react, translations.js, icons, loggerRenderer, RemoveBgTool, StringCombiner, JsonFormatter, RegexTester, MarkdownPreviewer, ClipboardHistory, ImageTools, SvgToPngConverter, MiniPostman, FilePreviewer, CookieGrabber
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useContext } from "react";
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons';
import { logDebug } from '../../utils/loggerRenderer';
import RemoveBgTool from "./RemoveBgTool";
import StringCombiner from "./StringCombiner";
import JsonFormatter from "./JsonFormatter";
import RegexTester from "./RegexTester";
import MarkdownPreviewer from "./MarkdownPreviewer";
import ClipboardHistory from "./ClipboardHistory";
import ImageTools from "./ImageTools";
import SvgToPngConverter from "./SvgToPngConverter";
import MiniPostman from "./MiniPostman";
import FilePreviewer from "./FilePreviewer";
import CookieGrabber from "./CookieGrabber";

export default function ToolsPanel({ removeBgApiKey, plan = "free", activeWebViewId }) {
  const { t } = useContext(TranslationContext);
  const [activeTool, setActiveTool] = useState("removebg");
  const handleSetActiveTool = (toolId) => {
    setActiveTool(toolId);
    logDebug(`ToolsPanel: switched to ${toolId}`);
  };
  const tools = [
    { id: "removebg", icon: ICONS.REMOVEBG, label: t("tools.removebg") },
    { id: "stringCombiner", icon: ICONS.STRINGCOMBINER, label: t("tools.stringCombiner") },
    { id: "jsonFormatter", icon: ICONS.JSON, label: t("tools.jsonFormatter") },
    { id: "regexTester", icon: ICONS.REGEX, label: t("tools.regexTester") },
    { id: "markdownPreviewer", icon: ICONS.MARKDOWN, label: t("tools.markdownPreviewer") },
    { id: "clipboardHistory", icon: ICONS.CLIPBOARD, label: t("tools.clipboardHistory") },
    { id: "imageTools", icon: ICONS.IMAGE, label: t("tools.imageTools") },
    { id: "svgToPng", icon: ICONS.SVG, label: t("tools.svgToPng") },
    { id: "miniPostman", icon: ICONS.API, label: t("tools.miniPostman") },
    { id: "filePreviewer", icon: ICONS.PREVIEW, label: t("tools.filePreviewer") },
    { id: "cookieGrabber", icon: ICONS.COOKIE, label: t("tools.cookieGrabber") }
  ];
  return (
    <div className="tools-panel">
      <div className="tools-sidebar">
        {tools.map(tool => (
          <button
            key={tool.id}
            className={`tools-tab ${activeTool === tool.id ? "active" : ""}`}
            onClick={() => handleSetActiveTool(tool.id)}
          >
            <span className="tools-tab-icon">{tool.icon}</span>
            <span className="tools-tab-label">{tool.label}</span>
          </button>
        ))}
      </div>

      <div className="tools-content">
        {activeTool === "removebg" && <RemoveBgTool apiKey={removeBgApiKey} plan={plan} />}
        {activeTool === "stringCombiner" && <StringCombiner />}
        {activeTool === "jsonFormatter" && <JsonFormatter />}
        {activeTool === "regexTester" && <RegexTester />}
        {activeTool === "markdownPreviewer" && <MarkdownPreviewer />}
        {activeTool === "clipboardHistory" && <ClipboardHistory />}
        {activeTool === "imageTools" && <ImageTools />}
        {activeTool === "svgToPng" && <SvgToPngConverter />}
        {activeTool === "miniPostman" && <MiniPostman />}
        {activeTool === "filePreviewer" && <FilePreviewer />}
        {activeTool === "cookieGrabber" && <CookieGrabber activeWebViewId={activeWebViewId} />}
      </div>
    </div>
  );
}
