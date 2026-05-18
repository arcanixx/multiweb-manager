// =============================================================================
// FILE: resourceMonitor.js
// PATH: src/core/resourceMonitor.js
// VERSION: 0.0.3
// PURPOSE: Monitor zasobów systemowych
//          - CPU
//          - RAM
//          - progi ostrzeżeń (warnAt, criticalAt)
// =============================================================================

import os from "os";
import { DEFAULT_SETTINGS } from "../config.js";

// ---------------------------------------------------------------------------
// Publiczne API
// ---------------------------------------------------------------------------

/**
 * Zwraca aktualny poziom użycia CPU i RAM (w procentach)
 * oraz progi ostrzeżeń z DEFAULT_SETTINGS.resourceMonitor.
 *
 * @returns {{ cpuPercent: number, ramPercent: number, warnAt: number, criticalAt: number }}
 */
export function getSystemUsage() {
  // --- CPU: średnia ze wszystkich rdzeni ---
  const cpus = os.cpus();
  const cpuLoad =
    cpus.reduce((acc, cpu) => {
      const total = Object.values(cpu.times).reduce((a, b) => a + b, 0);
      return acc + (1 - cpu.times.idle / total);
    }, 0) / cpus.length;

  // --- RAM ---
  const totalMem = os.totalmem();
  const freeMem  = os.freemem();
  const usedMem  = totalMem - freeMem;
  const ramPercent = (usedMem / totalMem) * 100;

  return {
    cpuPercent: Math.round(cpuLoad * 100),
    ramPercent:  Math.round(ramPercent),
    warnAt:      DEFAULT_SETTINGS.resourceMonitor.warnAt,
    criticalAt:  DEFAULT_SETTINGS.resourceMonitor.criticalAt
  };
}

// =============================================================================
// END OF FILE
// =============================================================================
