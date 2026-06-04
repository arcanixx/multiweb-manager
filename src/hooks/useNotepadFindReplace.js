// =============================================================================
// FILE: useNotepadFindReplace.js
// PATH: src/hooks/useNotepadFindReplace.js
// VERSION: 0.0.3
// PURPOSE: Hook React obsługujący logikę wyszukiwania i zastępowania tekstu w edytorze notatnika.
// FUNCTIONS: useNotepadFindReplace
// DEPENDS ON: react, translations.js, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useState, useCallback, useContext } from 'react';
import { TranslationContext } from '../utils/translations.js';
import { logInfo, logError, logWarn } from "../utils/loggerRenderer.js";
import { showToast } from '../utils/notificationsManager.js';

// ─── useNotepadFindReplace() – hook do funkcjonalności znajdź/zastąp w notatniku
//   @param {Object} props – obiekt z referencjami i funkcjami
//   @param {Object} props.contentRef – referencja do treści notatnika
//   @param {Object} props.textareaRef – referencja do elementu textarea
//   @param {Function} props.setContent – funkcja ustawiająca treść
//   @param {Function} props.setDirty – funkcja ustawiająca flagę zmian
//   @returns {Object} – obiekt z stanem i funkcjami wyszukiwania
export function useNotepadFindReplace({ contentRef, textareaRef, setContent, setDirty }) {
  const { t } = useContext(TranslationContext);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [findCount, setFindCount] = useState(0);
  
  // ─── handleFind() – wyszukuje tekst i ustawia kursor na pierwsze trafienie
  //   @returns {void}
  const handleFind = useCallback(() => {
    try {
      if (!findText.trim()) {
        setFindCount(0);
        return;
      }
      const text = contentRef.current;
      const escaped = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'gi');
      const matches = [...text.matchAll(regex)];
      setFindCount(matches.length);
      // Przewiń textarea do pierwszego wystąpienia
      if (matches.length > 0 && textareaRef.current) {
        const ta = textareaRef.current;
        ta.focus();
        ta.setSelectionRange(matches[0].index, matches[0].index + findText.length);
        logInfo("ui", "useNotepadFindReplace.handleFind success", { count: matches.length });
      }
    } catch (err) {
      logError("ui", "useNotepadFindReplace.handleFind failed", err.message);
      logWarn("ui", "Wystąpił błąd podczas wyszukiwania tekstu");
    }
  }, [findText, contentRef, textareaRef]);

  

  // ─── handleReplace() – zastępuje wszystkie wystąpienia szukanego tekstu
  //   @returns {void}
  const handleReplace = useCallback(() => {
    try {
      if (!findText.trim()) return;
      const escaped = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'gi');
      const replaced = contentRef.current.replace(regex, replaceText);
      setContent(replaced);
      setDirty(true);
      setFindCount(0);
      showToast('success', t('notepad.replaced'));
      logInfo("ui", "useNotepadFindReplace.handleReplace success", { from: findText, to: replaceText });
    } catch (err) {
      logError("ui", "useNotepadFindReplace.handleReplace failed", err.message);
      logWarn("ui", "Wystąpił błąd podczas zastępowania tekstu");
    }
  }, [findText, replaceText, contentRef, setContent, setDirty, t]);

  return {
    findText, setFindText,
    replaceText, setReplaceText,
    findCount,
    handleFind,
    handleReplace,
  };
}
