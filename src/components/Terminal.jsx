// =============================================================================
// FILE: src/components/Terminal.jsx
// PATH: multiweb-manager/src/components/Terminal.jsx
// VERSION: v1
// PURPOSE: Embedded terminal oparty na node-pty (przez IPC). Wyświetla output
//          w <pre> z przewijaniem. Obsługuje: wpisywanie komend, Enter do wysłania,
//          wielokrotne zakładki terminala, restart sesji.
//          NAPRAWIONE: terminalId przechowywany w ref (nie state) żeby uniknąć
//          race condition w cleanup. CWD sprawdzany w main.js.
//          UWAGA: Opcja 'admin' to placeholder – wymaga restartowania z sudo/runas.
// DEPENDS ON: icons.js, useTranslation.js, logger.js
// FUNCTIONS: initTerminal, sendCommand, restartTerminal, killTerminal
// =============================================================================

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ICONS } from '../utils/icons';
import { useTranslation } from '../hooks/useTranslation';
import { log } from '../utils/logger';

export default function Terminal({ cwd }) {
  const { t } = useTranslation();
  const outputRef   = useRef(null);    // Div wyświetlający output terminala
  const termIdRef   = useRef(null);    // Ref (nie state!) – unika race condition w cleanup
  const [input, setInput]   = useState('');
  const [ready, setReady]   = useState(false);
  const [currentCwd, setCurrentCwd] = useState(cwd);

  // ----------------------------------------------------------------
  // initTerminal() – tworzy nową sesję terminalową przez IPC
  //   Używa ref dla terminalId żeby cleanup zawsze miał aktualną wartość
  // ----------------------------------------------------------------
  const initTerminal = useCallback(async (workDir) => {
    setReady(false);
    if (outputRef.current) outputRef.current.textContent = '';

    // Zabij poprzednią sesję jeśli istnieje
    if (termIdRef.current) {
      await window.electronAPI.killTerminal(termIdRef.current).catch(() => {});
      termIdRef.current = null;
    }

    const id = await window.electronAPI.createTerminal(workDir || cwd);
    termIdRef.current = id;
    setReady(true);
    log('Terminal: created, id:', id, 'cwd:', workDir || cwd);

    // Nasłuchuj danych z terminala
    window.electronAPI.onTerminalData(({ terminalId, data }) => {
      if (terminalId !== id) return;
      if (!outputRef.current) return;
      outputRef.current.textContent += data;
      // Auto-scroll na dół
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    });
  }, [cwd]);

  useEffect(() => {
    initTerminal(cwd);

    // Cleanup przy odmontowaniu komponentu
    return () => {
      if (termIdRef.current) {
        window.electronAPI.killTerminal(termIdRef.current).catch(() => {});
        log('Terminal: killed on unmount:', termIdRef.current);
        termIdRef.current = null;
      }
    };
  }, [cwd]); // Reinicjalizuj gdy zmienia się CWD

  // ----------------------------------------------------------------
  // sendCommand() – wysyła komendę do terminala (z Enter)
  // ----------------------------------------------------------------
  const sendCommand = useCallback(() => {
    if (!termIdRef.current || !ready) return;
    window.electronAPI.terminalWrite(termIdRef.current, input + '\r\n');
    setInput('');
    log('Terminal: command sent:', input);
  }, [input, ready]);

  // ----------------------------------------------------------------
  // restartTerminal() – zabija i tworzy nową sesję (ten sam CWD)
  // ----------------------------------------------------------------
  const restartTerminal = () => {
    log('Terminal: restarting...');
    initTerminal(currentCwd);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendCommand();
    }
    // Ctrl+C – anuluj
    if (e.key === 'c' && e.ctrlKey) {
      if (termIdRef.current) {
        window.electronAPI.terminalWrite(termIdRef.current, '\x03');
      }
    }
    // Strzałki – historia komend (placeholder)
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      // TODO: historia komend
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: '#0d1117', color: '#c9d1d9', fontFamily: "'Cascadia Code','Consolas','Courier New',monospace"
    }}>
      {/* ─── Toolbar ─── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px',
        background: '#161b22', borderBottom: '1px solid #30363d', flexShrink: 0
      }}>
        <span style={{ fontSize: 16 }}>{ICONS.TERMINAL}</span>
        <span style={{ fontSize: 12, color: '#8b949e', flex: 1 }}>
          {t('terminal.current_dir')}: <span style={{ color: '#58a6ff' }}>{currentCwd || '~'}</span>
        </span>
        <button
          style={{
            background: '#21262d', color: '#c9d1d9', border: '1px solid #30363d',
            borderRadius: 6, padding: '3px 10px', fontSize: 12, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4
          }}
          onClick={restartTerminal}
          title={t('terminal.restart')}>
          {ICONS.REFRESH} {t('terminal.restart')}
        </button>
        <button
          style={{
            background: '#6e4700', color: '#e3b341', border: '1px solid #6e4700',
            borderRadius: 6, padding: '3px 10px', fontSize: 12, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4
          }}
          onClick={() => alert(t('terminal.admin_note') + '\n\nUruchom aplikację jako Administrator w systemie Windows.')}
          title={t('terminal.run_as_admin')}>
          {ICONS.TERMINAL_ADMIN} {t('terminal.run_as_admin')}
        </button>
      </div>

      {/* ─── Output ─── */}
      <div
        ref={outputRef}
        style={{
          flex: 1, overflowY: 'auto', padding: '10px 14px',
          fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap',
          wordBreak: 'break-all', color: '#c9d1d9',
          // Custom scrollbar dla dark terminala
          scrollbarWidth: 'thin', scrollbarColor: '#30363d #0d1117'
        }}
      />

      {/* ─── Status (inicjalizacja) ─── */}
      {!ready && (
        <div style={{ padding: '4px 14px', fontSize: 11, color: '#8b949e', flexShrink: 0 }}>
          <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block', marginRight: 6 }}>⟳</span>
          Inicjalizacja terminala...
        </div>
      )}

      {/* ─── Input ─── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
        background: '#161b22', borderTop: '1px solid #30363d', flexShrink: 0
      }}>
        <span style={{ color: '#3fb950', fontWeight: 700, fontSize: 14 }}>$</span>
        <input
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: '#c9d1d9', fontFamily: 'inherit', fontSize: 13,
            caretColor: '#58a6ff',
          }}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={ready ? 'Wpisz komendę...' : 'Oczekiwanie na terminal...'}
          disabled={!ready}
          autoFocus
          spellCheck={false}
          className="selectable"
        />
        <button
          style={{
            background: '#238636', color: 'white', border: 'none',
            borderRadius: 6, padding: '4px 12px', fontSize: 12, cursor: 'pointer'
          }}
          onClick={sendCommand} disabled={!ready || !input.trim()}>
          {ICONS.TERMINAL_RUN}
        </button>
      </div>
    </div>
  );
}
