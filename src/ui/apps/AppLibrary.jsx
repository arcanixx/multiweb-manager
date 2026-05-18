// =============================================================================
// FILE: AppLibrary.jsx
// PATH: src/ui/apps/AppLibrary.jsx
// VERSION: 0.0.3
// PURPOSE: Przeglądarka aplikacji (app-library.json) z kategoriami, filtrem,
//          sortowaniem alfabetycznym, komunikatem gdy brak aplikacji w kategorii.
// =============================================================================

import React, { useEffect, useState } from "react";
import { useTranslation } from "../../hooks/useTranslation";
import { ICONS } from "../../utils/icons";
import { APP_CATEGORIES } from "../../constants";

export default function AppLibrary({ onOpenApp }) {
  const { t } = useTranslation();
  const [apps, setApps] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      const res = await window.electronAPI.invoke("apps:getAll");
      if (res?.ok) setApps(res.data);
    }
    load();
  }, []);

  const filtered = apps
    .filter(app => {
      if (category !== "All" && app.category !== category) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        app.name.toLowerCase().includes(q) ||
        (app.description || "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const hasAppsInCategory = apps.some(
    app => category === "All" || app.category === category
  );

  return (
    <div className="app-library">
      <div className="app-library-header">
        <h2>{t("apps.title")}</h2>

        <div className="app-library-controls">
          <select
            className="form-select"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="All">{t("apps.category.all")}</option>
            {APP_CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>
                {t(cat.labelKey)}
              </option>
            ))}
          </select>

          <div className="app-library-search">
            <span className="icon">{ICONS.SEARCH}</span>
            <input
              className="form-input"
              placeholder={t("apps.search_placeholder")}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {!hasAppsInCategory && (
        <div className="app-library-empty">
          {t("apps.empty_for_category_line1")}
          <br />
          {t("apps.empty_for_category_line2")}
        </div>
      )}

      <div className="app-library-grid">
        {filtered.map(app => (
          <button
            key={app.id}
            className="app-card"
            onClick={() => onOpenApp && onOpenApp(app)}
          >
            <div className="app-card-icon">{ICONS.APP}</div>
            <div className="app-card-body">
              <div className="app-card-name">{app.name}</div>
              <div className="app-card-category">
                {t(`apps.category.${app.category}`, app.category)}
              </div>
              {app.description && (
                <div className="app-card-desc">{app.description}</div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// END OF FILE
// =============================================================================