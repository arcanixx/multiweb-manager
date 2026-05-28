// =============================================================================
// FILE: MarkdownPreviewer.jsx
// PATH: src/ui/tools/MarkdownPreviewer.jsx
// VERSION: 0.0.3
// PURPOSE: Podgląd Markdown na żywo (split view)
// FUNCTIONS: MarkdownPreviewer
// DEPENDS ON: react, translations.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState } from 'react';
import { TranslationContext } from '../utils/translations.js';
export default function MarkdownPreviewer() {
  const { t } = React.useContext(TranslationContext);
  const [markdown, setMarkdown] = useState('# Hello World\n\nThis is **Markdown** previewer.');
  const [html, setHtml] = useState('');
  // Prosta konwersja Markdown → HTML (uproszczona, bez zależności)
  const convertToHtml = (md) => {
    let html = md
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(?!<[a-z])/gm, '<p>$&</p>');
    return `<div class="markdown-body">${html}</div>`;
  };
  const handleChange = (e) => {
    const value = e.target.value;
    setMarkdown(value);
    setHtml(convertToHtml(value));
  };
  return (
    <div className="tool-container markdown-previewer">
      <h2>{t('tools.markdownPreviewer')}</h2>
      <div className="split-view">
        <div className="split-pane">
          <label>{t('tools.editor')}</label>
          <textarea
            value={markdown}
            onChange={handleChange}
            rows={20}
            placeholder={t('tools.markdownPlaceholder')}
          />
        </div>
        <div className="split-pane">
          <label>{t('tools.preview')}</label>
          <div className="preview-content" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </div>
  );
}