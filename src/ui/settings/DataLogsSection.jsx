// =============================================================================
// FILE: DataLogsSection.jsx
// PATH: src/ui/settings/DataLogsSection.jsx
// VERSION: 0.0.3
// PURPOSE: Sekcja danych i logów (eksport/import, otwieranie folderu logów, logi testów)
// FUNCTIONS: DataLogsSection
// DEPENDS ON: react, config.js, translations.js, loggerRenderer, icons, ConfirmModal, Modal
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useEffect } from 'react';
import { isFeatureEnabled } from '../../config.js';
import { TranslationContext } from '../utils/translations.js';
import { logDebug, logInfo, logError, logWarn } from '../../utils/loggerRenderer';
import { ICONS } from '../../utils/icons';
import ConfirmModal from '../modals/ConfirmModal';
import Modal from '../modals/Modal';

// ─── DataLogsSection() – sekcja zarządzania danymi i logami z eksportem/importem
//   @returns {JSX.Element} – renderowana sekcja danych i logów
export default function DataLogsSection() {
  const { t } = React.useContext(TranslationContext);
  const [confirmState, setConfirmState] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  const [logsContent, setLogsContent] = useState('');
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [logsEnabled, setLogsEnabled] = useState(false);

  // ─── useEffect – ładowanie ustawień przy montowaniu
  useEffect(() => {
    // ─── loadSettings() – ładuję ustawienia (debugMode, logsEnabled) z IPC
    const loadSettings = async () => {
      try {
        let settings = {};
        if (window.electronAPI?.invoke) {
          const res = await window.electronAPI.invoke('settings:get');
          if (res?.ok) settings = res.data || {};
        }
        setDebugMode(settings.debugMode === true);
        setLogsEnabled(settings.logsEnabled === true);
        logInfo('settings', 'DataLogsSection: settings loaded');
      } catch (err) {
        logError('settings', 'DataLogsSection: failed to load settings', err);
        logWarn('settings', 'Nie można załadować ustawień');
      }
    };
    loadSettings();
  }, []);

  // ─── showConfirm() – wyświetla modal potwierdzenia
  //   @param {string} title – tytuł modala
  //   @param {string} message – treść komunikatu
  //   @param {Function} onConfirm – callback potwierdzenia
  //   @returns {void}
  const showConfirm = (title, message, onConfirm) => {
    try {
      logInfo('settings', 'DataLogsSection: showing confirm modal');
      setConfirmState({ isOpen: true, title, message, onConfirm });
    } catch (err) {
      logError('settings', 'DataLogsSection: show confirm failed', err);
      logWarn('settings', 'Wystąpił błąd podczas wyświetlania modala potwierdzenia');
    }
  };

  // ─── handleExportSettings() – eksportuje ustawienia do pliku
  //   @returns {Promise<void>}
  const handleExportSettings = async () => {
    try {
      if (window.electronAPI?.exportSettings) {
        const result = await window.electronAPI.exportSettings();
        if (result.ok) {
          logDebug('settings', 'Settings exported successfully');
          logInfo('settings', 'DataLogsSection: settings exported successfully');
        } else {
          logError('settings', 'DataLogsSection: export failed', result.error);
          logWarn('settings', 'Nie można wyeksportować ustawień');
        }
      }
    } catch (err) {
      logError('settings', 'DataLogsSection: export failed', err);
      logWarn('settings', 'Wystąpił błąd podczas eksportu ustawień');
    }
  };

  // ─── handleImportSettings() – importuje ustawienia z pliku
  //   @returns {Promise<void>}
  const handleImportSettings = async () => {
    try {
      if (window.electronAPI?.importSettings) {
        const result = await window.electronAPI.importSettings();
        if (result.ok) {
          logDebug('settings', 'Settings imported successfully');
          logInfo('settings', 'DataLogsSection: settings imported successfully');
          setTimeout(() => window.location.reload(), 1000);
        } else {
          logError('settings', 'DataLogsSection: import failed', result.error);
          logWarn('settings', 'Nie można zaimportować ustawień');
        }
      }
    } catch (err) {
      logError('settings', 'DataLogsSection: import failed', err);
      logWarn('settings', 'Wystąpił błąd podczas importu ustawień');
    }
  };

  // ─── handleOpenLogs() – otwiera folder z logami
  //   @returns {Promise<void>}
  const handleOpenLogs = async () => {
    try {
      if (window.electronAPI?.openLogsFolder) {
        await window.electronAPI.openLogsFolder();
        logDebug('settings', 'Logs folder opened');
        logInfo('settings', 'DataLogsSection: logs folder opened');
      }
    } catch (err) {
      logError('settings', 'DataLogsSection: open logs folder failed', err);
      logWarn('settings', 'Wystąpił błąd podczas otwierania folderu z logami');
    }
  };

  // ─── handleResetAll() – resetuje wszystkie ustawienia po potwierdzeniu
  //   @returns {void}
  const handleResetAll = () => {
    showConfirm(
      t('settings.resetConfirmTitle'),
      t('settings.resetConfirmMessage'),
      async () => {
        try {
          // localStorage.clear() usuwało tylko dane renderer scratch, nie settingsStore.
          // Reset danych aplikacji odbywa się wyłącznie przez IPC settings:reset.
          if (window.electronAPI?.resetSettings) {
            await window.electronAPI.resetSettings();
          }
          logInfo('settings', 'DataLogsSection: all settings reset');
          window.location.reload();
        } catch (err) {
          logError('settings', 'DataLogsSection: reset failed', err);
          logWarn('settings', 'Wystąpił błąd podczas resetowania ustawień');
        }
      }
    );
  };

  // ─── handleViewLogs() – wyświetla zawartość pliku z logami
  //   @returns {Promise<void>}
  const handleViewLogs = async () => {
    try {
      const content = await window.electronAPI?.getLogsFile?.();
      if (content?.ok) {
        setLogsContent(content.data || '');
        setShowLogsModal(true);
        logInfo('settings', 'DataLogsSection: logs viewed');
      } else {
        logError('settings', 'DataLogsSection: view logs failed', content?.error);
        logWarn('settings', 'Nie można wyświetlić logów');
      }
    } catch (err) {
      logError('settings', 'DataLogsSection: view logs failed', err);
      logWarn('settings', 'Wystąpił błąd podczas wyświetlania logów');
    }
  };

  // ─── handleClearLogs() – czyści plik z logami
  //   @returns {Promise<void>}
  const handleClearLogs = async () => {
    try {
      await window.electronAPI?.clearLogsFile?.();
      setLogsContent('');
      logInfo('settings', 'DataLogsSection: logs cleared');
    } catch (err) {
      logError('settings', 'DataLogsSection: clear logs failed', err);
      logWarn('settings', 'Wystąpił błąd podczas czyszczenia logów');
    }
  };

  // ─── handleToggleLogs() – przełącza włączanie logów
  //   @returns {Promise<void>}
  const handleToggleLogs = async () => {
    try {
      const newValue = !logsEnabled;
      setLogsEnabled(newValue);
      await window.electronAPI?.invoke?.('settings:update', { logsEnabled: newValue });
      logInfo('settings', `DataLogsSection: logs ${newValue ? 'enabled' : 'disabled'}`);
    } catch (err) {
      logError('settings', 'DataLogsSection: toggle logs failed', err);
      logWarn('settings', 'Wystąpił błąd podczas przełączania logów');
    }
  };

  return (
    <section className="settings-section">
      <h2>{ICONS.DATA} {t('settings.dataAndLogs')}</h2>

      {/* Zawsze widoczne przyciski eksport/import/logi/reset */}
      <div className="setting-item">
        {isFeatureEnabled('exportImport') && (
          <button onClick={handleExportSettings}>{ICONS.EXPORT} {t('settings.exportSettings')}</button>
        )}
        {isFeatureEnabled('exportImport') && (
          <button onClick={handleImportSettings}>{ICONS.IMPORT} {t('settings.importSettings')}</button>
        )}
      </div>

      <div className="setting-item">
        {isFeatureEnabled('logsAccess') && (
          <button onClick={handleOpenLogs}>{ICONS.FOLDER} {t('settings.openLogsFolder')}</button>
        )}
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