// =============================================================================
// FILE: ClipboardHistoryModal.jsx
// PATH: src/ui/notepad/ClipboardHistoryModal.jsx
// VERSION: 0.0.3
// PURPOSE: Okno modalne prezentujące listę historycznych wpisów ze schowka systemowego – umożliwia przeglądanie i odzyskiwanie skopiowanych wcześniej fragmentów tekstu.
// FUNCTIONS: ClipboardHistoryModal
// DEPENDS ON: react, translations.js, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useEffect, useState, useContext } from "react";
import { TranslationContext } from '../../utils/translations.js';
import { logInfo, logError, logWarn } from '../../utils/loggerRenderer.js';

// ─── ClipboardHistoryModal() – modal wyświetlający historię schowka
//   @param {Object} props – właściwości komponentu
//   @param {Function} props.onClose – callback zamknięcia modala
//   @returns {JSX.Element} – renderowany modal historii schowka
export default function ClipboardHistoryModal({ onClose }) {
  const { t } = useContext(TranslationContext);
  const [history, setHistory] = useState([]);

  // ─── useEffect – ładowanie historii schowka przy montowaniu
  useEffect(() => {
    try {
      window.electronAPI.invoke('clipboard:getHistory').then(res => {
        if (res?.ok) {
          setHistory(res.data);
          logInfo('ui', `ClipboardHistoryModal: loaded ${res.data.length} items`);
        }
      }).catch(err => logError('ui', 'ClipboardHistoryModal: IPC call failed', err.message));
    } catch (err) {
      logError('ui', 'ClipboardHistoryModal: failed to load clipboard history', err.message);
      logWarn('ui', 'Nie można załadować historii schowka');
      setHistory([]);
    }
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