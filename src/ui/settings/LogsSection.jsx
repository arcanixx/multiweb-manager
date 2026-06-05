// =============================================================================
// FILE: LogsSection.jsx
// PATH: src/ui/settings/LogsSection.jsx
// VERSION: 0.0.3
// PURPOSE: Sekcja zarządzania logami — logi testów (LogWriter) i dziennik zdarzeń aplikacji (EventLogger, ARCH_REQ-044).
// FUNCTIONS: LogsSection
// DEPENDS ON: react, translations.js, loggerRenderer.js, icons.js, Modal
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useEffect } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { logInfo, logError, logWarn } from '../../utils/loggerRenderer.js';
import { ICONS } from '../../utils/icons.js';
import Modal from '../modals/Modal';

// ─── LogsSection() – sekcja zarządzania logami testów i dziennika zdarzeń
// @returns {JSX.Element|null} – null gdy debugMode=false
export default function LogsSection() {
  const { t } = React.useContext(TranslationContext);
  const [settings,       setSettings]       = useState(null);
  const [logsContent,    setLogsContent]    = useState('');
  const [showLogsModal,  setShowLogsModal]  = useState(false);
  const [eventsContent,  setEventsContent]  = useState('');
  const [showEventsModal,setShowEventsModal]= useState(false);

  // ─── useEffect – ładowanie ustawień przy montowaniu
  useEffect(() => {
    const loadSettings = async () => {
      try {
        if (!window.electronAPI?.getSettings) {
          setSettings({ debugMode: false, logsEnabled: false, eventLogEnabled: false });
          return;
        }
        const result = await window.electronAPI.getSettings();
        if (result?.ok) {
          setSettings(result.data || {});
        } else {
          setSettings({ debugMode: false, logsEnabled: false, eventLogEnabled: false });
        }
      } catch (err) {
        logError('settings', 'LogsSection: failed to load settings', err.message);
        setSettings({ debugMode: false, logsEnabled: false, eventLogEnabled: false });
      }
    };
    loadSettings();
  }, []);

  if (!settings || settings.debugMode === false) return null;

  const logsEnabled     = settings.logsEnabled     || false;
  const eventLogEnabled = settings.eventLogEnabled || false;

  const handleOpenLogs = async () => {
    try {
      await window.electronAPI?.openLogsFolder?.();
      logInfo('settings', 'LogsSection: logs folder opened');
    } catch (err) {
      logError('settings', 'LogsSection: open logs folder failed', err.message);
    }
  };

  const handleViewLogs = async () => {
    try {
      const content = await window.electronAPI?.logsGet?.();
      if (content?.ok) {
        setLogsContent(content.data || '');
        setShowLogsModal(true);
      }
    } catch (err) {
      logError('settings', 'LogsSection: view logs failed', err.message);
    }
  };

  const handleClearLogs = async () => {
    try {
      await window.electronAPI?.logsClear?.();
      setLogsContent('');
      logInfo('settings', 'LogsSection: logs cleared');
    } catch (err) {
      logError('settings', 'LogsSection: clear logs failed', err.message);
    }
  };

  const handleToggleLogs = async () => {
    try {
      const newValue = !logsEnabled;
      setSettings(prev => ({ ...prev, logsEnabled: newValue }));
      await window.electronAPI?.invoke?.('settings:update', { logsEnabled: newValue });
      logInfo('settings', `LogsSection: logsEnabled = ${newValue}`);
    } catch (err) {
      logError('settings', 'LogsSection: toggle logs failed', err.message);
    }
  };

  // ─── Event log handlers (ARCH_REQ-044) ──────────────────────────────────

  const handleToggleEventLog = async () => {
    try {
      const newValue = !eventLogEnabled;
      setSettings(prev => ({ ...prev, eventLogEnabled: newValue }));
      await window.electronAPI?.invoke?.('settings:update', { eventLogEnabled: newValue });
      // Poinformuj eventLogger.js o zmianie (inwaliduje cache)
      window.dispatchEvent(new CustomEvent('mwm:settings-changed', { detail: { eventLogEnabled: newValue } }));
      logInfo('settings', `LogsSection: eventLogEnabled = ${newValue}`);
    } catch (err) {
      logError('settings', 'LogsSection: toggle event log failed', err.message);
    }
  };

  const handleViewEventLog = async () => {
    try {
      const res = await window.electronAPI?.invoke?.('events:getFile');
      if (res?.ok) {
        setEventsContent(res.data?.content || '');
        setShowEventsModal(true);
      }
    } catch (err) {
      logError('settings', 'LogsSection: view event log failed', err.message);
    }
  };

  const handleClearEventLog = async () => {
    try {
      await window.electronAPI?.invoke?.('events:clear');
      setEventsContent('');
      logInfo('settings', 'LogsSection: event log cleared');
    } catch (err) {
      logError('settings', 'LogsSection: clear event log failed', err.message);
    }
  };

  return (
    <>
      {/* ── Logi testów ─────────────────────────────────────────────────── */}
      <section className="settings-section">
        <h3>{ICONS.LOGS} {t('settings.logs')}</h3>

        <div className="settings-actions-row">
          <button onClick={handleOpenLogs}  className="btn-secondary">{ICONS.FOLDER} {t('settings.openLogs')}</button>
          <button onClick={handleViewLogs}  className="btn-secondary">{ICONS.VIEW}   {t('settings.viewLogs')}</button>
          <button onClick={handleClearLogs} className="btn-secondary">{ICONS.CLEAR}  {t('settings.clearLogs')}</button>
        </div>

        <div className="form-group toggle-row">
          <label className="toggle-label">
            <input type="checkbox" checked={logsEnabled} onChange={handleToggleLogs} />
            {ICONS.LOGS} {t('settings.allowLogs')}
          </label>
          <span className="form-hint">{t('settings.allowLogsDesc')}</span>
        </div>
      </section>

      {/* ── Dziennik zdarzeń (ARCH_REQ-044) ─────────────────────────────── */}
      <section className="settings-section">
        <h3>{ICONS.INFO} {t('settings.eventLog')}</h3>

        <div className="form-group toggle-row">
          <label className="toggle-label">
            <input type="checkbox" checked={eventLogEnabled} onChange={handleToggleEventLog} />
            {ICONS.INFO} {t('settings.eventLogEnabled')}
          </label>
          <span className="form-hint">{t('settings.eventLogEnabledDesc')}</span>
        </div>

        {eventLogEnabled && (
          <div className="settings-actions-row">
            <button onClick={handleViewEventLog}  className="btn-secondary">{ICONS.VIEW}  {t('settings.viewEventLog')}</button>
            <button onClick={handleClearEventLog} className="btn-secondary">{ICONS.CLEAR} {t('settings.clearEventLog')}</button>
          </div>
        )}
      </section>

      {/* Modał podglądu logów testów */}
      <Modal isOpen={showLogsModal} onClose={() => setShowLogsModal(false)} title={t('settings.failLogs')}>
        <pre className="logs-preview">{logsContent || t('settings.noLogs')}</pre>
      </Modal>

      {/* Modał podglądu dziennika zdarzeń */}
      <Modal isOpen={showEventsModal} onClose={() => setShowEventsModal(false)} title={t('settings.eventLog')}>
        <pre className="logs-preview">{eventsContent || t('settings.noLogs')}</pre>
      </Modal>
    </>
  );
}

