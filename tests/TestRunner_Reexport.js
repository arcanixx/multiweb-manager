// =============================================================================
// FILE: TestRunner_Reexport.js
// PATH: tests/TestRunner_Reexport.js
// VERSION: 0.0.3
// PURPOSE: Testy poprawności re-eksportów (config.js, icons.js)
// FUNCTIONS: runReexportTests
// DEPENDS ON: fs, path, testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { runTests } from "./testUtils.js";
const ROOT_CONFIG = join(process.cwd(), "config.js");
const SRC_CONFIG = join(process.cwd(), "src", "config.js");
const UTILS_ICONS = join(process.cwd(), "src", "utils", "icons.js");
const DATA_ICONS = join(process.cwd(), "src", "data", "icons.js");
const IPC_LOADER = join(process.cwd(), "src", "loaders", "ipcLoader.js");
const TESTS_LOADER = join(process.cwd(), "src", "loaders", "testsLoader.js");
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
    name: "root/config.js re-exports src/config.js correctly",
    run: async () => {
      if (!existsSync(ROOT_CONFIG)) return { ok: false, details: "root/config.js not found" };
      const content = readFileSync(ROOT_CONFIG, "utf-8");
      const hasReexport = content.includes("export * from") && content.includes("src/config.js");
      const ok = hasReexport;
      return { ok, details: ok ? "" : "root/config.js does not properly re-export src/config.js" };
    }
  },
  {
    name: "src/utils/icons.js exists",
    run: async () => {
      const exists = existsSync(UTILS_ICONS);
      return { ok: exists, details: exists ? "" : "src/utils/icons.js not found" };
    }
  },
  {
    name: "src/data/icons.js exists",
    run: async () => {
      const exists = existsSync(DATA_ICONS);
      return { ok: exists, details: exists ? "" : "src/data/icons.js not found" };
    }
  },
  {
    name: "src/utils/icons.js re-exports src/data/icons.js correctly",
    run: async () => {
      if (!existsSync(UTILS_ICONS)) return { ok: false, details: "src/utils/icons.js not found" };
      const content = readFileSync(UTILS_ICONS, "utf-8");
      const hasReexport = content.includes("export * from") && content.includes("data/icons.js");
      const ok = hasReexport;
      return { ok, details: ok ? "" : "src/utils/icons.js does not properly re-export src/data/icons.js" };
    }
  },
  {
    name: "root/config.js exports match src/config.js",
    run: async () => {
      try {
        const rootModule = await import(ROOT_CONFIG);
        const srcModule = await import(SRC_CONFIG);
        const rootExports = Object.keys(rootModule).filter(k => k !== "default");
        const srcExports = Object.keys(srcModule).filter(k => k !== "default");
        const missing = srcExports.filter(e => !rootExports.includes(e));
        const ok = missing.length === 0;
        return { ok, details: ok ? "" : `Missing re-exports: ${missing.join(", ")}` };
      } catch (err) {
        return { ok: false, details: err.message };
      }
    }
  },
  {
    name: "src/utils/icons.js exports match src/data/icons.js",
    run: async () => {
      try {
        const utilsModule = await import(UTILS_ICONS);
        const dataModule = await import(DATA_ICONS);
        const utilsExports = Object.keys(utilsModule).filter(k => k !== "default");
        const dataExports = Object.keys(dataModule).filter(k => k !== "default");
        const missing = dataExports.filter(e => !utilsExports.includes(e));
        const ok = missing.length === 0;
        return { ok, details: ok ? "" : `Missing re-exports: ${missing.join(", ")}` };
      } catch (err) {
        return { ok: false, details: err.message };
      }
    }
  },
  {
    name: "loaders exist (ipcLoader & testsLoader)",
    run: async () => {
      const ipcExists = existsSync(IPC_LOADER);
      const testsExists = existsSync(TESTS_LOADER);
      return { 
        ok: ipcExists && testsExists, 
        details: [
          !ipcExists && "ipcLoader.js missing",
          !testsExists && "testsLoader.js missing"
        ].filter(Boolean).join(", ")
      };
    }
  }
];

export async function runReexportTests() {
  return runTests("Reexport", tests);
}