// =============================================================================
// FILE: Terminal.jsx
// PATH: src/ui/terminal/Terminal.jsx
// VERSION: 0.0.3
// PURPOSE: Terminal z xterm.js + node-pty (historia komend, ANSI colors). Używa terminalWriteLegacy/terminalResizeLegacy z preload (alias dla legacy IPC).
// FUNCTIONS: Terminal
// DEPENDS ON: react, xterm, xterm-addon-fit, xterm-addon-web-links, translations.js, src
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css';
import { TranslationContext } from '../../utils/translations.js';
import { logDebug, logInfo, logError, logWarn } from '../../utils/loggerRenderer';
import { ICONS } from '../../utils/icons';

// ─── Terminal() – terminal z xterm.js i obsługą node-pty
//   @returns {JSX.Element} – renderowany terminal

export default function Terminal() {
  const { t } = React.useContext(TranslationContext);
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const fitAddonRef = useRef(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentLine, setCurrentLine] = useState('');
  useEffect(() => {
    if (!terminalRef.current) return;
    // Inicjalizacja xterm
    const term = new XTerm({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'monospace',
      theme: {
        background: '#1e1e1e',
        foreground: '#d4d4d4',
        cursor: '#ffffff'
      }
    });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.loadAddon(new WebLinksAddon());
    term.open(terminalRef.current);
    fitAddon.fit();
    xtermRef.current = term;
    fitAddonRef.current = fitAddon;
    // Start PTY
    if (window.electronAPI?.terminalStart) {
      window.electronAPI.terminalStart();
    }
    
    // Nasłuch danych z PTY
    const dataDispose = window.electronAPI?.onTerminalData?.((data) => {
      term.write(data);
    });
    
    // Nasłuch wyjścia
    const exitDispose = window.electronAPI?.onTerminalExit?.(() => {
      term.write('\r\n\x1b[33m[Process exited]\x1b[0m\r\n');
    });
    
    // Obsługa wejścia z klawiatury
    term.onKey(({ key, domEvent }) => {
      const ev = domEvent;
      const code = ev.keyCode;
      
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
          window.electronAPI?.terminalWriteLegacy?.(cmd + '\r');
          setCurrentLine('');
          setHistoryIndex(-1);
        } else {
          window.electronAPI?.terminalWriteLegacy?.('\r');
        }
        ev.preventDefault();
      } else if (ev.key === 'Backspace') {
        if (currentLine.length > 0) {
          const newLine = currentLine.slice(0, -1);
          setCurrentLine(newLine);
        }
      } else if (!ev.ctrlKey && !ev.altKey && key.length === 1) {
        setCurrentLine(prev => prev + key);
      }
    });
    
    // Resize handler
    const handleResize = () => {
      if (fitAddonRef.current) {
        fitAddonRef.current.fit();
        const { cols, rows } = xtermRef.current;
        window.electronAPI?.terminalResizeLegacy?.(cols, rows);
      }
    };
    
    window.addEventListener('resize', handleResize);
    setTimeout(handleResize, 100);
    
    // Cleanup
    return () => {
      dataDispose?.();
      exitDispose?.();
      window.removeEventListener('resize', handleResize);
      window.electronAPI?.terminalKill?.();
      term.dispose();
    };
  }, []);

  const handleClear = () => {
    xtermRef.current?.clear();
    logDebug('Terminal cleared');
  };

  const handleRestart = async () => {
    await window.electronAPI?.terminalKill?.();
    await window.electronAPI?.terminalStart?.();
    xtermRef.current?.clear();
    xtermRef.current?.write('\x1b[32m[Session restarted]\x1b[0m\r\n');
    logDebug('Terminal restarted');
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
