// =============================================================================
// FILE: Notepad.jsx
// PATH: src/ui/notepad/Notepad.jsx
// VERSION: 0.0.3
// PURPOSE: Notatnik – zapis, edycja, historia schowka, i18n
//          - save()              zapisuje notatkę przez IPC (notes:add) i pokazuje toast
//          - pasteFromClipboard() wkleja tekst ze schowka do edytora
//          - setShowHistory(true) otwiera ClipboardHistoryModal
// =============================================================================

import React, { useState } from "react";
import { t } from "../../locales/locale.js";
import ClipboardHistoryModal from "./ClipboardHistoryModal.jsx";

export default function Notepad() {
  const [text, setText] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  async function save() {
    await window.electronAPI.invoke("notes:add", {
      id: Date.now(),
      content: text
    });
    window.showToast("success", t("notepad.saved"));
  }

  function pasteFromClipboard() {
    const value = window.electronAPI.readClipboard();
    setText(text + value);
  }

  return (
    <div className="notepad">
      <h2>{t("notepad.title")}</h2>
      <textarea
        className="notepad-textarea"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <div className="notepad-actions">
        <button className="btn btn-secondary" onClick={() => setShowHistory(true)}>
          {t("notepad.clipboardHistory")}
        </button>
        <button className="btn btn-secondary" onClick={pasteFromClipboard}>
          {t("notepad.paste")}
        </button>
        <button className="btn btn-primary" onClick={save}>
          {t("notepad.save")}
        </button>
      </div>
      {showHistory && (
        <ClipboardHistoryModal onClose={() => setShowHistory(false)} />
      )}
    </div>
  );
}

// =============================================================================
// END OF FILE
// =============================================================================
