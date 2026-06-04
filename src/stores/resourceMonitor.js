// =============================================================================
// FILE: resourceMonitor.js
// PATH: src/core/resourceMonitor.js
// VERSION: 0.0.3
// PURPOSE: Serwis monitorujący zużycie zasobów systemowych (CPU/RAM) przez aplikację i system operacyjny.
// FUNCTIONS: getSystemUsage
// DEPENDS ON: os, config.js, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import os from "os";
import { DEFAULT_SETTINGS, isFeatureEnabled } from "../config.js";
import { logInfo, logError, logWarn, logDebug } from "../utils/logger.js";

// ─── getSystemUsage() – zwraca aktualne użycie CPU i RAM z progami ostrzeżeń
//   @returns {Object} – obiekt z cpuPercent, ramPercent, warnAt, criticalAt
export function getSystemUsage() {
  try {
    if (!isFeatureEnabled('resourceMonitor')) {
      logDebug("engine", "resourceMonitor: feature disabled, returning null data");
      return { 
        cpuPercent: 0, 
        ramPercent: 0, 
        warnAt: DEFAULT_SETTINGS.resourceMonitor.warnAt, 
        criticalAt: DEFAULT_SETTINGS.resourceMonitor.criticalAt 
      };
    }

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

    logDebug("engine", "resourceMonitor.getSystemUsage result", {
      cpuPercent: Math.round(cpuLoad * 100),
      ramPercent: Math.round(ramPercent)
    });

    return {
      cpuPercent: Math.round(cpuLoad * 100),
      ramPercent:  Math.round(ramPercent),
      warnAt:      DEFAULT_SETTINGS.resourceMonitor.warnAt,
      criticalAt:  DEFAULT_SETTINGS.resourceMonitor.criticalAt
    };
  } catch (err) {
    logError("engine", "getSystemUsage failed", err.message);
    logWarn("engine", "Nie można odczytać danych systemowych");

    return {
      cpuPercent: 0,
      ramPercent: 0,
      warnAt:      DEFAULT_SETTINGS.resourceMonitor.warnAt,
      criticalAt:  DEFAULT_SETTINGS.resourceMonitor.criticalAt
    };
  }
}
