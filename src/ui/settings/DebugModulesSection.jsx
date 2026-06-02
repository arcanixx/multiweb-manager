// =============================================================================
// FILE: DebugModulesSection.jsx
// PATH: src/ui/settings/DebugModulesSection.jsx
// VERSION: 0.0.3
// PURPOSE: UI do zarządzania filtrowaniem logów per-moduł. Widoczna tylko w trybie debugMode.
// FUNCTIONS: DebugModulesSection
// DEPENDS ON: react, config.js, translations.js, loggerRenderer.js, icons.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useEffect, useState } from 'react';
import { DEBUG_MODULES } from '../../config.js';
import { TranslationContext } from '../../utils/translations.js';
import { logInfo, logError, logWarn, setDebugModule } from '../../utils/loggerRenderer.js';
import { ICONS } from '../../utils/icons.js';

const MODULE_LABEL_KEYS = {
  webview: 'settings.debugModules.webview',
  terminal: 'settings.debugModules.terminal',
  tasks: 'settings.debugModules.tasks',
  tools: 'settings.debugModules.tools',
  settings: 'settings.debugModules.settings',
  engine: 'settings.debugModules.engine',
  store: 'settings.debugModules.store',
  ipc: 'settings.debugModules.ipc',
  ui: 'settings.debugModules.ui',
};

const MODULE_ORDER = Object.keys(DEBUG_MODULES);

// ─── DebugModulesSection() – sekcja per-modułowych przełączników logowania
//   Pokazywana wyłącznie gdy settings.debugMode === true
//   @returns {JSX.Element|null} – renderowana sekcja debug-modułów albo null
export default function DebugModulesSection() {
  const { t } = React.useContext(TranslationContext);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        if (!window.electronAPI?.getSettings) {
          setSettings({ debugMode: false, debugModules: { ...DEBUG_MODULES } });
          return;
        }
        const result = await window.electronAPI.getSettings();
        if (result?.ok) {
          setSettings(result.data || {});
          logInfo('settings', 'DebugModulesSection: settings loaded');
        } else {
          setSettings({ debugMode: false, debugModules: { ...DEBUG_MODULES } });
          logWarn('settings', 'DebugModulesSection: failed to load settings');
        }
      } catch (err) {
        logError('settings', 'DebugModulesSection: failed to load settings', err);
        setSettings({ debugMode: false, debugModules: { ...DEBUG_MODULES } });
      }
    };

    loadSettings();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sekcja nie powinna być widoczna, jeśli globalny debugMode jest wyłączony
  if (!settings || settings.debugMode === false) return null;

  const currentModules = {
    ...DEBUG_MODULES,
    ...(settings.debugModules || {})
  };

  const handleToggle = async (moduleName, enabled) => {
    try {
      setSettings((prev) => ({
        ...(prev || {}),
        debugModules: {
          ...(prev?.debugModules || {}),
          [moduleName]: enabled
        }
      }));

      // Natychmiastowa aktualizacja lokalnego loggera w rendererze
      setDebugModule(moduleName, enabled);

      if (window.electronAPI?.setDebugModule) {
        await window.electronAPI.setDebugModule(moduleName, enabled);
      } else if (window.electronAPI?.saveSettings) {
        await window.electronAPI.saveSettings({
          debugModules: { [moduleName]: enabled }
        });
      }

      logInfo('settings', `DebugModulesSection: module ${moduleName} set to ${enabled}`);
    } catch (err) {
      logError('settings', 'DebugModulesSection: toggle failed', err);
    }
  };

  return (
    <section className="settings-section">
      <h2>{ICONS.DEBUG} {t('settings.debugModulesTitle')}</h2>
      <p className="section-description">{t('settings.debugModulesDesc')}</p>

      <div className="debug-modules-grid">
        {MODULE_ORDER.map((moduleName) => (
          <label key={moduleName} className="setting-item">
            <input
              type="checkbox"
              checked={currentModules[moduleName] !== false}
              onChange={(e) => handleToggle(moduleName, e.target.checked)}
            />
            <span>{t(MODULE_LABEL_KEYS[moduleName])}</span>
          </label>
        ))}
      </div>
    </section>
  );
}