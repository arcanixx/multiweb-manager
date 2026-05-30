// =============================================================================
// FILE: SvgToPngConverter.jsx
// PATH: src/ui/tools/SvgToPngConverter.jsx
// VERSION: 0.0.3
// PURPOSE: Konwersja SVG → PNG z wyborem rozdzielczości (drag & drop, preview)
// FUNCTIONS: SvgToPngConverter
// DEPENDS ON: react, translations.js, src
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useCallback } from 'react';
import { TranslationContext } from '../utils/translations.js';
import { logDebug, logError } from 'src/utils/loggerRenderer';
import { ICONS } from 'src/utils/icons';
import { svgToPng } from 'src/tools/svgToPng';

export default function SvgToPngConverter() {
  const { t } = React.useContext(TranslationContext);
  const [inputFile, setInputFile] = useState(null);
  const [svgContent, setSvgContent] = useState(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [outputPath, setOutputPath] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleFileDrop = useCallback(async (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0] || e.target?.files[0];
    if (!file || !file.name.endsWith('.svg')) {
      setError(t('svgToPng.invalidFile'));
      return;
    }
    setInputFile(file);
    setError(null);
    setOutputPath(null);
    // Odczytaj SVG do preview
    const text = await file.text();
    setSvgContent(text);
    logDebug(`SvgToPng: loaded ${file.name}`);
  }, [t]);
  
   // ─── handleConvert() – Konwertuje załadowany plik SVG na PNG przy użyciu podanej szerokości i wysokości, a następnie ustawia ścieżkę wyjściową do pobrania.
   //   @returns {Promise<void>} – obietnica rozwiązywana po zakończeniu konwersji
   const handleConvert = async () => {
    if (!inputFile) {
      setError(t('svgToPng.noFile'));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const inputPath = await window.electronAPI?.saveTempFile?.(inputFile);
      if (!inputPath) throw new Error('Cannot save temp file');
      
      const tempOutput = await window.electronAPI?.getTempPath?.('output.png');
      const resultPath = await svgToPng(inputPath, tempOutput, width, height);
      
      setOutputPath(resultPath);
      logDebug(`SvgToPng: converted successfully → ${resultPath}`);
    } catch (err) {
      logError('SvgToPng conversion failed', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

   // ─── handleDownload() – Inicjalizuje pobranie wygenerowanego pliku PNG poprzez wywołanie okna dialogowego zapisu pliku.
   //   @returns {Promise<void>} – obietnica rozwiązywana po zakończeniu pobierania
   const handleDownload = async () => {
    if (!outputPath) return;
    await window.electronAPI?.showSaveDialog?.(outputPath);
  };

  return (
    <div className="tool-container svg-to-png">
      <h2>{ICONS.SVG} {t('svgToPng.title')}</h2>
      
      <div 
        className="file-drop-zone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
        onClick={() => document.getElementById('svg-input').click()}
      >
        {svgContent ? (
          <div className="svg-preview" dangerouslySetInnerHTML={{ __html: svgContent }} />
        ) : (
          <span>{ICONS.UPLOAD} {t('svgToPng.dropOrClick')}</span>
        )}
        <input
          id="svg-input"
          type="file"
          accept=".svg"
          style={{ display: 'none' }}
          onChange={handleFileDrop}
        />
      </div>
      
      {inputFile && (
        <div className="conversion-options">
          <div className="option-group">
            <label>{t('svgToPng.width')}</label>
            <input type="number" value={width} onChange={(e) => setWidth(parseInt(e.target.value))} />
          </div>
          <div className="option-group">
            <label>{t('svgToPng.height')}</label>
            <input type="number" value={height} onChange={(e) => setHeight(parseInt(e.target.value))} />
          </div>
          <button onClick={handleConvert} disabled={loading} className="btn-primary">
            {loading ? t('common.converting') : t('svgToPng.convert')}
          </button>
        </div>
      )}
      
      {error && <div className="error-message">{ICONS.WARNING} {error}</div>}
      
      {outputPath && (
        <div className="output-result">
          <p>{ICONS.SUCCESS} {t('svgToPng.converted')}</p>
          <button onClick={handleDownload} className="btn-secondary">
            {ICONS.DOWNLOAD} {t('svgToPng.download')}
          </button>
        </div>
      )}
    </div>
  );
}
