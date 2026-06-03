// =============================================================================
// FILE: DataManagementSection.jsx
// PATH: src/ui/settings/DataManagementSection.jsx
// VERSION: 0.0.3
// PURPOSE: Sekcja zarządzania danymi aplikacji – eksport, import i reset ustawień.
// FUNCTIONS: DataManagementSection
// DEPENDS ON: react, translations.js, loggerRenderer.js, icons.js, ConfirmModal
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { logInfo, logError, logWarn } from '../../utils/loggerRenderer.js';
import { ICONS } from '../../utils/icons.js';
import ConfirmModal from '../modals/ConfirmModal';

// ─── DataManagementSection() – sekcja eksportu/importu/resetu danych
// @returns {JSX.Element} – renderowana sekcja zarządzania danymi
export default function DataManagementSection() {
  const { t } = React.useContext(TranslationContext);
  const [confirmState, setConfirmState] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  // ─── handleExportSettings() – eksportuje ustawienia do pliku
  const handleExportSettings = async () => {
    try {
      if (window.electronAPI?.exportSettings) {
        const result = await window.electronAPI.exportSettings();
        if (result.ok) {
          logInfo('settings', 'DataManagementSection: settings exported successfully');
        } else {
          logError('settings', 'DataManagementSection: export failed', result.error);
          logWarn('settings', 'Nie można wyeksportować ustawień');
        }
      }
    } catch (err) {
      logError('settings', 'DataManagementSection: export failed', err.message);
      logWarn('settings', 'Wystąpił błąd podczas eksportu ustawień');
    }
  };

  // ─── handleImportSettings() – importuje ustawienia z pliku
  const handleImportSettings = async () => {
    try {
      if (window.electronAPI?.importSettings) {
        const result = await window.electronAPI.importSettings();
        if (result.ok) {
          logInfo('settings', 'DataManagementSection: settings imported successfully');
          setTimeout(() => window.location.reload(), 1000);
        } else {
          logError('settings', 'DataManagementSection: import failed', result.error);
          logWarn('settings', 'Nie można zaimportować ustawień');
        }
      }
    } catch (err) {
      logError('settings', 'DataManagementSection: import failed', err.message);
      logWarn('settings', 'Wystąpił błąd podczas importu ustawień');
    }
  };

  // ─── handleResetAll() – resetuje wszystkie ustawienia po potwierdzeniu
  const handleResetAll = () => {
    setConfirmState({
      isOpen: true,
      title: t('settings.resetConfirmTitle'),
      message: t('settings.resetConfirmMessage'),
      onConfirm: async () => {
        try {
          if (window.electronAPI?.resetSettings) {
            await window.electronAPI.resetSettings();
          }
          logInfo('settings', 'DataManagementSection: all settings reset');
          window.location.reload();
        } catch (err) {
          logError('settings', 'DataManagementSection: reset failed', err.message);
          logWarn('settings', 'Wystąpił błąd podczas resetowania ustawień');
        }
      }
    });
  };

  return (
    <>
      <section className="settings-section">
        <h2>{ICONS.DATA} {t('settings.dataAndLogs')}</h2>

        <div className="settings-actions-row">
          <button onClick={handleExportSettings} className="btn-secondary">
            {ICONS.EXPORT} {t('settings.export')}
          </button>
          <button onClick={handleImportSettings} className="btn-secondary">
            {ICONS.IMPORT} {t('settings.import')}
          </button>
          <button onClick={handleResetAll} className="btn-danger">
            {ICONS.RESET} {t('settings.resetAll')}
          </button>
        </div>
      </section>

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
    </>
  );
}