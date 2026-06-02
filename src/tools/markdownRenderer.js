// =============================================================================
// FILE: markdownRenderer.js
// PATH: src/tools/markdownRenderer.js
// VERSION: 0.0.3
// PURPOSE: Renderowanie markdown do HTML przy użyciu marked - renderMarkdown(text) zwraca string HTML
// FUNCTIONS: renderMarkdown
// DEPENDS ON: marked, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { marked } from "marked";
import { logDebug, logError } from "../utils/logger.js";

// ─── renderMarkdown() – Konwertuje przekazany tekst w formacie Markdown na znacznik HTML przy użyciu biblioteki marked, rejestrując przebieg operacji w logach
export function renderMarkdown(text) {
  try {
    logDebug(`markdownRenderer.renderMarkdown: ${text?.length || 0} chars`);
    const html = marked(text);
    return html;
  } catch (err) {
    logError("markdownRenderer.renderMarkdown failed", err);
    throw err;
  }
}

