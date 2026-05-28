// =============================================================================
// FILE: TestRunner_Assets.js
// PATH: tests/TestRunner_Assets.js
// VERSION: 0.0.3
// PURPOSE: Testy spójności plików w folderze assets/
// FUNCTIONS: runAssetsTests
// DEPENDS ON: fs, path, testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { readdirSync, existsSync, statSync } from "fs";
import { join } from "path";
import { runTests } from "./testUtils.js";
const ASSETS_DIR = join(process.cwd(), "assets");
// Lista oczekiwanych plików w assets/
const EXPECTED_ASSET_FILES = [
  "app-icon.ico",
  "app-icon.png"
];
// Dozwolone rozszerzenia dla assetów
const ALLOWED_EXTENSIONS = [".ico", ".png", ".jpg", ".jpeg", ".svg", ".gif", ".bmp", ".tiff"];
const tests = [
  {
    name: "assets/ directory exists",
    run: async () => {
      const exists = existsSync(ASSETS_DIR);
      return { ok: exists, details: exists ? "" : "assets/ directory not found" };
    }
  },
  {
    name: "All expected asset files exist",
    run: async () => {
      if (!existsSync(ASSETS_DIR)) return { ok: false, details: "assets/ directory not found" };
      const existing = readdirSync(ASSETS_DIR);
      const missing = EXPECTED_ASSET_FILES.filter(f => !existing.includes(f));
      const ok = missing.length === 0;
      return { ok, details: ok ? "" : `Missing files: ${missing.join(", ")}` };
    }
  },
  {
    name: "No unexpected files in assets/",
    run: async () => {
      if (!existsSync(ASSETS_DIR)) return { ok: false, details: "assets/ directory not found" };
      const existing = readdirSync(ASSETS_DIR);
      const unexpected = existing.filter(f => {
        const ext = f.slice(f.lastIndexOf(".")).toLowerCase();
        return !EXPECTED_ASSET_FILES.includes(f) && ALLOWED_EXTENSIONS.includes(ext);
      });
      const ok = unexpected.length === 0;
      return { ok, details: ok ? "" : `Unexpected files: ${unexpected.join(", ")} (update EXPECTED_ASSET_FILES or remove)` };
    }
  },
  {
    name: "No binary files with wrong extensions",
    run: async () => {
      if (!existsSync(ASSETS_DIR)) return { ok: false, details: "assets/ directory not found" };
      const existing = readdirSync(ASSETS_DIR);
      const wrongExt = existing.filter(f => {
        const ext = f.slice(f.lastIndexOf(".")).toLowerCase();
        return !ALLOWED_EXTENSIONS.includes(ext);
      });
      const ok = wrongExt.length === 0;
      return { ok, details: ok ? "" : `Files with wrong extensions: ${wrongExt.join(", ")}` };
    }
  },
  {
    name: "All asset files are non-empty",
    run: async () => {
      if (!existsSync(ASSETS_DIR)) return { ok: false, details: "assets/ directory not found" };
      const errors = [];
      const existing = readdirSync(ASSETS_DIR);
      for (const file of existing) {
        const filePath = join(ASSETS_DIR, file);
        const stats = statSync(filePath);
        if (stats.size === 0) errors.push(`${file}: empty file`);
      }
      const ok = errors.length === 0;
      return { ok, details: ok ? "" : errors.join("; ") };
    }
  }
];

export async function runAssetsTests() {
  return runTests("Assets", tests);
}