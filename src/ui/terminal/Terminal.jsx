// =============================================================================
// FILE: Terminal.jsx
// PATH: src/ui/terminal/Terminal.jsx
// VERSION: 0.0.3
// PURPOSE: Terminal z xterm.js + node-pty (historia komend, ANSI colors). Używa nowego multi-session API (terminal:create/write/resize/kill z terminalId).
// FUNCTIONS: Terminal
// DEPENDS ON: react, xterm, xterm-addon-fit, xterm-addon-web-links, translations.js, loggerRenderer, icons
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css';
import { TranslationContext } from '../../utils/translations.js';
import { logDebug, logError } from '../../utils/loggerRenderer';
import { ICONS } from '../../utils/icons';

// ─── Terminal() – terminal z xterm.js i obsługą node-pty (multi-session API)
//   @param {Object} props.cwd – katalog roboczy dla nowej sesji PTY
//   @returns {JSX.Element} – renderowany terminal
export default function Terminal({ cwd }) {
  const { t } = React.useContext(TranslationContext);
  const terminalRef  = useRef(null);
  const xtermRef     = useRef(null);
  const fitAddonRef  = useRef(null);
  // ─── terminalId – identyfikator sesji PTY zwracany przez terminal:create
  const terminalIdRef = useRef(null);

  const [history, setHistory]           = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentLine, setCurrentLine]   = useState('');

  useEffect(() => {
    if (!terminalRef.current) return;

    // ─── Inicjalizacja xterm.js
    const term = new XTerm({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'monospace',
      theme: {
        background: '#1e1e1e',
        foreground: '#d4d4d4',
        cursor:     '#ffffff'
      }
    });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.loadAddon(new WebLinksAddon());
    term.open(terminalRef.current);
    fitAddon.fit();
    xtermRef.current    = term;
    fitAddonRef.current = fitAddon;

    // ─── startSession() – tworzy nową sesję PTY i zapisuje jej id
    //   @returns {Promise<void>}
    async function startSession() {
      try {
        const res = await window.electronAPI?.createTerminal?.(cwd);
        if (res?.ok && res?.data?.terminalId) {
          terminalIdRef.current = res.data.terminalId;
          logDebug('terminal', 'Terminal session started', res.data.terminalId);
        } else {
          logError('terminal', 'Terminal: createTerminal failed', res?.error);
        }
      } catch (err) {
        logError('terminal', 'Terminal: startSession exception', err.message);
      }
    }
    startSession();

    // ─── Nasłuch danych z PTY – filtrujemy po terminalId jeśli backend go przesyła
    const dataDispose = window.electronAPI?.onTerminalData?.((data) => {
      term.write(data);
    });

    // ─── Nasłuch zakończenia procesu PTY
    const exitDispose = window.electronAPI?.onTerminalExit?.(() => {
      term.write('\r\n\x1b[33m[Process exited]\x1b[0m\r\n');
    });

    // ─── Obsługa wejścia z klawiatury
    term.onKey(({ key, domEvent }) => {
      const ev = domEvent;

      if (ev.key === 'ArrowUp') {
        if (history.length > 0) {
          const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
          setHistoryIndex(newIndex);
          const cmd = history[newIndex] || '';
          setCurrentLine(cmd);
          // Usuń aktualną linię i wpisz historię
          term.write('\r\x1b[K');
          term.write(cmd);
        }
        ev.preventDefault();

      } else if (ev.key === 'ArrowDown') {
        if (historyIndex !== -1) {
          const newIndex = historyIndex + 1;
          if (newIndex >= history.length) {
            setHistoryIndex(-1);
            setCurrentLine('');
            term.write('\r\x1b[K');
          } else {
            setHistoryIndex(newIndex);
            const cmd = history[newIndex];
            setCurrentLine(cmd);
            term.write('\r\x1b[K');
            term.write(cmd);
          }
        }
        ev.preventDefault();

      } else if (ev.key === 'Enter') {
        const cmd = currentLine || '';
        if (cmd.trim()) {
          setHistory(prev => [...prev, cmd]);
          // ─── Wysyłamy dane przez nowe API z terminalId
          window.electronAPI?.terminalWrite?.(terminalIdRef.current, cmd + '\r');
          setCurrentLine('');
          setHistoryIndex(-1);
        } else {
          window.electronAPI?.terminalWrite?.(terminalIdRef.current, '\r');
        }
        ev.preventDefault();

      } else if (ev.key === 'Backspace') {
        if (currentLine.length > 0) {
          setCurrentLine(prev => prev.slice(0, -1));
        }
      } else if (!ev.ctrlKey && !ev.altKey && key.length === 1) {
        setCurrentLine(prev => prev + key);
      }
    });

    // ─── handleResize() – dopasowuje terminal do rozmiaru okna i informuje PTY
    const handleResize = () => {
      if (fitAddonRef.current && xtermRef.current) {
        fitAddonRef.current.fit();
        const { cols, rows } = xtermRef.current;
        // ─── Resize przez nowe API z terminalId
        window.electronAPI?.terminalResize?.(terminalIdRef.current, cols, rows);
      }
    };

    window.addEventListener('resize', handleResize);
    setTimeout(handleResize, 100);

    // ─── Cleanup – sprzątamy listenery i zabijamy sesję PTY
    return () => {
      dataDispose?.();
      exitDispose?.();
      window.removeEventListener('resize', handleResize);
      if (terminalIdRef.current) {
        window.electronAPI?.killTerminal?.(terminalIdRef.current);
      }
      term.dispose();
    };
  }, []);

  // ─── handleClear() – czyści zawartość terminala
  const handleClear = () => {
    xtermRef.current?.clear();
    logDebug('terminal', 'Terminal cleared');
  };

  // ─── handleRestart() – zabija bieżącą sesję PTY i tworzy nową
  //   @returns {Promise<void>}
  const handleRestart = async () => {
    try {
      if (terminalIdRef.current) {
        await window.electronAPI?.killTerminal?.(terminalIdRef.current);
      }
      const res = await window.electronAPI?.createTerminal?.(cwd);
      if (res?.ok && res?.data?.terminalId) {
        terminalIdRef.current = res.data.terminalId;
        xtermRef.current?.clear();
        xtermRef.current?.write('\x1b[32m[Session restarted]\x1b[0m\r\n');
        logDebug('terminal', 'Terminal restarted', res.data.terminalId);
      } else {
        logError('terminal', 'Terminal: restart failed', res?.error);
      }
    } catch (err) {
      logError('terminal', 'Terminal: restart exception', err.message);
    }
  };

  return (
    <div className="terminal-container" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="terminal-toolbar">
        <button onClick={handleClear} title={t('terminal.clear')}>
          {ICONS.CLEAR} {t('terminal.clear')}
        </button>
        <button onClick={handleRestart} title={t('terminal.restart')}>
          {ICONS.REFRESH} {t('terminal.restart')}
        </button>
      </div>
      <div ref={terminalRef} style={{ flex: 1, backgroundColor: '#1e1e1e' }} />
    </div>
  );
}