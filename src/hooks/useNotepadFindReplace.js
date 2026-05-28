// =============================================================================
// FILE: useNotepadFindReplace.js
// PATH: src/hooks/useNotepadFindReplace.js
// VERSION: 0.0.3
// PURPOSE: Hook logiki znajdź/zastąp dla notatnika
// FUNCTIONS: useNotepadFindReplace
// DEPENDS ON: react, translations.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useState, useCallback, useContext } from 'react';
import { TranslationContext } from '../utils/translations.js';
export function useNotepadFindReplace({ contentRef, textareaRef, setContent, setDirty, showToast }) {
  const { t } = useContext(TranslationContext);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [findCount, setFindCount] = useState(0);
  // Liczy wystąpienia i ustawia kursor na pierwsze trafienie
  const handleFind = useCallback(() => {
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
    }
  }, [findText, contentRef, textareaRef]);
  // Zastępuje wszystkie wystąpienia szukanego tekstu
  const handleReplace = useCallback(() => {
    if (!findText.trim()) return;
    const escaped = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'gi');
    const replaced = contentRef.current.replace(regex, replaceText);
    setContent(replaced);
    setDirty(true);
    setFindCount(0);
    showToast(t('notepad.replaced'));
  }, [findText, replaceText, contentRef, setContent, setDirty, showToast, t]);
  return {
    findText, setFindText,
    replaceText, setReplaceText,
    findCount,
    handleFind,
    handleReplace,
  };
}