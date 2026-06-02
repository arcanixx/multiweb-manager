// =============================================================================
// FILE: ClipboardHistory.jsx
// PATH: src/ui/tools/ClipboardHistory.jsx
// VERSION: 0.0.3
// PURPOSE: Historia schowka z pinowaniem i wyszukiwarką
// FUNCTIONS: ClipboardHistory
// DEPENDS ON: react, config.js, translations.js, loggerRenderer, icons
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useEffect } from 'react';
import { isFeatureEnabled } from '../../../config.js';
import { TranslationContext } from '../utils/translations.js';
import { logDebug, logInfo, logWarn } from '../../utils/loggerRenderer';
import { ICONS } from '../../utils/icons';
import { CLIPBOARD_HISTORY_MAX } from '../../../config.js';

// ─── ClipboardHistory() – historia schowka z możliwością pinowania
//   @returns {JSX.Element} – renderowany interfejs historii schowka
export default function ClipboardHistory() {
  const { t } = React.useContext(TranslationContext);
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('');
  const [pinned, setPinned] = useState([]);

  // ─── useEffect – ładowanie historii i polling schowka
  useEffect(() => {
    const saved = localStorage.getItem('clipboard_history');
    if (saved) setHistory(JSON.parse(saved));
    const savedPinned = localStorage.getItem('clipboard_pinned');
    if (savedPinned) setPinned(JSON.parse(savedPinned));
    const interval = setInterval(async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (text && text !== history[0]?.text) {
          const newEntry = { id: Date.now(), text, timestamp: new Date().toISOString() };
          setHistory(prev => [newEntry, ...prev].slice(0, CLIPBOARD_HISTORY_MAX));
        }
      } catch (err) {
        // Brak permisji – ignoruj
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [history]);
  useEffect(() => {
    localStorage.setItem('clipboard_history', JSON.stringify(history));
  }, [history]);
  useEffect(() => {
    localStorage.setItem('clipboard_pinned', JSON.stringify(pinned));
  }, [pinned]);

  if (!isFeatureEnabled('clipboardHistory')) return null;

  // ─── handleCopy() – kopiuję tekst do schowka
//   @param {string} text – tekst do skopiowania
  const handleCopy = async (text) => {
    await navigator.clipboard.writeText(text);
    logDebug('tools', 'ClipboardHistory: copied to clipboard', { textLength: text.length });
  };

  // ─── handlePin() – przypięcie wpisu do listy pinned
//   @param {number} id – ID wpisu do przypięcia
  const handlePin = (id) => {
    const entry = history.find(h => h.id === id);
    if (entry && !pinned.find(p => p.id === id)) {
      setPinned(prev => [...prev, entry]);
      logDebug('tools', 'ClipboardHistory: pinned entry', { id });
    }
  };

  // ─── handleUnpin() – odpinanie wpisu z listy pinned
//   @param {number} id – ID wpisu do odpinania
  const handleUnpin = (id) => {
    setPinned(prev => prev.filter(p => p.id !== id));
  };

  // ─── handleClear() – czyszczenie całej historii schowka
  const handleClear = () => {
    setHistory([]);
    setPinned([]);
    logDebug('tools', 'ClipboardHistory: cleared all history');
  };

  const filteredHistory = history.filter(h =>
    h.text.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="tool-container clipboard-history">
      <h2>{ICONS.CLIPBOARD} {t('tools.clipboardHistory')}</h2>

      <div className="tool-controls">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder={t('tools.search')}
        />
        <button onClick={handleClear}>{ICONS.DELETE} {t('tools.clearHistory')}</button>
      </div>

      {pinned.length > 0 && (
        <div className="history-section">
          <h3>{ICONS.PIN} {t('tools.pinned')}</h3>
          {pinned.map(entry => (
            <div key={entry.id} className="history-item pinned">
              <span className="history-text">{entry.text.substring(0, 100)}</span>
              <div className="history-actions">
                <button onClick={() => handleCopy(entry.text)}>{ICONS.COPY}</button>
                <button onClick={() => handleUnpin(entry.id)}>{ICONS.UNPIN}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="history-section">
        <h3>{ICONS.HISTORY} {t('tools.history')}</h3>
        {filteredHistory.map(entry => (
          <div key={entry.id} className="history-item">
            <span className="history-text">{entry.text.substring(0, 100)}</span>
            <div className="history-actions">
              <button onClick={() => handleCopy(entry.text)}>{ICONS.COPY}</button>
              {!pinned.find(p => p.id === entry.id) && (
                <button onClick={() => handlePin(entry.id)}>{ICONS.PIN}</button>
              )}
            </div>
            <span className="history-time">{new Date(entry.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
        {filteredHistory.length === 0 && (
          <div className="empty-history">{ICONS.INFO} {t('tools.noHistory')}</div>
        )}
      </div>
    </div>
  );
}