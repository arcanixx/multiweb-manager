// =============================================================================
// FILE: markdownRenderer.js
// PATH: src/tools/markdownRenderer.js
// VERSION: 0.0.3
// PURPOSE: Renderowanie markdown do HTML przy użyciu marked
//          - renderMarkdown(text) zwraca string HTML
// =============================================================================

import { marked } from "marked";

export function renderMarkdown(text) {
  return marked(text);
}

// =============================================================================
// END OF FILE
// =============================================================================