import React, { useState, useEffect } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { logInfo, logError, logWarn } from '../../utils/loggerRenderer.js';
import { ICONS } from '../../utils/icons.js';
import Modal from '../modals/Modal';

// ─── LogsSection() – sekcja zarządzania logami testów i aplikacji
// @returns {JSX.Element|null} – renderowana sekcja logów (null gdy debugMode=false)
export default function LogsSection() {
  const { t } = React.useContext(TranslationContext);
  const [settings, setSettings] = useState(null);
  const [logsContent, setLogsContent] = useState('');
  const [showLogsModal, setShowLogsModal] = useState(false);

  // ─── useEffect – ładowanie ustawień przy montowaniu
  useEffect(() => {
    const loadSettings = async () => {
      try {
        if (!window.electronAPI?.getSettings) {
          setSettings({ debugMode: false, logsEnabled: false });
          return;
        }
        const result = await window.electronAPI.getSettings();
        if (result?.ok) {
          setSettings(result.data || {});
        } else {
          setSettings({ debugMode: false, logsEnabled: false });
        }
      } catch (err) {
        logError('settings', 'LogsSection: failed to load settings', err.message);
        setSettings({ debugMode: false, logsEnabled: false });
      }
    };
    loadSettings();
  }, []);

  if (!settings || settings.debugMode === false) return null;

  const logsEnabled = settings.logsEnabled || false;

  // ─── handleOpenLogs() – otwiera folder z logami
  const handleOpenLogs = async () => {
    try {
      if (window.electronAPI?.openLogsFolder) {
        await window.electronAPI.openLogsFolder();
        logInfo('settings', 'LogsSection: logs folder opened');
      }
    } catch (err) {
      logError('settings', 'LogsSection: open logs folder failed', err.message);
      logWarn('settings', 'Wystąpił błąd podczas otwierania folderu z logami');
    }
  };

  // ─── handleViewLogs() – wyświetla zawartość pliku z logami
  const handleViewLogs = async () => {
    try {
      const content = await window.electronAPI?.logsGet?.();
      if (content?.ok) {
        setLogsContent(content.data || '');
        setShowLogsModal(true);
        logInfo('settings', 'LogsSection: logs viewed');
      } else {
        logError('settings', 'LogsSection: view logs failed', content?.error);
        logWarn('settings', 'Nie można wyświetlić logów');
      }
    } catch (err) {
      logError('settings', 'LogsSection: view logs failed', err.message);
      logWarn('settings', 'Wystąpił błąd podczas wyświetlania logów');
    }
  };

  // ─── handleClearLogs() – czyści plik z logami
  const handleClearLogs = async () => {
    try {
      await window.electronAPI?.logsClear?.();
      setLogsContent('');
      logInfo('settings', 'LogsSection: logs cleared');
    } catch (err) {
      logError('settings', 'LogsSection: clear logs failed', err.message);
      logWarn('settings', 'Wystąpił błąd podczas czyszczenia logów');
    }
  };

  // ─── handleToggleLogs() – przełącza włączanie logów
  const handleToggleLogs = async () => {
    try {
      const newValue = !logsEnabled;
      setSettings(prev => ({ ...prev, logsEnabled: newValue }));
      await window.electronAPI?.invoke?.('settings:update', { logsEnabled: newValue });
      logInfo('settings', `LogsSection: logs ${newValue ? 'enabled' : 'disabled'}`);
    } catch (err) {
      logError('settings', 'LogsSection: toggle logs failed', err.message);
      logWarn('settings', 'Wystąpił błąd podczas przełączania logów');
    }
  };

  return (
    <>
      <section className="settings-section">
        <h3>{ICONS.LOGS} {t('settings.logs')}</h3>

        <div className="settings-actions-row">
          <button onClick={handleOpenLogs} className="btn-secondary">
            {ICONS.FOLDER} {t('settings.openLogs')}
          </button>
          <button onClick={handleViewLogs} className="btn-secondary">
            {ICONS.VIEW} {t('settings.viewLogs')}
          </button>
          <button onClick={handleClearLogs} className="btn-secondary">
            {ICONS.CLEAR} {t('settings.clearLogs')}
          </button>
        </div>

        <div className="form-group toggle-row">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={logsEnabled}
              onChange={handleToggleLogs}
            />
            {ICONS.LOGS} {t('settings.allowLogs')}
          </label>
          <span className="form-hint">{t('settings.allowLogsDesc')}</span>
        </div>
      </section>

      {/* Modal podglądu logów */}
      <Modal isOpen={showLogsModal} onClose={() => setShowLogsModal(false)} title={t('settings.failLogs')}>
        <pre className="logs-preview">{logsContent || t('settings.noLogs')}</pre>
      </Modal>
    </>
  );
}