// =============================================================================
// FILE: icons.js
// PATH: multiweb-manager/src/data/icons.js
// VERSION: v0.0.3
// PURPOSE: Centralny rejestr wszystkich ikon używanych w aplikacji.
// =============================================================================

export const ICONS = {
  // ─────────────── Ogólne akcje ───────────────
  PLUS: "➕",
  MINUS: "➖",
  EDIT: "✏️",
  DELETE: "🗑️",
  SAVE: "💾",
  COPY: "📋",
  CLOSE: "✖",
  CHECK: "✔",
  WARNING: "⚠️",
  INFO: "ℹ️",
  SEARCH: "🔍",
  EXPORT: "📤",
  IMPORT: "📥",
  DOWNLOAD: "⬇️",
  LINK: "🔗",
  REFRESH: "⟳",
  STAR: "⭐",
  FAVORITE: "❤️",
  PIN: "📌",
  UNPIN: "📍",
  EYE: "👁️",
  EYE_OFF: "🙈",
  FOLDER: "📁",
  FOLDER_ADD: "📂",
  FILE: "📄",
  DONE: "✅",
  COMMENT: "💬",
  BELL: "🔔",
  BELL_OFF: "🔕",
  LOCK: "🔒",
  UNLOCK: "🔓",
  DEFAULT: "🌐",

  // ─────────────── Nawigacja / UI ───────────────
  CHEVRON_DOWN: "▼",
  CHEVRON_UP: "▲",
  CHEVRON_RIGHT: "▶",
  CHEVRON_LEFT: "◀",
  DRAG: "⠿",
  COLLAPSE: "⊖",
  EXPAND: "⊕",
  MENU: "☰",
  BACK: "◀",
  FORWARD: "▶",

  // ─────────────── Przeglądarka / WebView ───────────────
  BROWSER: "🌐",
  ZOOM_IN: "🔎",
  ZOOM_OUT: "🔍",
  ZOOM_RESET: "🌀",
  DEVTOOLS: "🐞",
  CLEAR_CACHE: "🧹",
  FULLSCREEN: "⛶",
  TAB_NEW: "＋",
  SCREENSHOT: "📸",

  // ─────────────── Kafelki specjalne (Sidebar) ───────────────
  NOTEPAD: "📝",
  PROJECTMANAGER: "📁",
  REMOVEBG: "🖼️",
  STRINGCOMBINER: "🔗",
  TERMINAL: "💻",
  SETTINGS: "⚙️",
  HELP: "❓",
  AGGREGATEDTASKS: "✅",
  HISTORY: "📜",
  TASKS: "📋",
  UPDATE: "🔄",
  APPS: "🧩",
  TOOLS: "🛠️",

  // ─────────────── Motywy / Theme ───────────────
  THEME_LIGHT: "☀️",
  THEME_DARK: "🌙",
  THEME_SYSTEM: "🖥️",

  // ─────────────── Priorytety tasków ───────────────
  PRIORITY_A: "🔴",
  PRIORITY_B: "🟠",
  PRIORITY_C: "🟡",
  PRIORITY_D: "🔵",
  PRIORITY_E: "🟢",

  // ─────────────── Terminal ───────────────
  TERMINAL_RUN: "▶",
  TERMINAL_STOP: "■",
  TERMINAL_ADMIN: "🛡️",

  // ─────────────── Narzędzia ───────────────
  IMAGE: "🖼️",
  PROCESS: "⚡",
  FORMATTER: "🧹",
  REGEX: "🧬",
  MARKDOWN: "📘",
  PREVIEW: "👁️",
  POSTMAN: "📮",
  IMAGE_TOOLS: "🖌️",

  // ─────────────── Status / Sieć ───────────────
  ONLINE: "🟢",
  OFFLINE: "🔴",
  LOADING: "⏳",

  // ─────────────── Dev / Wersja ───────────────
  VERSION: "🏷️",
  DEBUG: "🐛",
  TEST: "🧪",
  TEST_PASS: "✅",
  TEST_FAIL: "❌"
};

// Mapa: ID specjalnego kafelka → klucz ICONS
export const SIDEBAR_ICON_MAP = {
  notepad: "NOTEPAD",
  projectManager: "PROJECTMANAGER",
  aggregatedTasks: "AGGREGATEDTASKS",
  history: "HISTORY",
  removebg: "REMOVEBG",
  stringCombiner: "STRINGCOMBINER",
  terminal: "TERMINAL",
  settings: "SETTINGS",
  help: "HELP"
};

// =============================================================================
// END OF FILE
// =============================================================================
