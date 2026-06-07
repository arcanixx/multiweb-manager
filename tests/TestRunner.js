// =============================================================================
// FILE: TestRunner.js
// PATH: tests/TestRunner.js
// VERSION: 0.0.3
// PURPOSE: Orchestrator testów – uruchamia wszystkie TestRunner_*.js
// FUNCTIONS: runAllTests
// DEPENDS ON: url, logger.js, icons.js, logWriter.js, testsLoader.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { fileURLToPath } from 'url';
import { logInfo, logError } from '../src/utils/logger.js';
import { ICONS } from '../src/utils/icons.js';
import { initLogWriter } from '../src/utils/logWriter.js';
import { loadAndRunAllTests } from '../src/loaders/testsLoader.js';

// Parsowanie argumentów wiersza poleceń
const args = process.argv.slice(2);
const jsonOutput = args.includes('--json');
const verbose = args.includes('--verbose');

const DEBUG = true;

// === TYLKO w trybie JSON przekierowujemy console.log na stderr ===
let originalConsoleLog = null;
if (jsonOutput) {
    originalConsoleLog = console.log;
    console.log = (...args) => {
        // Logi idą na stderr, tylko finalny JSON pójdzie na stdout
        process.stderr.write(args.join(' ') + '\n');
    };
}

export async function runAllTests(options = {}) {
    // Inicjalizacja logWritera (tylko jeśli mamy window – w Node pomijamy)
    if (typeof window !== 'undefined') {
        await initLogWriter();
    }

    if (DEBUG) {
        console.log('DEBUG: runAllTests called with options:', options);
    }

    logInfo('ui', `${ICONS.DEBUG} Running tests via loader...`);
    const { passed, failed, results } = await loadAndRunAllTests({ ...options, verbose });
    logInfo('ui', `${ICONS.TEST_PASS} Tests completed: ${passed} passed, ${failed} failed`);

    return { passed, failed, results };
}

if (DEBUG) {
    console.log('DEBUG: import.meta.url =', import.meta.url);
    console.log('DEBUG: process.argv[1] =', process.argv[1]);
    console.log('DEBUG: fileURLToPath =', fileURLToPath(import.meta.url));
}

// Sprawdzenie, czy plik został uruchomiony bezpośrednio (nie zaimportowany)
const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);

if (isMainModule) {
    runAllTests({ jsonOutput, verbose })
        .then(({ passed, failed, results }) => {
            if (jsonOutput) {
                // Przywróć oryginalny console.log przed wypisaniem JSON
                if (originalConsoleLog) console.log = originalConsoleLog;
                // Teraz JSON pójdzie na stdout (bo przywróciliśmy)
                console.log(JSON.stringify({ passed, failed, results }, null, 2));
            }
            process.exit(failed > 0 ? 1 : 0);
        })
        .catch((err) => {
            if (jsonOutput) {
                if (originalConsoleLog) console.log = originalConsoleLog;
                console.log(JSON.stringify({ 
                    passed: 0, 
                    failed: 1, 
                    error: err.message,
                    stack: err.stack 
                }, null, 2));
            } else {
                console.error('Fatal error:', err);
            }
            process.exit(1);
        });
}

// Automatyczne uruchomienie jeśli debugMode (tylko w przeglądarce)
if (typeof window !== 'undefined' && window.electronAPI?.getDebugMode) {
    window.electronAPI.getDebugMode().then((debugMode) => {
        if (debugMode) {
            logInfo('ui', '🐛 Debug mode enabled – running tests...');
            runAllTests();
        }
    });
}