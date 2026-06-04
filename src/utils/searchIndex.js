// =============================================================================
// FILE: searchIndex.js
// PATH: src/utils/searchIndex.js
// VERSION: 0.0.3
// PURPOSE: Budowanie ujednoliconego indeksu wyszukiwania (profiles, projects, tasks, notes) dla globalnej palety komend (Ctrl+K) i globalnego wyszukiwania w sidebarze.
// FUNCTIONS: buildSearchIndex, searchAll
// DEPENDS ON: logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

// WAŻNE: Indeks jest budowany on-demand przy każdym zapytaniu (search:global IPC).
//        Nie jest cache'owany – dane w store'ach mogą się zmienić między zapytaniami.
//        Gdyby wydajność stała się problemem: dodać cache z TTL i inwalidację
//        przez EventEmitter w store'ach (notepadStore, tasksStore, projectsStore).

import { logDebug } from "./logger.js";

// ─── buildSearchIndex() – Buduje ujednolicony indeks wyszukiwania ze wszystkich zasobów (profile, projekty, zadania, notatki), mapując je do wspólnego formatu {type, id, label, sub}
//   @param {Object} – obiekt z tablicami profiles, projects, tasks, notes
//   @returns {Object} – indeks z czterema pogrupowanymi tablicami wynikow
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
// ─── match() – Sprawdza, czy podany tekst zawiera query (case-insensitive); używana jako predykat w filter()
//   @param {string} text – tekst do przeszukania
//   @param {string} q – fraza wyszukiwania (małe litery)
//   @returns {boolean}
function match(text, q) {
  return String(text || "").toLowerCase().includes(q);
}
// ─── searchAll() – Przeszukuje wszystkie grupy indeksu wg zapytania i zwraca pasujące wyniki; pusta fraza zwraca puste tablice
//   @param {Object} index – indeks zwrócony przez buildSearchIndex()
//   @param {string} query – fraza wyszukiwania
//   @returns {Object} – obiekt z przefiltrowanymi tablicami profiles, projects, tasks, notes
export function searchAll(index, query) {
  const q = String(query || "").toLowerCase().trim();
  if (!q) return { profiles: [], projects: [], tasks: [], notes: [] };
  logDebug("ui", "searchIndex.searchAll", q);
  
  // ─── filter() – Filtruje elementy indeksu sprawdzając wystąpienie query w pólach label lub sub
  const filter = (items) =>
    items.filter((i) => match(i.label, q) || match(i.sub, q));
  return {
    profiles: filter(index.profiles || []),
    projects: filter(index.projects || []),
    tasks: filter(index.tasks || []),
    notes: filter(index.notes || [])
  };
}
