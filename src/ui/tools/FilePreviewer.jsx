// =============================================================================
// FILE: FilePreviewer.jsx
// PATH: src/ui/tools/FilePreviewer.jsx
// VERSION: 0.0.3
// PURPOSE: Podgląd plików (RAW/PREVIEW) – TXT, JSON, HTML, SVG, Markdown, obrazy
// FUNCTIONS: FilePreviewer
// DEPENDS ON: react, translations.js, src
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState } from 'react';
import { TranslationContext } from '../utils/translations.js';
import { logDebug, logError } from 'src/utils/loggerRenderer';
import { ICONS } from 'src/utils/icons';
import { renderMarkdown } from 'src/tools/markdownRenderer';

export default function FilePreviewer() {
  const { t } = React.useContext(TranslationContext);
  const [file, setFile] = useState(null);
  const [content, setContent] = useState('');
  const [mode, setMode] = useState('preview'); // 'raw' or 'preview'
  const [error, setError] = useState(null);

  // ─── handleFileDrop() – obsługuje upuszczenie pliku i wczytuje jego zawartość
//   @param {Event} e – zdarzenie drop/pick
  const handleFileDrop = async (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer?.files[0] || e.target?.files[0];
    if (!droppedFile) return;
    setFile(droppedFile);
    setError(null);
    setMode('preview');
    try {
      const text = await droppedFile.text();
      setContent(text);
      logDebug(`FilePreviewer: loaded ${droppedFile.name} (${droppedFile.size} bytes)`);
    } catch (err) {
      logError('FilePreviewer: failed to read file', err);
      setError(t('tools.cannotReadFile'));
    }
  };

  // ─── getFileIcon() – zwraca odpowiednią ikonę dla typu pliku
  const getFileIcon = () => {
    if (!file) return ICONS.FILE;
    const ext = file.name.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return ICONS.IMAGE;
    if (['json'].includes(ext)) return ICONS.JSON;
    if (['md', 'markdown'].includes(ext)) return ICONS.MARKDOWN;
    if (['html', 'htm'].includes(ext)) return ICONS.HTML;
    return ICONS.FILE;
  };
  
  // ─── renderPreview() – renderuje podgląd pliku w zależności od typu
//   @returns {JSX.Element} – skonwertowany podgląd
  const renderPreview = () => {
    if (!content) return <div className="preview-placeholder">{t('tools.noFileLoaded')}</div>;
    const ext = file?.name.split('.').pop().toLowerCase();
    
    if (mode === 'raw') {
      return <pre className="raw-content">{content}</pre>;
    }
    
    // PREVIEW mode
    if (ext === 'json') {
      try {
        const parsed = JSON.parse(content);
        return <pre className="json-preview">{JSON.stringify(parsed, null, 2)}</pre>;
      } catch {
        return <pre className="raw-content">{content}</pre>;
      }
    }
    
    if (ext === 'md' || ext === 'markdown') {
      const html = renderMarkdown(content);
      return <div className="markdown-preview" dangerouslySetInnerHTML={{ __html: html }} />;
    }
    
    if (ext === 'html' || ext === 'htm') {
      return <iframe srcDoc={content} title="HTML Preview" className="html-preview" />;
    }
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
      return <img src={URL.createObjectURL(file)} alt="Preview" className="image-preview" />;
    }
    
    if (ext === 'svg') {
      return <div className="svg-preview" dangerouslySetInnerHTML={{ __html: content }} />;
    }
    
    return <pre className="raw-content">{content}</pre>;
  };

  return (
    <div className="tool-container file-previewer">
      <h2>{ICONS.PREVIEW} {t('tools.filePreviewer')}</h2>
      
      <div 
        className="file-drop-zone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
        onClick={() => document.getElementById('file-input').click()}
      >
        {ICONS.UPLOAD} {t('tools.dropOrClick')}
        <input
          id="file-input"
          type="file"
          style={{ display: 'none' }}
          onChange={handleFileDrop}
        />
      </div>
      
      {file && (
        <>
          <div className="file-info">
            <span className="file-icon">{getFileIcon()}</span>
            <span className="file-name">{file.name}</span>
            <span className="file-size">({(file.size / 1024).toFixed(1)} KB)</span>
          </div>
          
          <div className="preview-toolbar">
            <button className={mode === 'preview' ? 'active' : ''} onClick={() => setMode('preview')}>
              {ICONS.PREVIEW} {t('tools.preview')}
            </button>
            <button className={mode === 'raw' ? 'active' : ''} onClick={() => setMode('raw')}>
              {ICONS.RAW} {t('tools.raw')}
            </button>
          </div>
          
          <div className="preview-container">
            {error ? <div className="error">{error}</div> : renderPreview()}
          </div>
        </>
      )}
    </div>
  );
}
