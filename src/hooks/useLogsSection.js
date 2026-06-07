// =============================================================================
// FILE: useLogsSection.js
// PATH: src/hooks/useLogsSection.js
// VERSION: 0.0.3
// PURPOSE: Hook logiki sekcji logów – ładowanie ustawień, handlery logów testów i dziennika zdarzeń
// FUNCTIONS: useLogsSection
// DEPENDS ON: react, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useState, useEffect } from 'react';
import { logInfo, logError } from '../utils/loggerRenderer.js';

// ─── useLogsSection() – logika sekcji LogsSection
export function useLogsSection() {
  const [settings,        setSettings]        = useState(null);
  const [logsContent,     setLogsContent]     = useState('');
  const [showLogsModal,   setShowLogsModal]   = useState(false);
  const [eventsContent,   setEventsContent]   = useState('');
  const [showEventsModal, setShowEventsModal] = useState(false);

  // ─── useEffect – ładowanie ustawień przy montowaniu
  useEffect(() => {
    const load = async () => {
      try {
        const result = await window.electronAPI?.getSettings?.();
        setSettings(result?.ok ? (result.data || {}) : { debugMode: false, logsEnabled: false, eventLogEnabled: false });
      } catch (err) {
        logError('settings', 'useLogsSection: failed to load settings', err.message);
        setSettings({ debugMode: false, logsEnabled: false, eventLogEnabled: false });
      }
    };
    load();
  }, []);

  const handleOpenLogs = async () => {
    try {
      await window.electronAPI?.openLogsFolder?.();
      logInfo('settings', 'useLogsSection: logs folder opened');
    } catch (err) { logError('settings', 'useLogsSection: open logs failed', err.message); }
  };

  const handleViewLogs = async () => {
    try {
      const res = await window.electronAPI?.logsGet?.();
      if (res?.ok) { setLogsContent(res.data || ''); setShowLogsModal(true); }
    } catch (err) { logError('settings', 'useLogsSection: view logs failed', err.message); }
  };

  const handleClearLogs = async () => {
    try {
      await window.electronAPI?.logsClear?.();
      setLogsContent('');
      logInfo('settings', 'useLogsSection: logs cleared');
    } catch (err) { logError('settings', 'useLogsSection: clear logs failed', err.message); }
  };

  const handleToggleLogs = async () => {
    try {
      const newValue = !settings?.logsEnabled;
      setSettings(prev => ({ ...prev, logsEnabled: newValue }));
      await window.electronAPI?.invoke?.('settings:update', { logsEnabled: newValue });
      logInfo('settings', `useLogsSection: logsEnabled = ${newValue}`);
    } catch (err) { logError('settings', 'useLogsSection: toggle logs failed', err.message); }
  };

  // ─── Event log handlers (ARCH_REQ-044) ──────────────────────────────────

  const handleToggleEventLog = async () => {
    try {
      const newValue = !settings?.eventLogEnabled;
      setSettings(prev => ({ ...prev, eventLogEnabled: newValue }));
      await window.electronAPI?.invoke?.('settings:update', { eventLogEnabled: newValue });
      window.dispatchEvent(new CustomEvent('mwm:settings-changed', { detail: { eventLogEnabled: newValue } }));
      logInfo('settings', `useLogsSection: eventLogEnabled = ${newValue}`);
    } catch (err) { logError('settings', 'useLogsSection: toggle event log failed', err.message); }
  };

  const handleViewEventLog = async () => {
    try {
      const res = await window.electronAPI?.invoke?.('events:getFile');
      if (res?.ok) { setEventsContent(res.data?.content || ''); setShowEventsModal(true); }
    } catch (err) { logError('settings', 'useLogsSection: view event log failed', err.message); }
  };

  const handleClearEventLog = async () => {
    try {
      await window.electronAPI?.invoke?.('events:clear');
      setEventsContent('');
      logInfo('settings', 'useLogsSection: event log cleared');
    } catch (err) { logError('settings', 'useLogsSection: clear event log failed', err.message); }
  };

  return {
    settings,
    logsContent,     showLogsModal,   setShowLogsModal,
    eventsContent,   showEventsModal, setShowEventsModal,
    handleOpenLogs,  handleViewLogs,  handleClearLogs,  handleToggleLogs,
    handleToggleEventLog, handleViewEventLog, handleClearEventLog,
  };
}
