// =============================================================================
// FILE: ipcMainHandlers_tools.js
// PATH: src/ipc/ipcMainHandlers_tools.js
// VERSION: 0.0.3
// PURPOSE: IPC handlers dla narzędzi developerskich.
//          - tools:formatJSON     – formatuje JSON (parse + stringify indent)
//          - tools:yamlToJson     – konwertuje YAML → JSON
//          - tools:jsonToYaml     – konwertuje JSON → YAML
//          - tools:regexTest      – testuje regex na tekście, zwraca matches
//          - tools:markdownRender – renderuje Markdown → HTML (marked)
//          - tools:image:resize   – zmienia rozmiar obrazu (sharp)
//          - tools:image:convert  – konwertuje format obrazu (sharp)
//          - tools:image:compress – kompresuje JPEG do podanej jakości (sharp)
//          - tools:svgToPng       – konwertuje SVG → PNG (sharp)
//          - tools:filePreview    – odczytuje plik jako base64 + ext
//          - tools:apiRequest     – mini postman (fetch z dowolną metodą)
//          - tools:clipboard:get  – odczytuje tekst + obraz ze schowka
//          - tools:getCookies     – pobiera cookies z sesji webview/default
// DEPENDS ON: electron (ipcMain, clipboard, nativeImage, session),
//             fs, path, js-yaml, sharp, logger.js
// =============================================================================

import { ipcMain, clipboard, session } from "electron";
import fs from "fs";
import path from "path";
import { logError } from "../utils/logger.js";

async function loadYaml() {
  try {
    return (await import("js-yaml")).default;
  } catch {
    return null;
  }
}

async function loadSharp() {
  try {
    return (await import("sharp")).default;
  } catch {
    return null;
  }
}

// ─── JSON / YAML Formatters ───────────────────────────────────────────────────

