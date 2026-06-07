// =============================================================================
// FILE: ImageTools.jsx
// PATH: src/ui/tools/ImageTools.jsx
// VERSION: 0.0.3
// PURPOSE: Kompresja, resize i konwersja obrazów (drag & drop, preview)
// FUNCTIONS: ImageTools
// DEPENDS ON: react, config.js, translations.js, loggerRenderer, icons, imageUtils
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useCallback } from 'react';
import { isFeatureEnabled } from '../../config.js';
import { TranslationContext } from '../../utils/translations.js';
import { logDebug, logError } from '../../utils/loggerRenderer';
import { ICONS } from '../../utils/icons';
import { resizeImage, convertImage, compressJpeg } from '../../utils/imageUtils';

export default function ImageTools() {
  const { t } = React.useContext(TranslationContext);
  const [inputFile, setInputFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [outputPath, setOutputPath] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [operation, setOperation] = useState('resize');
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [format, setFormat] = useState('png');
  const [quality, setQuality] = useState(80);

  const handleFileDrop = useCallback(async (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0] || e.target?.files[0];
    if (!file || !file.type.startsWith('image/')) {
      setError(t('imageTools.invalidFile'));
      return;
    }
    setInputFile(file);
    setError(null);
    setOutputPath(null);
    // Preview
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
    logDebug('tools', `ImageTools: loaded ${file.name} (${file.size} bytes)`);
  }, [t]);
  // ─── handleProcess() – przetwarza obraz wybraną operacją (resize, convert, compress)
  const handleProcess = async () => {
    if (!inputFile) {
      setError(t('imageTools.noFile'));
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Użyj electronAPI do zapisu pliku tymczasowego
      const inputPath = await window.electronAPI?.saveTempFile?.(inputFile);
      if (!inputPath) throw new Error('Cannot save temp file');

      const outputExt = operation === 'convert' ? format : 'jpg';
      const tempOutput = await window.electronAPI?.getTempPath?.(`output.${outputExt}`);

      let resultPath;
      switch (operation) {
      case 'resize':
	    resultPath = await resizeImage(inputPath, width, height, tempOutput);
	    break;
	  case 'convert':
	    resultPath = await convertImage(inputPath, format, tempOutput);
	    break;
	  case 'compress':
	    resultPath = await compressJpeg(inputPath, quality, tempOutput);
	    break;
      default:
        throw new Error('Unknown operation');
      }

      setOutputPath(resultPath);
      logDebug('tools', `ImageTools: processed successfully → ${resultPath}`);
    } catch (err) {
      logError('tools', 'ImageTools processing failed', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ─── handleDownload() – otwiera dialog zapisu dla przetworzonego obrazu
  const handleDownload = async () => {
    if (!outputPath) return;
    await window.electronAPI?.showSaveDialog?.(outputPath);
  };

  if (!isFeatureEnabled('imageTools')) return null;

  return (
    <div className="tool-container image-tools">
      <h2>{ICONS.IMAGE} {t('imageTools.title')}</h2>

      <div
        className="file-drop-zone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
        onClick={() => document.getElementById('image-input').click()}
      >
        {preview ? (
          <img src={preview} alt="Preview" className="drop-preview" />
        ) : (
          <span>{ICONS.UPLOAD} {t('imageTools.dropOrClick')}</span>
        )}
        <input
          id="image-input"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileDrop}
        />
      </div>

      {inputFile && (
        <div className="image-options">
          <div className="option-group">
            <label>{t('imageTools.operation')}</label>
            <select value={operation} onChange={(e) => setOperation(e.target.value)}>
              <option value="resize">{t('imageTools.resize')}</option>
              <option value="convert">{t('imageTools.convert')}</option>
              <option value="compress">{t('imageTools.compress')}</option>
            </select>
          </div>

          {operation === 'resize' && (
            <div className="option-group">
              <label>{t('imageTools.dimensions')}</label>
              <input type="number" value={width} onChange={(e) => setWidth(parseInt(e.target.value))} placeholder="Width" />
              <span>x</span>
              <input type="number" value={height} onChange={(e) => setHeight(parseInt(e.target.value))} placeholder="Height" />
            </div>
          )}

          {operation === 'convert' && (
            <div className="option-group">
              <label>{t('imageTools.format')}</label>
              <select value={format} onChange={(e) => setFormat(e.target.value)}>
                <option value="png">PNG</option>
                <option value="jpg">JPEG</option>
                <option value="webp">WebP</option>
              </select>
            </div>
          )}

          {operation === 'compress' && (
            <div className="option-group">
              <label>{t('imageTools.quality')} ({quality}%)</label>
              <input type="range" min="1" max="100" value={quality} onChange={(e) => setQuality(parseInt(e.target.value))} />
            </div>
          )}

          <button onClick={handleProcess} disabled={loading} className="btn-primary">
            {loading ? t('common.processing') : t('imageTools.process')}
          </button>
        </div>
      )}

      {error && <div className="error-message">{ICONS.WARNING} {error}</div>}

      {outputPath && (
        <div className="output-result">
          <p>{ICONS.SUCCESS} {t('imageTools.processed')}</p>
          <button onClick={handleDownload} className="btn-secondary">
            {ICONS.DOWNLOAD} {t('imageTools.download')}
          </button>
        </div>
      )}
    </div>
  );
}