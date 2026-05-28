// =============================================================================
// FILE: TestRunner_CSS.js
// PATH: tests/TestRunner_CSS.js
// VERSION: 0.0.3
// PURPOSE: Testy spójności plików CSS (importy, kolejność, istniejące pliki)
// FUNCTIONS: runCssTests
// DEPENDS ON: fs, path, testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { readdirSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import { runTests } from "./testUtils.js";
const CSS_DIR = join(process.cwd(), "src", "ui", "styles");
// Oczekiwana kolejność importów w index.css
const EXPECTED_IMPORT_ORDER = [
  "layout.css",
  "theme.css",
  "components.css"
];
// Wzór na @import
const IMPORT_PATTERN = /@import\s+['"]([^'"]+)['"]/g;
const tests = [
  {
    name: "styles/ directory exists",
    run: async () => {
      const exists = existsSync(CSS_DIR);
      return { ok: exists, details: exists ? "" : "src/ui/styles/ directory not found" };
    }
  },
  {
    name: "All expected CSS files exist",
    run: async () => {
      if (!existsSync(CSS_DIR)) return { ok: false, details: "styles/ directory not found" };
      const expected = ["index.css", "layout.css", "theme.css", "components.css"];
      const existing = readdirSync(CSS_DIR).filter(f => f.endsWith(".css"));
      const missing = expected.filter(f => !existing.includes(f));
      const ok = missing.length === 0;
      return { ok, details: ok ? "" : `Missing files: ${missing.join(", ")}` };
    }
  },
  {
    name: "index.css imports order is correct",
    run: async () => {
      const indexPath = join(CSS_DIR, "index.css");
      if (!existsSync(indexPath)) return { ok: false, details: "index.css not found" };
      const content = readFileSync(indexPath, "utf-8");
      const imports = [];
      let match;
      while ((match = IMPORT_PATTERN.exec(content)) !== null) {
        imports.push(match[1]);
      }
      const expected = EXPECTED_IMPORT_ORDER;
      let isCorrect = true;
      let details = "";
      for (let i = 0; i < expected.length; i++) {
        if (i >= imports.length) {
          isCorrect = false;
          details = `Missing import: ${expected[i]}`;
          break;
        }
        if (imports[i] !== expected[i]) {
          isCorrect = false;
          details = `Wrong order: expected ${expected[i]}, got ${imports[i]}`;
          break;
        }
      }
      if (isCorrect && imports.length > expected.length) {
        details = `Extra imports: ${imports.slice(expected.length).join(", ")}`;
        isCorrect = false;
      }
      return { ok: isCorrect, details: isCorrect ? "" : details };
    }
  },
  {
    name: "All imported CSS files exist",
    run: async () => {
      const indexPath = join(CSS_DIR, "index.css");
      if (!existsSync(indexPath)) return { ok: false, details: "index.css not found" };
      const content = readFileSync(indexPath, "utf-8");
      const imports = [];
      let match;
      while ((match = IMPORT_PATTERN.exec(content)) !== null) {
        imports.push(match[1]);
      }
      const missing = imports.filter(imp => !existsSync(join(CSS_DIR, imp)));
      const ok = missing.length === 0;
      return { ok, details: ok ? "" : `Missing imported files: ${missing.join(", ")}` };
    }
  },
  {
    name: "No circular dependencies in CSS imports",
    run: async () => {
      // Uproszczone: sprawdzamy czy plik nie importuje samego siebie
      const files = ["index.css", "layout.css", "theme.css", "components.css"];
      const errors = [];
      for (const file of files) {
        const filePath = join(CSS_DIR, file);
        if (!existsSync(filePath)) continue;
        const content = readFileSync(filePath, "utf-8");
        const imports = [];
        let match;
        while ((match = IMPORT_PATTERN.exec(content)) !== null) {
          imports.push(match[1]);
        }
        if (imports.includes(file)) {
          errors.push(`${file} imports itself`);
        }
      }
      const ok = errors.length === 0;
      return { ok, details: ok ? "" : errors.join("; ") };
    }
  }
];

export async function runCssTests() {
  return runTests("CSS", tests);
}