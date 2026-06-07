// =============================================================================
// FILE: LogsSection.jsx
// PATH: src/ui/settings/LogsSection.jsx
// VERSION: 0.0.3
// PURPOSE: Widok sekcji zarządzania logami – logi testów i dziennik zdarzeń. Logika w useLogsSection.
// FUNCTIONS: LogsSection
// DEPENDS ON: react, translations.js, icons.js, Modal, useLogsSection.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
import Modal from '../modals/Modal';
import { useLogsSection } from '../../hooks/settings/useLogsSection.js';

// ─── LogsSection() – sekcja zarządzania logami testów i dziennika zdarzeń
export default function LogsSection() {
  const { t } = useContext(TranslationContext);
  const {
    settings,
    logsContent,     showLogsModal,   setShowLogsModal,
    eventsContent,   showEventsModal, setShowEventsModal,
    handleOpenLogs,  handleViewLogs,  handleClearLogs,  handleToggleLogs,
    handleToggleEventLog, handleViewEventLog, handleClearEventLog,
  } = useLogsSection();

  if (!settings || settings.debugMode === false) return null;

  const logsEnabled     = settings.logsEnabled     || false;
  const eventLogEnabled = settings.eventLogEnabled || false;

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

      <Modal isOpen={showLogsModal}   onClose={() => setShowLogsModal(false)}   title={t('settings.failLogs')}>
        <pre className="logs-preview">{logsContent  || t('settings.noLogs')}</pre>
      </Modal>
      <Modal isOpen={showEventsModal} onClose={() => setShowEventsModal(false)} title={t('settings.eventLog')}>
        <pre className="logs-preview">{eventsContent || t('settings.noLogs')}</pre>
      </Modal>
    </>
  );
}
