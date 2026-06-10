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

// ─── MARKED_OPTIONS – opcje bezpieczeństwa dla marked
// html: false – blokuje surowy HTML zawarty w markdown (ochrona przed XSS)
// Użytkownicy piszą notatki i opisy zadań – nie ufamy HTML w treści
const MARKED_OPTIONS = {
  html:      false, // BEZPIECZEŃSTWO: blokuje <script>, <iframe> itp. w markdown
  breaks:    true,  // zamień \n na <br> (wygodniejsze w notatkach)
  gfm:       true,  // GitHub Flavored Markdown (tabele, strikethrough)
};

// ─── renderMarkdown() – Konwertuje tekst Markdown na HTML przy użyciu marked
//   @param {string} text – tekst w formacie Markdown
//   @returns {string}    – HTML gotowy do wyświetlenia
export function renderMarkdown(text) {
  try {
    logDebug('tools', `markdownRenderer.renderMarkdown: ${text?.length || 0} chars`);
    const html = marked(text, MARKED_OPTIONS);
    return html;
  } catch (err) {
    logError('tools', "markdownRenderer.renderMarkdown failed", err);
    throw err;
  }
}
