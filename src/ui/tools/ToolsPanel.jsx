// =============================================================================
// FILE: ToolsPanel.jsx
// PATH: src/ui/tools/ToolsPanel.jsx
// VERSION: 0.0.3
// PURPOSE: Główny panel narzędziowy aplikacji (Tools Panel) – dostarcza interfejs oparty na zakładkach do obsługi narzędzi pomocniczych (JSON Formatter, Regex Tester, Clipboard History, Image Tools, Mini Postman, Cookie Grabber itp.). Obsługuje dynamiczne ładowanie na podstawie flag funkcji (feature flags).
// FUNCTIONS: ToolsPanel
// DEPENDS ON: react, config.js, translations.js, icons, loggerRenderer, RemoveBgTool.jsx, StringCombiner.jsx, JsonFormatter.jsx, RegexTester.jsx, MarkdownPreviewer.jsx, ClipboardHistory.jsx, ImageTools.jsx, SvgToPngConverter.jsx, MiniPostman.jsx, FilePreviewer.jsx, CookieGrabber.jsx
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useContext } from "react";
import { isFeatureEnabled } from '../../config.js';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons';
import { logDebug, logInfo, logWarn } from '../../utils/loggerRenderer';
import RemoveBgTool from './RemoveBgTool.jsx';
import StringCombiner from './StringCombiner.jsx';
import JsonFormatter from './JsonFormatter.jsx';
import RegexTester from './RegexTester.jsx';
import MarkdownPreviewer from './MarkdownPreviewer.jsx';
import ClipboardHistory from './ClipboardHistory.jsx';
import ImageTools from './ImageTools.jsx';
import SvgToPngConverter from './SvgToPngConverter.jsx';
import MiniPostman from './MiniPostman.jsx';
import FilePreviewer from './FilePreviewer.jsx';
import CookieGrabber from './CookieGrabber.jsx';

// ─── ToolsPanel() – kontener narzędzi z zakładkami
//   @param {Object} props – właściwości komponentu
//   @param {string} props.removeBgApiKey – klucz API Remove.bg
//   @param {string} props.plan – plan subskrypcji Remove.bg
//   @param {string} props.activeWebViewId – ID aktywnej webview
//   @returns {JSX.Element} – renderowany panel narzędzi
export default function ToolsPanel({ removeBgApiKey, plan = "free", activeWebViewId }) {
  const { t } = useContext(TranslationContext);
  const [activeTool, setActiveTool] = useState("removebg");

  // ─── TOOLS_LIST – stała z listą dostępnych narzędzi

  // ─── handleSetActiveTool() – Ustawia aktywne narzędzie w panelu i rejestruje przełączenie w logach.
   //   @param {string} toolId – identyfikator narzędzia do aktywacji
   const handleSetActiveTool = (toolId) => {
    setActiveTool(toolId);
    logDebug('ui', `ToolsPanel: switched to ${toolId}`);
  };
  const allTools = [
    { id: "removebg", icon: ICONS.REMOVEBG, label: t("tools.removebg"), feature: null },
    { id: "stringCombiner", icon: ICONS.STRINGCOMBINER, label: t("tools.stringCombiner"), feature: null },
    { id: "jsonFormatter", icon: ICONS.JSON, label: t("tools.jsonFormatter"), feature: 'jsonYamlXmlFormatter' },
    { id: "regexTester", icon: ICONS.REGEX, label: t("tools.regexTester"), feature: 'regexTester' },
    { id: "markdownPreviewer", icon: ICONS.MARKDOWN, label: t("tools.markdownPreviewer"), feature: 'markdownPreviewer' },
    { id: "clipboardHistory", icon: ICONS.CLIPBOARD, label: t("tools.clipboardHistory"), feature: 'clipboardHistory' },
    { id: "imageTools", icon: ICONS.IMAGE, label: t("tools.imageTools"), feature: 'imageTools' },
    { id: "svgToPng", icon: ICONS.SVG, label: t("tools.svgToPng"), feature: 'svgToPng' },
    { id: "miniPostman", icon: ICONS.API, label: t("tools.miniPostman"), feature: 'miniPostman' },
    { id: "filePreviewer", icon: ICONS.PREVIEW, label: t("tools.filePreviewer"), feature: 'filePreviewer' },
    { id: "cookieGrabber", icon: ICONS.COOKIE, label: t("tools.cookieGrabber"), feature: 'cookieGrabber' }
  ];
  const tools = allTools.filter(tool => !tool.feature || isFeatureEnabled(tool.feature));
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