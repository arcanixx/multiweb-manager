// =============================================================================
// FILE: persistence.js
// PATH: src/core/persistence.js
// VERSION: 0.0.3
// PURPOSE: Wspólny odczyt/zapis plików JSON w userData (store Electron).
// FUNCTIONS: readJsonFile, writeJsonFile, getUserDataPath
// DEPENDS ON: fs, path, electron (app), logger.js
// =============================================================================

import fs from "fs";
import path from "path";
import { app } from "electron";
import { logError } from "../utils/logger.js";

export function getUserDataPath(...segments) {
  return path.join(app.getPath("userData"), ...segments);
}

export function readJsonFile(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    logError("persistence.readJsonFile", { filePath, err });
    return fallback;
  }
}

export function writeJsonFile(filePath, data) {
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (err) {
    logError("persistence.writeJsonFile", { filePath, err });
    return false;
  }
}
