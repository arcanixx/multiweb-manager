// =============================================================================
// FILE: constants.js
// PATH: src/constants.js
// VERSION: 0.0.3
// PURPOSE: Application-wide constants and enums (tasks, app categories, etc.)
// FUNCTIONS: -
// DEPENDS ON: -
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

// Priorytety zadań
export const TASK_PRIORITIES = ["A", "B", "C", "D", "E"];
// Statusy zadań
export const TASK_STATUS = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  DONE: "done",
  BLOCKED: "blocked"
};
// Kategorie aplikacji — mapa ID → label (angielski opis techniczny)
export const APP_CATEGORIES_MAP = {
  AI: "Artificial Intelligence",
  MESSAGING: "Messaging",
  SOCIAL: "Social & Communities",
  GOOGLE: "Google Services",
  MICROSOFT: "Microsoft Services",
  APPLE: "Apple Ecosystem",
  PRODUCTIVITY: "Productivity",
  DEVELOPMENT: "Development",
  IDE: "IDEs & Code Editors",
  CLOUD: "Cloud & Storage",
  EMAIL: "Email",
  CALENDAR: "Calendar",
  PROJECT_MANAGEMENT: "Project Management",
  TASK_MANAGEMENT: "Task Management",
  NOTES: "Notes & Writing",
  STREAMING: "Streaming",
  MUSIC: "Music",
  FINANCE: "Finance & Banking",
  ECOMMERCE: "eCommerce",
  ADVERTISING: "Advertising & Marketing",
  EDUCATION: "Education & Learning",
  PROTON: "Proton Services",
  ZOHO: "Zoho Suite",
  OTHER: "Other"
};

// ---------------------------------------------------------------------------
// SIDEBAR_ICON_MAP – mapowanie ID kafelka na klucz ICONS
// ---------------------------------------------------------------------------
export const SIDEBAR_ICON_MAP = {
  notepad:        "NOTEPAD",
  projectManager: "PROJECTMANAGER",
  aggregatedTasks: "AGGREGATEDTASKS",
  history:        "HISTORY",
  removebg:       "REMOVEBG",
  stringCombiner: "STRINGCOMBINER",
  terminal:       "TERMINAL",
  settings:       "SETTINGS",
  help:           "HELP",
  appLibrary:     "APP_LIBRARY",
  tools:          "TOOLS"
};

// Kategorie aplikacji — lista ID
export const APP_CATEGORIES_LIST = Object.keys(APP_CATEGORIES_MAP);
// Kategorie aplikacji — tablica z id + kluczem do i18n
export const APP_CATEGORIES = APP_CATEGORIES_LIST.map(id => ({
  id,
  labelKey: `apps.category.${id}`
}));