// =============================================================================
// FILE: NotepadTabs.jsx
// PATH: src/ui/notepad/NotepadTabs.jsx
// VERSION: 0.0.3
// PURPOSE: Komponent zarządzający paskiem kart notatnika – obsługuje przełączanie dokumentów, ich zamykanie, zmianę nazwy oraz wizualizację stanu 'dirty'.
// FUNCTIONS: NotepadTabs
// DEPENDS ON: react, translations.js, loggerRenderer.js, icons.js, PromptModal.jsx
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { logInfo, logError } from '../../utils/loggerRenderer.js';
import { ICONS } from '../../utils/icons.js';
import PromptModal from '../modals/PromptModal.jsx';

export default function NotepadTabs({ tabs, activeTabId, onTabSelect, onTabClose, onTabRename, onNewTab }) {
  const { t } = useContext(TranslationContext);
  const [showRenamePrompt, setShowRenamePrompt] = React.useState(false);
  const [renameTabId, setRenameTabId] = React.useState(null);
  const [currentTabName, setCurrentTabName] = React.useState('');

  // ─── handleRenameClick() – Otwiera modal zmiany nazwy zakładki, zapisując ID i aktualną nazwę wybranej zakładki w stanie komponentu
  const handleRenameClick = (tabId, currentName) => {
    setRenameTabId(tabId);
    setCurrentTabName(currentName);
    setShowRenamePrompt(true);
  };

  // ─── handleRenameConfirm() – Zatwierdza zmianę nazwy zakładki: weryfikuje, czy nowa nazwa nie jest pusta, wywołuje callback onTabRename i zamyka modal
  const handleRenameConfirm = (newName) => {
    try {
      if (newName && newName.trim() && renameTabId) {
        onTabRename(renameTabId, newName.trim());
        logInfo('ui', `NotepadTabs: renamed tab ${renameTabId} to ${newName}`);
      }
      setShowRenamePrompt(false);
      setRenameTabId(null);
    } catch (err) {
      logError('ui', 'NotepadTabs: handleRenameConfirm failed', err.message);
      setShowRenamePrompt(false);
    }
  };

  return (
    <>
      <div className="notepad-tabs">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`notepad-tab ${activeTabId === tab.id ? 'active' : ''}`}
            onClick={() => onTabSelect(tab.id)}
          >
            <span className="tab-name" onDoubleClick={() => handleRenameClick(tab.id, tab.name)}>
              {tab.name}
              {tab.isDirty && <span className="dirty-indicator">●</span>}
            </span>
            <button
              className="tab-close"
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(tab.id);
              }}
            >
              {ICONS.CLOSE}
            </button>
          </div>
        ))}
        <button className="new-tab-btn" onClick={onNewTab} title={t('notepad.new_tab')}>
          {ICONS.ADD}
        </button>
      </div>

      <PromptModal
        isOpen={showRenamePrompt}
        title={t('notepad.tab_rename')}
        message={t('notepad.enter_new_tab_name')}
        defaultValue={currentTabName}
        placeholder={t('notepad.tab_name_placeholder')}
        onConfirm={handleRenameConfirm}
        onCancel={() => {
          setShowRenamePrompt(false);
          setRenameTabId(null);
        }}
      />
    </>
  );
}