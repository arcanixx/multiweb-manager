// =============================================================================
// FILE: TestRunner_Config.js
// PATH: tests/TestRunner_Config.js
// VERSION: 0.0.3
// PURPOSE: Testy pliku konfiguracyjnego config.js
// FUNCTIONS: runConfigTests
// DEPENDS ON: fs, path, testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { existsSync } from "fs";
import { join } from "path";
import { runTests } from "./testUtils.js";
const ROOT_CONFIG = join(process.cwd(), "config.js");
const SRC_CONFIG = join(process.cwd(), "src", "config.js");
// Funkcje do dynamicznego importu (w teście)
async function importConfig(path) {
  try {
    const module = await import(path);
    return { ok: true, data: module };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
const tests = [
  {
    name: "root/config.js exists",
    run: async () => {
      const exists = existsSync(ROOT_CONFIG);
      return { ok: exists, details: exists ? "" : "root/config.js not found" };
    }
  },
  {
    name: "src/config.js exists",
    run: async () => {
      const exists = existsSync(SRC_CONFIG);
      return { ok: exists, details: exists ? "" : "src/config.js not found" };
    }
  },
  {
    name: "root/config.js re-exports src/config.js",
    run: async () => {
      if (!existsSync(ROOT_CONFIG)) return { ok: false, details: "root/config.js not found" };
      const content = await import("fs").then(fs => fs.readFileSync(ROOT_CONFIG, "utf-8"));
      const hasReexport = content.includes("export * from") && content.includes("src/config.js");
      const ok = hasReexport;
      return { ok, details: ok ? "" : "root/config.js does not re-export src/config.js" };
    }
  },
  {
    name: "FEATURES – all flags are boolean",
    run: async () => {
      const result = await importConfig(SRC_CONFIG);
      if (!result.ok) return { ok: false, details: result.error };
      const { FEATURES } = result.data;
      if (!FEATURES) return { ok: false, details: "FEATURES not exported" };
      const invalid = Object.entries(FEATURES).filter(([, v]) => typeof v !== "boolean");
      const ok = invalid.length === 0;
      return { ok, details: ok ? "" : `Non-boolean flags: ${invalid.map(([k]) => k).join(", ")}` };
    }
  },
  {
    name: "DEFAULT_SETTINGS – all expected keys exist",
    run: async () => {
      const result = await importConfig(SRC_CONFIG);
      if (!result.ok) return { ok: false, details: result.error };
      const { DEFAULT_SETTINGS } = result.data;
      if (!DEFAULT_SETTINGS) return { ok: false, details: "DEFAULT_SETTINGS not exported" };
      const expectedKeys = [
        "language", "theme", "debugMode", "firstRun", "logsEnabled", "logsMaxLines",
        "sleepTabsTimeout", "addressBarEditable", "defaultZoom", "defaultUserAgent",
        "adBlockerEnabled", "resourceMonitor", "hotkeysEnabled", "defaultProfileCategory",
        "defaultPartitionPrefix"
      ];
      const missing = expectedKeys.filter(key => !(key in DEFAULT_SETTINGS));
      const ok = missing.length === 0;
      return { ok, details: ok ? "" : `Missing keys: ${missing.join(", ")}` };
    }
  },
  {
    name: "LIMITS – all values are > 0",
    run: async () => {
      const result = await importConfig(SRC_CONFIG);
      if (!result.ok) return { ok: false, details: result.error };
      const { LIMITS } = result.data;
      if (!LIMITS) return { ok: false, details: "LIMITS not exported" };
      const invalid = Object.entries(LIMITS).filter(([, v]) => typeof v !== "number" || v <= 0);
      const ok = invalid.length === 0;
      return { ok, details: ok ? "" : `Invalid limits: ${invalid.map(([k]) => k).join(", ")}` };
    }
  },
  {
    name: "PATHS – all values are strings",
    run: async () => {
      const result = await importConfig(SRC_CONFIG);
      if (!result.ok) return { ok: false, details: result.error };
      const { PATHS } = result.data;
      if (!PATHS) return { ok: false, details: "PATHS not exported" };
      const invalid = Object.entries(PATHS).filter(([, v]) => typeof v !== "string");
      const ok = invalid.length === 0;
      return { ok, details: ok ? "" : `Invalid paths: ${invalid.map(([k]) => k).join(", ")}` };
    }
  },
  {
    name: "API_ENDPOINTS – contains valid URLs",
    run: async () => {
      const result = await importConfig(SRC_CONFIG);
      if (!result.ok) return { ok: false, details: result.error };
      const { API_ENDPOINTS } = result.data;
      if (!API_ENDPOINTS) return { ok: false, details: "API_ENDPOINTS not exported" };
      const urlPattern = /^https?:\/\//;
      const invalid = Object.entries(API_ENDPOINTS).filter(([, v]) => !urlPattern.test(v));
      const ok = invalid.length === 0;
      return { ok, details: ok ? "" : `Invalid URLs: ${invalid.map(([k]) => k).join(", ")}` };
    }
  }
];

export async function runConfigTests() {
  return runTests("Config", tests);
}