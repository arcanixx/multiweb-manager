// =============================================================================
// FILE: src/components/HistoryLog.jsx
// PATH: multiweb-manager/src/components/HistoryLog.jsx
// VERSION: v1
// PURPOSE: Widok historii ostatnich 100 odwiedzonych profili.
//          Wyświetla: czas, nazwę profilu, URL. Możliwość czyszczenia historii.
//          NAPRAWIONE: loader, obsługa błędów, confirm przed czyszczeniem.
// DEPENDS ON: icons.js, useTranslation.js, logger.js
// FUNCTIONS: loadHistory, clearHistory
// =============================================================================

import React, { useState, useEffect } from 'react';
import { ICONS } from '../../utils/icons';
import { useTranslation } from '../../hooks/useTranslation';
import { log, error as logError } from '../../utils/logger';

export default function HistoryLog() {
  const { t } = useTranslation();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr]         = useState(null);

  // ----------------------------------------------------------------
  // loadHistory() – pobiera historię z electron-store przez IPC
  // ----------------------------------------------------------------
  const loadHistory = async () => {
    setLoading(true);
    setErr(null);
    try {
      const data = await window.electronAPI.getHistory();
      setHistory(Array.isArray(data) ? data : []);
      log('HistoryLog: loaded', data?.length, 'entries');
    } catch (e) {
      setErr(e.message);
      logError('HistoryLog: load failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadHistory(); }, []);

  // ----------------------------------------------------------------
  // clearHistory() – czyści historię po potwierdzeniu
  // ----------------------------------------------------------------
  const clearHistory = async () => {
    if (!window.confirm(t('history.clear_confirm'))) return;
    await window.electronAPI.clearHistory();
    setHistory([]);
    log('HistoryLog: cleared');
  };

  // Formatowanie czasu
  const formatTime = (iso) => {
    if (!iso) return '–';
    try {
      return new Date(iso).toLocaleString('pl-PL', {
        day: '2-digit', month: '2-digit', year: '2-digit',
        hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return iso;
    }
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '20px 24px', background: 'var(--bg-primary)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* ─── Nagłówek ─── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: 'var(--text-primary)',
              display: 'flex', alignItems: 'center', gap: 10 }}>
              {ICONS.HISTORY} {t('history.title')}
            </h1>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
              {t('history.subtitle')}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary" style={{ fontSize: 12 }}
              onClick={loadHistory}>
              {ICONS.REFRESH}
            </button>
            <button className="btn btn-secondary" style={{ fontSize: 12, color: 'var(--danger)' }}
              onClick={clearHistory} disabled={history.length === 0}>
              {ICONS.DELETE} {t('history.clear')}
            </button>
          </div>
        </div>

        {/* ─── Stany ─── */}
        {loading && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
            <span style={{ fontSize: 24, animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
          </div>
        )}

        {err && (
          <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid var(--danger)',
            borderRadius: 8, color: 'var(--danger)', fontSize: 13, marginBottom: 16 }}>
            {ICONS.WARNING} {err}
          </div>
        )}

        {!loading && !err && history.length === 0 && (
          <div style={{
            textAlign: 'center', padding: 48,
            color: 'var(--text-muted)', fontSize: 14,
            border: '2px dashed var(--border)', borderRadius: 12
          }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>{ICONS.HISTORY}</div>
            {t('history.no_history')}
          </div>
        )}

        {/* ─── Tabela historii ─── */}
        {!loading && history.length > 0 && (
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 10, overflow: 'hidden'
          }}>
            {/* Nagłówki */}
            <div style={{
              display: 'grid', gridTemplateColumns: '160px 1fr 1fr',
              gap: 12, padding: '8px 16px',
              background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)',
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.05em', color: 'var(--text-muted)'
            }}>
              <span>{t('history.col_time')}</span>
              <span>{t('history.col_profile')}</span>
              <span>{t('history.col_url')}</span>
            </div>

            {/* Wiersze */}
            {history.map((entry, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '160px 1fr 1fr',
                gap: 12, padding: '8px 16px',
                borderBottom: i < history.length - 1 ? '1px solid var(--border)' : 'none',
                fontSize: 12, alignItems: 'center',
                background: i % 2 === 0 ? 'transparent' : 'var(--bg-secondary)',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'var(--bg-secondary)'}>
                <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>
                  {formatTime(entry.timestamp)}
                </span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {entry.profileName || '–'}
                </span>
                <span style={{ color: 'var(--text-secondary)', fontSize: 11,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  title={entry.url}>
                  {entry.url || '–'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