// tools:formatJSON – parsuje i formatuje JSON z wcięciem 2 spacji
ipcMain.handle("tools:formatJSON", async (_, text) => {
  try {
    const parsed = JSON.parse(text);
    const formatted = JSON.stringify(parsed, null, 2);
    return { ok: true, data: formatted };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

// tools:yamlToJson – konwertuje YAML → sformatowany JSON
ipcMain.handle("tools:yamlToJson", async (_, text) => {
  try {
    const yaml = await loadYaml();
    if (!yaml) return { ok: false, error: "YAML_MODULE_MISSING" };
    const parsed = yaml.load(text);
    const formatted = JSON.stringify(parsed, null, 2);
    return { ok: true, data: formatted };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

// tools:jsonToYaml – konwertuje JSON → YAML
ipcMain.handle("tools:jsonToYaml", async (_, text) => {
  try {
    const yaml = await loadYaml();
    if (!yaml) return { ok: false, error: "YAML_MODULE_MISSING" };
    const parsed = JSON.parse(text);
    const formatted = yaml.dump(parsed);
    return { ok: true, data: formatted };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

// ─── Regex Tester ─────────────────────────────────────────────────────────────

// tools:regexTest – testuje wzorzec regex na tekście, zwraca tablicę matches
ipcMain.handle("tools:regexTest", async (_, { pattern, flags, text }) => {
  try {
    const regex = new RegExp(pattern, flags || "");
    const matches = [...text.matchAll(regex)];
    return { ok: true, data: matches };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

// ─── Markdown Previewer ───────────────────────────────────────────────────────

// tools:markdownRender – renderuje Markdown → HTML przez marked
ipcMain.handle("tools:markdownRender", async (_, markdownText) => {
  try {
    const { marked } = await import("marked");
    const html = marked(markdownText);
    return { ok: true, data: html };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

// ─── Image Tools (sharp) ──────────────────────────────────────────────────────

// tools:image:resize – zmienia rozmiar obrazu do width x height
ipcMain.handle("tools:image:resize", async (_, { inputPath, width, height, outputPath }) => {
  try {
    const sharp = await loadSharp();
    if (!sharp) return { ok: false, error: "SHARP_MODULE_MISSING" };
    await sharp(inputPath).resize(width, height).toFile(outputPath);
    return { ok: true, data: outputPath };
  } catch (err) {
    logError("tools:image:resize failed", err);
    return { ok: false, error: err.message };
  }
});

// tools:image:convert – konwertuje obraz do podanego formatu
ipcMain.handle("tools:image:convert", async (_, { inputPath, format, outputPath }) => {
  try {
    const sharp = await loadSharp();
    if (!sharp) return { ok: false, error: "SHARP_MODULE_MISSING" };
    await sharp(inputPath).toFormat(format).toFile(outputPath);
    return { ok: true, data: outputPath };
  } catch (err) {
    logError("tools:image:convert failed", err);
    return { ok: false, error: err.message };
  }
});

// tools:image:compress – kompresuje JPEG do podanej jakości (1-100)
ipcMain.handle("tools:image:compress", async (_, { inputPath, quality, outputPath }) => {
  try {
    const sharp = await loadSharp();
    if (!sharp) return { ok: false, error: "SHARP_MODULE_MISSING" };
    await sharp(inputPath).jpeg({ quality }).toFile(outputPath);
    return { ok: true, data: outputPath };
  } catch (err) {
    logError("tools:image:compress failed", err);
    return { ok: false, error: err.message };
  }
});

// ─── SVG → PNG ────────────────────────────────────────────────────────────────

// tools:svgToPng – konwertuje plik SVG → PNG (przez sharp buffer)
ipcMain.handle("tools:svgToPng", async (_, { svgPath, outputPath, width, height }) => {
  try {
    const sharp = await loadSharp();
    if (!sharp) return { ok: false, error: "SHARP_MODULE_MISSING" };
    const svg = fs.readFileSync(svgPath, "utf8");
    const png = await sharp(Buffer.from(svg)).resize(width, height).png().toBuffer();
    fs.writeFileSync(outputPath, png);
    return { ok: true, data: outputPath };
  } catch (err) {
    logError("tools:svgToPng failed", err);
    return { ok: false, error: err.message };
  }
});

// ─── File Previewer ───────────────────────────────────────────────────────────

// tools:filePreview – odczytuje plik jako base64 + rozszerzenie
ipcMain.handle("tools:filePreview", async (_, filePath) => {
  try {
    if (!fs.existsSync(filePath)) throw new Error("FILE_NOT_FOUND");
    const ext = path.extname(filePath).toLowerCase();
    const buffer = fs.readFileSync(filePath);
    return { ok: true, data: { ext, base64: buffer.toString("base64") } };
  } catch (err) {
    logError("tools:filePreview failed", err);
    return { ok: false, error: err.message };
  }
});

// ─── Mini Postman ─────────────────────────────────────────────────────────────

// tools:apiRequest – wykonuje HTTP request i zwraca status + headers + body
ipcMain.handle("tools:apiRequest", async (_, { url, method, headers, body }) => {
  try {
    const res = await fetch(url, {
      method,
      headers,
      body: method !== "GET" && method !== "HEAD" ? body : undefined
    });
    const text = await res.text();
    return {
      ok: true,
      data: {
        status:  res.status,
        headers: Object.fromEntries(res.headers.entries()),
        body:    text
      }
    };
  } catch (err) {
    logError("tools:apiRequest failed", err);
    return { ok: false, error: err.message };
  }
});

// ─── Clipboard ────────────────────────────────────────────────────────────────

// tools:clipboard:get – odczytuje tekst i obraz ze schowka systemowego
ipcMain.handle("tools:clipboard:get", async () => {
  try {
    const text = clipboard.readText();
    const img = clipboard.readImage();
    return {
      ok: true,
      data: {
        text,
        image: img.isEmpty() ? null : img.toPNG().toString("base64")
      }
    };
  } catch (err) {
    logError("tools:clipboard:get failed", err);
    return { ok: false, error: err.message };
  }
});

// ─── Cookie Grabber ───────────────────────────────────────────────────────────

// tools:getCookies – pobiera cookies z sesji (partition lub defaultSession)
ipcMain.handle("tools:getCookies", async (_, partition) => {
  try {
    const ses = partition
      ? session.fromPartition(partition)
      : session.defaultSession;
    const cookies = await ses.cookies.get({});
    return { ok: true, data: cookies };
  } catch (err) {
    logError("tools:getCookies failed", err);
    return { ok: false, error: err.message };
  }
});

// =============================================================================
// END OF FILE
// =============================================================================
