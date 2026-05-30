// =============================================================================
// FILE: searchIndex.js
// PATH: src/utils/searchIndex.js
// VERSION: 0.0.3
// PURPOSE: Unified search (Ctrl+K) — indeks profili, projektów, zadań, notatek.
// FUNCTIONS: buildSearchIndex, searchAll
// DEPENDS ON: logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { logDebug } from "./logger.js";

// ─── buildSearchIndex() – TODO: opis funkcji
export function buildSearchIndex({ profiles = [], projects = [], tasks = [], notes = [] }) {
  return {
    profiles: profiles.map((p) => ({
      type: "profile",
      id: p.id,
      label: p.name,
      sub: p.url
    })),
    projects: projects.map((p) => ({
      type: "project",
      id: p.id,
      label: p.name,
      sub: p.description || ""
    })),
    tasks: tasks.map((t) => ({
      type: "task",
      id: t.id,
      label: t.title,
      sub: t.description || ""
    })),
    notes: notes.map((n) => ({
      type: "note",
      id: n.id,
      label: n.title,
      sub: (n.content || "").slice(0, 80)
    }))
  };
}
// ─── match() – TODO: opis funkcji
function match(text, q) {
  return String(text || "").toLowerCase().includes(q);
}
// ─── searchAll() – TODO: opis funkcji
export function searchAll(index, query) {
  const q = String(query || "").toLowerCase().trim();
  if (!q) return { profiles: [], projects: [], tasks: [], notes: [] };
  logDebug("searchIndex.searchAll", q);
  // ─── filter() – TODO: opis funkcji
  const filter = (items) =>
    items.filter((i) => match(i.label, q) || match(i.sub, q));
  return {
    profiles: filter(index.profiles || []),
    projects: filter(index.projects || []),
    tasks: filter(index.tasks || []),
    notes: filter(index.notes || [])
  };
}
