// =============================================================================
// FILE: ipcMainHandlers_webview.js
// PATH: src/ipc/ipcMainHandlers_webview.js
// VERSION: v1.0
// PURPOSE: IPC dla WebView / Browser Engine
//          - nawigacja
//          - odświeżanie
//          - pobieranie URL
//          - screenshot WebView
//          - cache / cookies
//          - userAgent
//          - Single App Mode
//          - Resource Monitor
//          - Sleep Tabs
// =============================================================================

import { ipcMain, BrowserWindow, nativeImage } from "electron";
import { logError } from "../utils/logger.js";
import { FEATURES, DEFAULT_SETTINGS } from "../../config.js";

// =============================================================================
// HELPER: znajdź WebContents po ID
// =============================================================================

function getWebContentsById(id) {
  try {
    return BrowserWindow.getAllWindows()
      .flatMap((win) => win.webContents.getAllWebContents())
      .find((wc) => wc.id === id);
  } catch {
    return null;
  }
}

// =============================================================================
// NAVIGATION
// =============================================================================

ipcMain.handle("webview:navigate", async (_, { id, url }) => {
  try {
    const wc = getWebContentsById(id);
    if (!wc) throw new Error("WEBVIEW_NOT_FOUND");
    await wc.loadURL(url);
    return { ok: true };
  } catch (err) {
    logError("webview:navigate failed", err);
    return { ok: false, error: err.message };
  }
});

ipcMain.handle("webview:reload", async (_, id) => {
  try {
    const wc = getWebContentsById(id);
    if (!wc) throw new Error("WEBVIEW_NOT_FOUND");
    wc.reload();
    return { ok: true };
  } catch (err) {
    logError("webview:reload failed", err);
    return { ok: false, error: err.message };
  }
});

ipcMain.handle("webview:goBack", async (_, id) => {
  try {
    const wc = getWebContentsById(id);
    if (!wc) throw new Error("WEBVIEW_NOT_FOUND");
    if (wc.canGoBack()) wc.goBack();
    return { ok: true };
  } catch (err) {
    logError("webview:goBack failed", err);
    return { ok: false, error: err.message };
  }
});

ipcMain.handle("webview:goForward", async (_, id) => {
  try {
    const wc = getWebContentsById(id);
    if (!wc) throw new Error("WEBVIEW_NOT_FOUND");
    if (wc.canGoForward()) wc.goForward();
    return { ok: true };
  } catch (err) {
    logError("webview:goForward failed", err);
    return { ok: false, error: err.message };
  }
});

// =============================================================================
// GET CURRENT URL
// =============================================================================

ipcMain.handle("webview:getURL", async (_, id) => {
  try {
    const wc = getWebContentsById(id);
    if (!wc) throw new Error("WEBVIEW_NOT_FOUND");
    return { ok: true, data: wc.getURL() };
  } catch (err) {
    logError("webview:getURL failed", err);
    return { ok: false, error: err.message };
  }
});

// =============================================================================
// SCREENSHOT WEBVIEW
// =============================================================================

ipcMain.handle("webview:screenshot", async (_, id) => {
  try {
    if (!FEATURES.screenshotWebView) throw new Error("FEATURE_DISABLED");

    const wc = getWebContentsById(id);
    if (!wc) throw new Error("WEBVIEW_NOT_FOUND");

    const image = await wc.capturePage();
    const png = image.toPNG();

    return { ok: true, data: png };
  } catch (err) {
    logError("webview:screenshot failed", err);
    return { ok: false, error: err.message };
  }
});

// =============================================================================
// CLEAR CACHE
// =============================================================================

ipcMain.handle("webview:clearCache", async (_, id) => {
  try {
    const wc = getWebContentsById(id);
    if (!wc) throw new Error("WEBVIEW_NOT_FOUND");

    await wc.session.clearCache();
    return { ok: true };
  } catch (err) {
    logError("webview:clearCache failed", err);
    return { ok: false, error: err.message };
  }
});

// =============================================================================
// COOKIES
// =============================================================================

ipcMain.handle("webview:getCookies", async (_, partition) => {
  try {
    const ses = partition
      ? session.fromPartition(partition)
      : session.defaultSession;

    const cookies = await ses.cookies.get({});
    return { ok: true, data: cookies };
  } catch (err) {
    logError("webview:getCookies failed", err);
    return { ok: false, error: err.message };
  }
});

// =============================================================================
// USER AGENT
// =============================================================================

ipcMain.handle("webview:setUserAgent", async (_, { id, userAgent }) => {
  try {
    const wc = getWebContentsById(id);
    if (!wc) throw new Error("WEBVIEW_NOT_FOUND");

    wc.setUserAgent(userAgent || DEFAULT_SETTINGS.defaultUserAgent);
    return { ok: true };
  } catch (err) {
    logError("webview:setUserAgent failed", err);
    return { ok: false, error: err.message };
  }
});

// =============================================================================
// SINGLE APP MODE
// =============================================================================

ipcMain.handle("webview:openInWindow", async (_, { url, userAgent }) => {
  try {
    if (!FEATURES.singleAppMode) throw new Error("FEATURE_DISABLED");

    const win = new BrowserWindow({
      width: 1200,
      height: 800,
      backgroundColor: "#1e1e1e",
      webPreferences: {
        preload: require("path").join(__dirname, "../preload.js"),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
        webviewTag: false,
        spellcheck: false
      }
    });

    if (userAgent) win.webContents.setUserAgent(userAgent);

    await win.loadURL(url);

    return { ok: true };
  } catch (err) {
    logError("webview:openInWindow failed", err);
    return { ok: false, error: err.message };
  }
});

// =============================================================================
// RESOURCE MONITOR
// =============================================================================

ipcMain.handle("webview:getUsage", async (_, id) => {
  try {
    if (!FEATURES.resourceMonitor) throw new Error("FEATURE_DISABLED");

    const wc = getWebContentsById(id);
    if (!wc) throw new Error("WEBVIEW_NOT_FOUND");

    const mem = wc.getResourceUsage();
    return { ok: true, data: mem };
  } catch (err) {
    logError("webview:getUsage failed", err);
    return { ok: false, error: err.message };
  }
});

// =============================================================================
// SLEEP TABS
// =============================================================================

ipcMain.handle("webview:sleep", async (_, id) => {
  try {
    if (!FEATURES.sleepTabs) throw new Error("FEATURE_DISABLED");

    const wc = getWebContentsById(id);
    if (!wc) throw new Error("WEBVIEW_NOT_FOUND");

    wc.setAudioMuted(true);
    wc.stop();
    return { ok: true };
  } catch (err) {
    logError("webview:sleep failed", err);
    return { ok: false, error: err.message };
  }
});

ipcMain.handle("webview:wake", async (_, id) => {
  try {
    if (!FEATURES.sleepTabs) throw new Error("FEATURE_DISABLED");

    const wc = getWebContentsById(id);
    if (!wc) throw new Error("WEBVIEW_NOT_FOUND");

    wc.reload();
    wc.setAudioMuted(false);
    return { ok: true };
  } catch (err) {
    logError("webview:wake failed", err);
    return { ok: false, error: err.message };
  }
});

// =============================================================================
// END OF FILE
// =============================================================================
