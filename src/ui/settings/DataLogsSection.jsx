// =============================================================================
// FILE: DataLogsSection.jsx
// PATH: src/ui/settings/DataLogsSection.jsx
// VERSION: 0.0.3
// PURPOSE: Sekcja danych i logów (eksport/import, otwieranie folderu logów, logi testów)
// FUNCTIONS: DataLogsSection
// DEPENDS ON: react, translations.js, loggerRenderer, icons, ConfirmModal, Modal
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useEffect } from 'react';
import { TranslationContext } from '../utils/translations.js';
import { logDebug } from '../../utils/loggerRenderer';
import { ICONS } from '../../utils/icons';
import ConfirmModal from '../modals/ConfirmModal';
import Modal from '../modals/Modal';
export default function DataLogsSection() {
  const { t } = React.useContext(TranslationContext);
  const [confirmState, setConfirmState] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  const [logsContent, setLogsContent] = useState('');
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [logsEnabled, setLogsEnabled] = useState(false);
  useEffect(() => {
    const loadSettings = async () => {
      const settings = await window.electronAPI?.getSettings?.() || {};
      setDebugMode(settings.debugMode === true);
      setLogsEnabled(settings.logsEnabled === true);
    };
    loadSettings();
  }, []);
  const showConfirm = (title, message, onConfirm) => {
    setConfirmState({ isOpen: true, title, message, onConfirm });
  };
  const handleExportSettings = async () => {
    if (window.electronAPI?.exportSettings) {
      const result = await window.electronAPI.exportSettings();
      if (result.ok) {
        logDebug('Settings exported successfully');
      }
    }
  };
  const handleImportSettings = async () => {
    if (window.electronAPI?.importSettings) {
      const result = await window.electronAPI.importSettings();
      if (result.ok) {
        logDebug('Settings imported successfully');
        setTimeout(() => window.location.reload(), 1000);
      }
    }
  };

  const handleOpenLogs = async () => {
    if (window.electronAPI?.openLogsFolder) {
      await window.electronAPI.openLogsFolder();
      logDebug('Logs folder opened');
    }
  };

  const handleResetAll = () => {
    showConfirm(
      t('settings.resetConfirmTitle'),
      t('settings.resetConfirmMessage'),
      async () => {
        localStorage.clear();
        if (window.electronAPI?.resetSettings) {
          await window.electronAPI.resetSettings();
        }
        window.location.reload();
      }
    );
  };

  const handleViewLogs = async () => {
    const content = await window.electronAPI?.getLogsFile?.();
    if (content?.ok) {
      setLogsContent(content.data || '');
      setShowLogsModal(true);
    }
  };

  const handleClearLogs = async () => {
    await window.electronAPI?.clearLogsFile?.();
    setLogsContent('');
  };

  const handleToggleLogs = async () => {
    const newValue = !logsEnabled;
    setLogsEnabled(newValue);
    await window.electronAPI?.saveSettings?.({ logsEnabled: newValue });
  };

  return (
    <section className="settings-section">
      <h2>{ICONS.DATA} {t('settings.dataAndLogs')}</h2>

      {/* Zawsze widoczne przyciski eksport/import/logi/reset */}
      <div className="setting-item">
        <button onClick={handleExportSettings}>{ICONS.EXPORT} {t('settings.exportSettings')}</button>
        <button onClick={handleImportSettings}>{ICONS.IMPORT} {t('settings.importSettings')}</button>
      </div>

      <div className="setting-item">
        <button onClick={handleOpenLogs}>{ICONS.FOLDER} {t('settings.openLogsFolder')}</button>
      </div>

      <div className="setting-item">
        <button className="btn-danger" onClick={handleResetAll}>{ICONS.WARNING} {t('settings.resetAll')}</button>
      </div>

      {/* Sekcja logów testów – tylko gdy debugMode = true */}
      {debugMode && (
        <>
          <div className="setting-item">
            <label>
              <input type="checkbox" checked={logsEnabled} onChange={handleToggleLogs} />
              {ICONS.LOGS} {t('settings.allowLogs')}
            </label>
            <span className="setting-description">{t('settings.allowLogsDesc')}</span>
          </div>

          {logsEnabled && (
            <div className="setting-item">
              <button onClick={handleViewLogs}>{ICONS.PREVIEW} {t('settings.viewLogs')}</button>
              <button onClick={handleClearLogs}>{ICONS.DELETE} {t('settings.clearLogs')}</button>
            </div>
          )}
        </>
      )}

      {/* Modal potwierdzenia resetu */}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        onConfirm={() => {
          confirmState.onConfirm?.();
          setConfirmState({ isOpen: false, title: '', message: '', onConfirm: null });
        }}
        onCancel={() => setConfirmState({ isOpen: false, title: '', message: '', onConfirm: null })}
      />

      {/* Modal podglądu logów */}
      <Modal isOpen={showLogsModal} onClose={() => setShowLogsModal(false)} title={t('settings.failLogs')}>
        <div style={{ maxHeight: '60vh', overflowY: 'auto', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
          {logsContent || t('settings.noLogs')}
        </div>
      </Modal>
    </section>
  );
}