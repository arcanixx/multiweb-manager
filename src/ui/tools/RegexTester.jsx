// =============================================================================
// FILE: RegexTester.jsx
// PATH: src/ui/tools/RegexTester.jsx
// VERSION: 0.0.3
// PURPOSE: Testowanie wyrażeń regularnych
// FUNCTIONS: RegexTester
// DEPENDS ON: react, translations.js, src
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState } from 'react';
import { TranslationContext } from '../utils/translations.js';
import { logError } from 'src/utils/loggerRenderer';
import { testRegex } from 'src/tools/regexEngine';

export default function RegexTester() {
  const { t } = React.useContext(TranslationContext);
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');
  const handleTest = () => {
  setError('');
  try {
    const rawMatches = testRegex(pattern, flags, testString);
    const results = rawMatches.map(match => ({
      match: match[0],
      index: match.index,
      groups: match.slice(1)
    }));
    setMatches(results);
  } catch (err) {
    setError(err.message);
    logError('Regex error', err);
  }
};
  return (
    <div className="tool-container">
      <h2>{t('tools.regexTester')}</h2>
      <div className="tool-controls">
        <input
          type="text"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder={t('tools.regexPattern')}
          className="regex-pattern"
        />
        <input
          type="text"
          value={flags}
          onChange={(e) => setFlags(e.target.value)}
          placeholder="gim"
          className="regex-flags"
        />
        <button onClick={handleTest}>{t('tools.test')}</button>
      </div>
      
      <div className="tool-panels">
        <div className="tool-panel">
          <label>{t('tools.testString')}</label>
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            rows={10}
            placeholder={t('tools.regexPlaceholder')}
          />
        </div>
        <div className="tool-panel">
          <label>{t('tools.matches')} ({matches.length})</label>
          <div className="matches-list">
            {matches.map((m, i) => (
              <div key={i} className="match-item">
                <span className="match-text">"{m.match}"</span>
                <span className="match-index">@{m.index}</span>
                {m.groups.length > 0 && (
                  <span className="match-groups">groups: {m.groups.join(', ')}</span>
                )}
              </div>
            ))}
            {matches.length === 0 && !error && (
              <div className="no-matches">{t('tools.noMatches')}</div>
            )}
          </div>
          {error && <div className="tool-error">{error}</div>}
        </div>
      </div>
    </div>
  );
}
