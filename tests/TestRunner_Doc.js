// =============================================================================
// FILE: TestRunner_Doc.js
// PATH: tests/TestRunner_Doc.js
// VERSION: 0.0.3
// PURPOSE: Testy spójności dokumentacji w folderze doc/
// FUNCTIONS: runDocTests
// DEPENDS ON: fs, path, testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { readdirSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import { runTests } from "./testUtils.js";
const DOC_DIR = join(process.cwd(), "doc");
// Lista oczekiwanych plików w doc/
const EXPECTED_DOC_FILES = [
  "AI_Development_Standards.md",
  "AI_Repository_Access.md",
  "Definition_Mockups_UI_UX.md",
  "DevelopersGuide.md",
  "Global_Project_Starter_Guide.md",
  "ModulesOverview.md",
  "Project_Initialization_Guide.md",
  "Requirements.md",
  "Structure.md"
];
// Wzór nagłówka dla plików .md
const HEADER_PATTERN = /<!--\s*={5,}\n FILE: (.+?)\n PATH: (.+?)\n VERSION: (.+?)\n PURPOSE: (.+?)\n FUNCTIONS: (.+?)\n DEPENDS ON: (.+?)\n UWAGA: (.+?)\n ={5,}\s*-->/s;
const tests = [
  {
    name: "doc/ directory exists",
    run: async () => {
      const exists = existsSync(DOC_DIR);
      return { ok: exists, details: exists ? "" : "doc/ directory not found" };
    }
  },
  {
    name: "All expected doc files exist",
    run: async () => {
      if (!existsSync(DOC_DIR)) return { ok: false, details: "doc/ directory not found" };
      const existing = readdirSync(DOC_DIR).filter(f => f.endsWith(".md"));
      const missing = EXPECTED_DOC_FILES.filter(f => !existing.includes(f));
      const ok = missing.length === 0;
      return { ok, details: ok ? "" : `Missing files: ${missing.join(", ")}` };
    }
  },
  {
    name: "No extra .md files in doc/",
    run: async () => {
      if (!existsSync(DOC_DIR)) return { ok: false, details: "doc/ directory not found" };
      const existing = readdirSync(DOC_DIR).filter(f => f.endsWith(".md"));
      const extra = existing.filter(f => !EXPECTED_DOC_FILES.includes(f));
      const ok = extra.length === 0;
      return { ok, details: ok ? "" : `Extra files: ${extra.join(", ")} (update EXPECTED_DOC_FILES or remove)` };
    }
  },
  {
    name: "All doc files have valid headers",
    run: async () => {
      if (!existsSync(DOC_DIR)) return { ok: false, details: "doc/ directory not found" };
      const errors = [];
      for (const file of EXPECTED_DOC_FILES) {
        const filePath = join(DOC_DIR, file);
        if (!existsSync(filePath)) {
          errors.push(`${file}: not found`);
          continue;
        }
        const content = readFileSync(filePath, "utf-8");
        const match = content.match(HEADER_PATTERN);
        if (!match) {
          errors.push(`${file}: missing or invalid header`);
          continue;
        }
        const [, fileName, filePathFromHeader, version, purpose, functions, dependsOn, uwaga] = match; //dodać punkt sprawdzający, czy dependsOn nie jest puste itp
        if (fileName !== file) errors.push(`${file}: FILE field mismatch (got ${fileName})`);
        if (!filePathFromHeader.endsWith(file)) errors.push(`${file}: PATH field invalid (got ${filePathFromHeader})`);
        if (!version.match(/^\d+\.\d+\.\d+$/)) errors.push(`${file}: VERSION format invalid (got ${version})`);
        if (!purpose || purpose.trim() === "") errors.push(`${file}: PURPOSE is empty`);
        if (functions === "-" || functions === "") errors.push(`${file}: FUNCTIONS is empty (should contain section count)`);
        if (uwaga !== "Nie usuwać komentarzy – opisują flow aplikacji.") {
          errors.push(`${file}: UWAGA field mismatch`);
        }
      }
      const ok = errors.length === 0;
      return { ok, details: ok ? "" : errors.join("; ") };
    }
  },
  {
    name: "README.md exists in root",
    run: async () => {
      const exists = existsSync(join(process.cwd(), "README.md"));
      return { ok: exists, details: exists ? "" : "README.md not found in root" };
    }
  }
];

export async function runDocTests() {
  return runTests("Doc", tests);
}