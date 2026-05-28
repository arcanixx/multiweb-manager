// =============================================================================
// FILE: MiniPostman.jsx
// PATH: src/ui/tools/MiniPostman.jsx
// VERSION: 0.0.3
// PURPOSE: Lekki API tester (GET/POST/PUT/DELETE, nagłówki, body, odpowiedź)
// FUNCTIONS: MiniPostman
// DEPENDS ON: react, translations.js, src
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState } from 'react';
import { TranslationContext } from '../utils/translations.js';
import { logDebug, logError } from 'src/utils/loggerRenderer';
import { ICONS } from 'src/utils/icons';
import { apiRequest } from 'src/tools/apiClient';
export default function MiniPostman() {
  const { t } = React.useContext(TranslationContext);
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState('{}');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleSend = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      let parsedHeaders = {};
      try {
        parsedHeaders = headers.trim() ? JSON.parse(headers) : {};
      } catch (e) {
        setError(t('tools.invalidHeaders'));
        setLoading(false);
        return;
      }
      logDebug(`MiniPostman: ${method} ${url}`);
      const result = await apiRequest(url, method, parsedHeaders, body);
      setResponse(result);
      logDebug(`MiniPostman: response status ${result.status}`);
    } catch (err) {
      logError('MiniPostman request failed', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleCopyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    }
  };

  return (
    <div className="tool-container mini-postman">
      <h2>{ICONS.API} {t('tools.miniPostman')}</h2>
      
      <div className="postman-controls">
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
          <option>PATCH</option>
        </select>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={t('tools.enterUrl')}
          className="postman-url"
        />
        <button onClick={handleSend} disabled={loading || !url}>
          {loading ? t('common.loading') : t('tools.send')}
        </button>
      </div>
      
      <div className="postman-headers">
        <label>{t('tools.headers')}</label>
        <textarea
          value={headers}
          onChange={(e) => setHeaders(e.target.value)}
          rows={3}
          placeholder='{"Content-Type": "application/json"}'
        />
      </div>
      
      {(method === 'POST' || method === 'PUT' || method === 'PATCH') && (
        <div className="postman-body">
          <label>{t('tools.body')}</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            placeholder={t('tools.bodyPlaceholder')}
          />
        </div>
      )}
      
      {error && (
        <div className="postman-error">
          {ICONS.WARNING} {error}
        </div>
      )}
      
      {response && (
        <div className="postman-response">
          <div className="response-header">
            <span>{ICONS.RESPONSE} {t('tools.response')}</span>
            <button onClick={handleCopyResponse}>{ICONS.COPY}</button>
          </div>
          <div className="response-status">
            {t('tools.status')}: {response.status}
          </div>
          <pre className="response-body">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}