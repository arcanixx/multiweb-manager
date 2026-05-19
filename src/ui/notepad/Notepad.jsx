// =============================================================================
// FILE: src/components/Notepad.jsx
// PATH: multiweb-manager/src/components/Notepad.jsx
// VERSION: v1
// PURPOSE: Wielozakładkowy edytor tekstu z autosave co 3s i crash recovery.
//          Dane zapisywane w electron-store – nawet niezapisane zmiany
//          przeżywają restart aplikacji (nie BDOS na dysku, ale na store).
//          Funkcje: wiele zakładek, zawijanie wierszy, znajdź/zastąp,
//          zapisz do pliku (Save As dialog).
// DEPENDS ON: icons.js, useTranslation.js, logger.js
// FUNCTIONS: addTab, closeTab, switchTab, saveCurrentTab, saveToFile,
//            handleFind, handleReplace, renameTab
// =============================================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ICONS } from '../../utils/icons';
import { useTranslation } from '../../hooks/useTranslation';
import { log } from '../../utils/logger';

// Generuje unikalny ID zakładki
const newId = () => Date.now().toString();

export default function Notepad() {
  const { t } = useTranslation();
  const [notes, setNotes]       = useState({ tabs: [], activeTab: null });
  const [content, setContent]   = useState('');
  const [wordWrap, setWordWrap] = useState(true);
  const [showFind, setShowFind] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [findCount, setFindCount]     = useState(0);
  const [toast, setToast]       = useState('');
  const [dirty, setDirty]       = useState(false);  // Niezapisane zmiany
  const textareaRef = useRef(null);
  const autosaveRef = useRef(null);
  const contentRef  = useRef(content);   // Ref dla aktualnej treści (closure fix)
  const notesRef    = useRef(notes);

  // Synchronizuj refy ze stanem
  useEffect(() => { contentRef.current = content; }, [content]);
  useEffect(() => { notesRef.current = notes; }, [notes]);

  // ----------------------------------------------------------------
  // Ładowanie notatek z electron-store przy starcie
  // Crash recovery: wszystkie treści są w store, przeżywają BDOS
  // ----------------------------------------------------------------
  useEffect(() => {
    window.electronAPI.getNotes().then(data => {
      const tabs = data.tabs?.length
        ? data.tabs
        : [{ id: newId(), title: t('notepad.new_tab'), content: '' }];
      const activeTab = data.activeTab || tabs[0].id;
      setNotes({ tabs, activeTab });
      const active = tabs.find(tab => tab.id === activeTab) || tabs[0];
      setContent(active?.content || '');
      log('Notepad: loaded, tabs:', tabs.length);
    });

    // Autosave co 3 sekundy – używa refów żeby mieć aktualny stan
    autosaveRef.current = setInterval(() => {
      const n = notesRef.current;
      if (!n.activeTab) return;
      const updatedTabs = n.tabs.map(tab =>
        tab.id === n.activeTab
          ? { ...tab, content: contentRef.current, lastSaved: new Date().toISOString() }
          : tab
      );
      const newNotes = { ...n, tabs: updatedTabs };
      window.electronAPI.saveNotes(newNotes);
      // Nie ustawiaj state tu – za często renderuje
    }, 3000);

    return () => clearInterval(autosaveRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ----------------------------------------------------------------
  // saveCurrentTab() – ręczny zapis aktywnej zakładki do store
  // ----------------------------------------------------------------
  const saveCurrentTab = useCallback((overrideContent) => {
    const currentContent = overrideContent !== undefined ? overrideContent : contentRef.current;
    const n = notesRef.current;
    if (!n.activeTab) return;
    const updatedTabs = n.tabs.map(tab =>
      tab.id === n.activeTab
        ? { ...tab, content: currentContent, lastSaved: new Date().toISOString() }
        : tab
    );
    const newNotes = { ...n, tabs: updatedTabs };
    setNotes(newNotes);
    notesRef.current = newNotes;
    window.electronAPI.saveNotes(newNotes);
    setDirty(false);
    log('Notepad: tab saved manually');
  }, []);

  // ----------------------------------------------------------------
  // addTab() – dodaje nową zakładkę i przełącza na nią
  // ----------------------------------------------------------------
  const addTab = () => {
    saveCurrentTab();
    const newTab = { id: newId(), title: t('notepad.new_tab'), content: '' };
    const newNotes = {
      tabs: [...notes.tabs, newTab],
      activeTab: newTab.id
    };
    setNotes(newNotes);
    setContent('');
    setDirty(false);
    window.electronAPI.saveNotes(newNotes);
    log('Notepad: new tab added');
  };

  // ----------------------------------------------------------------
  // switchTab() – zapisuje aktualną i przełącza na wybraną
  // ----------------------------------------------------------------
  const switchTab = (tabId) => {
    if (tabId === notes.activeTab) return;
    saveCurrentTab();
    const tab = notes.tabs.find(t => t.id === tabId);
    if (!tab) return;
    const newNotes = { ...notes, activeTab: tabId };
    setNotes(newNotes);
    setContent(tab.content || '');
    setDirty(false);
    log('Notepad: switched to tab:', tabId);
  };

  // ----------------------------------------------------------------
  // closeTab() – zamknięcie zakładki (minimum 1 musi zostać)
  // ----------------------------------------------------------------
  const closeTab = (tabId, e) => {
    e.stopPropagation();
    if (notes.tabs.length <= 1) return;
    const idx    = notes.tabs.findIndex(t => t.id === tabId);
    const newTabs = notes.tabs.filter(t => t.id !== tabId);
    const newActive = tabId === notes.activeTab
      ? (newTabs[idx] || newTabs[idx - 1] || newTabs[0])?.id
      : notes.activeTab;
    const newNotes = { tabs: newTabs, activeTab: newActive };
    setNotes(newNotes);
    const activeTab = newTabs.find(t => t.id === newActive);
    setContent(activeTab?.content || '');
    window.electronAPI.saveNotes(newNotes);
    log('Notepad: tab closed:', tabId);
  };

  // ----------------------------------------------------------------
  // renameTab() – zmiana nazwy zakładki (inline prompt, zastąpić modal)
  // ----------------------------------------------------------------
  const renameTab = (tabId) => {
    const tab = notes.tabs.find(t => t.id === tabId);
    const newName = window.prompt(t('notepad.tab_rename'), tab?.title || '');
    if (!newName?.trim()) return;
    const updatedTabs = notes.tabs.map(t =>
      t.id === tabId ? { ...t, title: newName.trim() } : t
    );
    const newNotes = { ...notes, tabs: updatedTabs };
    setNotes(newNotes);
    window.electronAPI.saveNotes(newNotes);
    log('Notepad: tab renamed:', newName);
  };

  // ----------------------------------------------------------------
  // saveToFile() – otwiera dialog zapisu i zapisuje do pliku na dysku
  // ----------------------------------------------------------------
  const saveToFile = async () => {
    const activeTab = notes.tabs.find(t => t.id === notes.activeTab);
    const filename = (activeTab?.title || 'notatka').replace(/[<>:"/\\|?*]/g, '_') + '.txt';
    const filePath = await window.electronAPI.saveTextToFile(content, filename, null);
    if (filePath) {
      showToast(`${t('notepad.saved')}: ${filePath}`);
      setDirty(false);
      log('Notepad: saved to file:', filePath);
    }
  };

  // ----------------------------------------------------------------
  // handleFind() – zlicza wystąpienia frazy w tekście
  // ----------------------------------------------------------------
  const handleFind = () => {
    if (!findText) { setFindCount(0); return; }
    const count = (content.match(new RegExp(escapeRegex(findText), 'gi')) || []).length;
    setFindCount(count);
    log(`Notepad: find "${findText}" → ${count} matches`);
  };

  // ----------------------------------------------------------------
  // handleReplace() – zastępuje wszystkie wystąpienia frazy
  // ----------------------------------------------------------------
  const handleReplace = () => {
    if (!findText) return;
    const newContent = content.replace(new RegExp(escapeRegex(findText), 'gi'), replaceText);
    setContent(newContent);
    setDirty(true);
    setFindCount(0);
    log(`Notepad: replace "${findText}" → "${replaceText}"`);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const handleContentChange = (e) => {
    setContent(e.target.value);
    setDirty(true);
  };

  // Ctrl+S – ręczny zapis
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      saveCurrentTab();
      showToast(t('notepad.saved'));
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
      e.preventDefault();
      setShowFind(v => !v);
    }
  };

  const activeTabObj = notes.tabs.find(t => t.id === notes.activeTab);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)' }}>

      {/* ─── Zakładki ─── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 2,
        padding: '4px 6px 0', background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)', overflowX: 'auto', flexShrink: 0
      }}>
        {notes.tabs.map(tab => (
          <div key={tab.id}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '5px 10px', borderRadius: '6px 6px 0 0',
              cursor: 'pointer', fontSize: 12, flexShrink: 0, maxWidth: 140,
              background: tab.id === notes.activeTab ? 'var(--bg-card)' : 'var(--bg-hover)',
              color: tab.id === notes.activeTab ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: tab.id === notes.activeTab ? 600 : 400,
              borderTop: tab.id === notes.activeTab ? '2px solid var(--accent)' : '2px solid transparent',
            }}
            onClick={() => switchTab(tab.id)}
            onDoubleClick={() => renameTab(tab.id)}
            title={tab.title}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 100 }}>
              {tab.title}
              {tab.id === notes.activeTab && dirty && (
                <span style={{ color: 'var(--accent)', marginLeft: 3 }}>{ICONS.NOTEPAD}</span>
              )}
            </span>
            {notes.tabs.length > 1 && (
              <span style={{ fontSize: 10, opacity: 0.5, cursor: 'pointer' }}
                onClick={e => closeTab(tab.id, e)}>{ICONS.CLOSE}</span>
            )}
          </div>
        ))}
        <button className="btn-icon" style={{ marginLeft: 2, fontSize: 16, flexShrink: 0 }}
          onClick={addTab} title={t('notepad.new_tab')}>
          {ICONS.PLUS}
        </button>
      </div>

      {/* ─── Toolbar ─── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '4px 8px', background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)', flexShrink: 0, flexWrap: 'wrap'
      }}>
        <button className="btn btn-secondary" style={{ fontSize: 12 }}
          onClick={() => { saveCurrentTab(); showToast(t('notepad.saved')); }}>
          {ICONS.SAVE} {t('notepad.save')}
        </button>
        <button className="btn btn-secondary" style={{ fontSize: 12 }} onClick={saveToFile}>
          {ICONS.EXPORT} {t('notepad.save_as')}
        </button>
        <button className={`btn btn-secondary`} style={{ fontSize: 12 }}
          onClick={() => setShowFind(v => !v)}>
          {ICONS.SEARCH} {t('notepad.find_replace')}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {t('notepad.word_wrap')}
          </span>
          <label className="toggle" style={{ transform: 'scale(0.8)' }}>
            <input type="checkbox" checked={wordWrap} onChange={e => setWordWrap(e.target.checked)} />
            <span className="toggle-slider"></span>
          </label>
        </div>
        {toast && (
          <span style={{ fontSize: 11, color: 'var(--success)', marginLeft: 8 }}>{toast}</span>
        )}
        {dirty && !toast && (
          <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>
            {ICONS.NOTEPAD} {t('notepad.autosaved')}
          </span>
        )}
      </div>

      {/* ─── Znajdź i zastąp ─── */}
      {showFind && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px',
          background: 'var(--bg-card)', borderBottom: '1px solid var(--border)',
          flexShrink: 0, flexWrap: 'wrap'
        }}>
          <input className="form-input" style={{ width: 200, height: 28, fontSize: 12 }}
            placeholder={t('notepad.search_placeholder')}
            value={findText} onChange={e => setFindText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleFind()} />
          <input className="form-input" style={{ width: 180, height: 28, fontSize: 12 }}
            placeholder={t('notepad.replace_placeholder')}
            value={replaceText} onChange={e => setReplaceText(e.target.value)} />
          <button className="btn btn-secondary" style={{ fontSize: 12, padding: '4px 10px' }} onClick={handleFind}>
            {ICONS.SEARCH}
          </button>
          <button className="btn btn-secondary" style={{ fontSize: 12, padding: '4px 10px' }} onClick={handleReplace}>
            {ICONS.REFRESH}
          </button>
          {findCount > 0 && (
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{findCount} wyników</span>
          )}
          <button className="btn-icon" style={{ marginLeft: 'auto' }} onClick={() => setShowFind(false)}>
            {ICONS.CLOSE}
          </button>
        </div>
      )}

      {/* ─── Edytor ─── */}
      <textarea
        ref={textareaRef}
        className="selectable"
        style={{
          flex: 1, padding: 16, resize: 'none', border: 'none', outline: 'none',
          background: 'var(--bg-primary)', color: 'var(--text-primary)',
          fontFamily: "'Cascadia Code', 'Consolas', 'Courier New', monospace",
          fontSize: 13, lineHeight: 1.7,
          whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
          overflowX: wordWrap ? 'hidden' : 'auto',
          overflowY: 'auto',
        }}
        value={content}
        onChange={handleContentChange}
        onKeyDown={handleKeyDown}
        spellCheck={false}
      />

      {/* ─── Statusbar ─── */}
      <div style={{
        display: 'flex', gap: 16, padding: '2px 12px',
        background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)',
        fontSize: 11, color: 'var(--text-muted)', flexShrink: 0
      }}>
        <span>{activeTabObj?.title}</span>
        <span>Znaki: {content.length}</span>
        <span>Wiersze: {content.split('\n').length}</span>
        {activeTabObj?.lastSaved && (
          <span style={{ marginLeft: 'auto' }}>
            {t('notepad.autosaved')}: {new Date(activeTabObj.lastSaved).toLocaleTimeString('pl-PL')}
          </span>
        )}
      </div>
    </div>
  );
}
