// =============================================================================
// FILE: ToolsPanel.jsx
// PATH: src/ui/tools/ToolsPanel.jsx
// VERSION: 0.0.3
// PURPOSE:    Główny panel narzędziowy aplikacji (Tools Panel) – dostarcza interfejs
//             oparty na zakładkach do obsługi narzędzi pomocniczych (JSON Formatter,
//             Regex Tester, Clipboard History, Image Tools, Mini Postman, Cookie Grabber
//             itp.). Obsługuje dynamiczne ładowanie na podstawie flag funkcji (feature flags).
//             Komponenty narzędzi ładowane leniwie (React.lazy) — kod pobierany dopiero
//             po pierwszym kliknięciu zakładki, co skraca czas startu aplikacji.
// FUNCTIONS: ToolsPanel
// DEPENDS ON: react, config.js, translations.js, icons, loggerRenderer, RemoveBgTool.jsx,
//             StringCombiner.jsx, JsonFormatter.jsx, RegexTester.jsx, MarkdownPreviewer.jsx,
//             ClipboardHistory.jsx, ImageTools.jsx, SvgToPngConverter.jsx, MiniPostman.jsx,
//             FilePreviewer.jsx, CookieGrabber.jsx, Spinner.jsx
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useContext, Suspense, lazy } from 'react';
import { isFeatureEnabled } from '../../config.js';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons';
import { logDebug } from '../../utils/loggerRenderer';
import { Spinner } from '../views/Spinner';

// ─── Lazy imports – kod każdego narzędzia pobierany dopiero przy pierwszym użyciu
//   Dzięki temu główny bundle nie zawiera kodu narzędzi, których użytkownik
//   może nigdy nie otworzyć. Przekłada się to bezpośrednio na szybszy startup.
const RemoveBgTool      = lazy(() => import('./RemoveBgTool.jsx'));
const StringCombiner    = lazy(() => import('./StringCombiner.jsx'));
const JsonFormatter     = lazy(() => import('./JsonFormatter.jsx'));
const RegexTester       = lazy(() => import('./RegexTester.jsx'));
const MarkdownPreviewer = lazy(() => import('./MarkdownPreviewer.jsx'));
const ClipboardHistory  = lazy(() => import('./ClipboardHistory.jsx'));
const ImageTools        = lazy(() => import('./ImageTools.jsx'));
const SvgToPngConverter = lazy(() => import('./SvgToPngConverter.jsx'));
const MiniPostman       = lazy(() => import('./MiniPostman.jsx'));
const FilePreviewer     = lazy(() => import('./FilePreviewer.jsx'));
const CookieGrabber     = lazy(() => import('./CookieGrabber.jsx'));

// ─── ToolsPanel() – kontener narzędzi z zakładkami
//   @param {Object} props                    – właściwości komponentu
//   @param {string} props.removeBgApiKey     – klucz API Remove.bg
//   @param {string} props.plan               – plan subskrypcji Remove.bg
//   @param {string} props.activeWebViewId    – ID aktywnej webview
//   @returns {JSX.Element}                   – renderowany panel narzędzi
export default function ToolsPanel({ removeBgApiKey, plan = 'free', activeWebViewId }) {
  const { t } = useContext(TranslationContext);
  const [activeTool, setActiveTool] = useState('removebg');

  // ─── handleSetActiveTool() – Ustawia aktywne narzędzie i loguje przełączenie
  //   @param {string} toolId – identyfikator narzędzia do aktywacji
  const handleSetActiveTool = (toolId) => {
    setActiveTool(toolId);
    logDebug('ui', `ToolsPanel: switched to ${toolId}`);
  };

  // ─── allTools – pełna lista narzędzi z opcjonalnym feature flagiem
  //   feature: null  → zawsze widoczne
  //   feature: 'key' → widoczne tylko gdy isFeatureEnabled('key') === true
  const allTools = [
    { id: 'removebg',        icon: ICONS.REMOVEBG,      label: t('tools.removebg'),        feature: 'removeBg' },
    { id: 'stringCombiner',  icon: ICONS.STRINGCOMBINER, label: t('tools.stringCombiner'),  feature: 'stringCombiner' },
    { id: 'jsonFormatter',   icon: ICONS.JSON,           label: t('tools.jsonFormatter'),   feature: 'jsonYamlXmlFormatter' },
    { id: 'regexTester',     icon: ICONS.REGEX,          label: t('tools.regexTester'),     feature: 'regexTester' },
    { id: 'markdownPreviewer', icon: ICONS.MARKDOWN,     label: t('tools.markdownPreviewer'), feature: 'markdownPreviewer' },
    { id: 'clipboardHistory', icon: ICONS.CLIPBOARD,     label: t('tools.clipboardHistory'), feature: 'clipboardHistory' },
    { id: 'imageTools',      icon: ICONS.IMAGE,          label: t('tools.imageTools'),      feature: 'imageTools' },
    { id: 'svgToPng',        icon: ICONS.SVG,            label: t('tools.svgToPng'),        feature: 'svgToPng' },
    { id: 'miniPostman',     icon: ICONS.API,            label: t('tools.miniPostman'),     feature: 'miniPostman' },
    { id: 'filePreviewer',   icon: ICONS.PREVIEW,        label: t('tools.filePreviewer'),   feature: 'filePreviewer' },
    { id: 'cookieGrabber',   icon: ICONS.COOKIE,         label: t('tools.cookieGrabber'),   feature: 'cookieGrabber' },
  ];

  const tools = allTools.filter(tool => !tool.feature || isFeatureEnabled(tool.feature));

  return (
    <div className="tools-panel">
      {/* Sidebar z zakładkami narzędzi */}
      <div className="tools-sidebar">
        {tools.map(tool => (
          <button
            key={tool.id}
            className={`tools-tab ${activeTool === tool.id ? 'active' : ''}`}
            onClick={() => handleSetActiveTool(tool.id)}
          >
            <span className="tools-tab-icon">{tool.icon}</span>
            <span className="tools-tab-label">{tool.label}</span>
          </button>
        ))}
      </div>

      {/* Obszar treści – Suspense opakowuje lazy komponenty
          Spinner wyświetla się tylko podczas pierwszego ładowania modułu
          (kolejne przełączenia są już z cache'a — brak migotania) */}
      <div className="tools-content">
        <Suspense fallback={<Spinner />}>
          {activeTool === 'removebg'        && <RemoveBgTool apiKey={removeBgApiKey} plan={plan} />}
          {activeTool === 'stringCombiner'  && <StringCombiner />}
          {activeTool === 'jsonFormatter'   && <JsonFormatter />}
          {activeTool === 'regexTester'     && <RegexTester />}
          {activeTool === 'markdownPreviewer' && <MarkdownPreviewer />}
          {activeTool === 'clipboardHistory' && <ClipboardHistory />}
          {activeTool === 'imageTools'      && <ImageTools />}
          {activeTool === 'svgToPng'        && <SvgToPngConverter />}
          {activeTool === 'miniPostman'     && <MiniPostman />}
          {activeTool === 'filePreviewer'   && <FilePreviewer />}
          {activeTool === 'cookieGrabber'   && <CookieGrabber activeWebViewId={activeWebViewId} />}
        </Suspense>
      </div>
    </div>
  );
}
