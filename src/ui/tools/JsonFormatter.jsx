// =============================================================================
// FILE: JsonFormatter.jsx
// PATH: src/ui/tools/JsonFormatter.jsx
// VERSION: 0.0.3
// PURPOSE: Formatowanie i walidacja JSON/YAML/XML
// FUNCTIONS: JsonFormatter
// DEPENDS ON: react, translations.js, src
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState } from 'react';
import { TranslationContext } from '../utils/translations.js';
import { logError } from 'src/utils/loggerRenderer';

export default function JsonFormatter() {
  const { t } = React.useContext(TranslationContext);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState('json'); // json, yaml, xml
  const handleFormat = () => {
    setError('');
    try {
      if (mode === 'json') {
        const parsed = JSON.parse(input);
        setOutput(JSON.stringify(parsed, null, 2));
      } else if (mode === 'yaml') {
        // Użyj js-yaml jeśli dostępne
        setOutput('YAML formatting requires js-yaml package');
      } else if (mode === 'xml') {
        // Uproszczone formatowanie XML
        const formatted = input.replace(/>\s*</g, '>\n<');
        setOutput(formatted);
      }
    } catch (err) {
      setError(err.message);
      logError('Format error', err);
    }
  };
  const handleMinify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (err) {
      setError(err.message);
    }
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };
  
  return (
    <div className="tool-container">
	<h2>{t('tools.jsonFormatter')}</h2>
      
      <div className="tool-controls">
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="json">JSON</option>
          <option value="yaml">YAML</option>
          <option value="xml">XML</option>
        </select>
        <button onClick={handleFormat}>{t('tools.format')}</button>
        <button onClick={handleMinify}>{t('tools.minify')}</button>
        <button onClick={handleCopy}>{t('tools.copy')}</button>
      </div>
      
      <div className="tool-panels">
        <div className="tool-panel">
          <label>{t('tools.input')}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={15}
            placeholder={t('tools.jsonPlaceholder')}
          />
        </div>
        <div className="tool-panel">
          <label>{t('tools.output')}</label>
          <textarea
            value={output}
            readOnly
            rows={15}
            className={error ? 'error' : ''}
          />
          {error && <div className="tool-error">{error}</div>}
        </div>
      </div>
    </div>
  );
}
