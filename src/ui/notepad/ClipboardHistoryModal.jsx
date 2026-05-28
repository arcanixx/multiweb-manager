// =============================================================================
// FILE: ClipboardHistoryModal.jsx
// PATH: src/ui/notepad/ClipboardHistoryModal.jsx
// VERSION: 0.0.3
// PURPOSE: Modal historii schowka – integracja z clipboardStore, i18n
// FUNCTIONS: ClipboardHistoryModal
// DEPENDS ON: react, translations.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useEffect, useState, useContext } from "react";
import { TranslationContext } from '../../utils/translations.js';
export default function ClipboardHistoryModal({ onClose }) {
  const { t } = useContext(TranslationContext);
  const [history, setHistory] = useState([]);
  useEffect(() => {
    const h = window.electronAPI.getClipboardHistory();
    setHistory(h);
  }, []);
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>{t("clipboard.title")}</h2>
        {history.length === 0 && (
          <div className="clipboard-empty">{t("clipboard.empty")}</div>
        )}
        {history.map(item => (
          <div key={item.id} className="clipboard-item">
            <pre>{item.text}</pre>
          </div>
        ))}
        <button className="btn btn-secondary" onClick={onClose}>
          {t("clipboard.close")}
        </button>
      </div>
    </div>
  );
}

