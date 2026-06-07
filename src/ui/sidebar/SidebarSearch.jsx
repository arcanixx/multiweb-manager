// =============================================================================
// FILE: SidebarSearch.jsx
// PATH: src/ui/sidebar/SidebarSearch.jsx
// VERSION: 0.0.3
// PURPOSE: Komponent paska wyszukiwania zintegrowany z SidebarHeader – filtrowanie profili i kategorii (tryb lokalny) oraz globalne wyszukiwanie notatek, zadań i projektów (tryb globalny).
// FUNCTIONS: SidebarSearch
// DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useContext, useEffect } from 'react';
import { logDebug } from '../../utils/loggerRenderer.js';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';

// ─── TYPE_LABELS – mapowanie typów wyników na etykiety i ikony
// UWAGA: Ta stała celowo pozostaje w tym pliku – używana wyłącznie tutaj.
const TYPE_LABELS = {
  profiles: { label: 'sidebar.search_type_profiles', icon: ICONS.BROWSER },
  projects: { label: 'sidebar.search_type_projects', icon: ICONS.PROJECTMANAGER },
  tasks:    { label: 'sidebar.search_type_tasks',    icon: ICONS.AGGREGATEDTASKS },
  notepad:    { label: 'sidebar.search_type_notepad',    icon: ICONS.NOTEPAD },
};

// ─── GlobalSearchResults() – wyświetla wyniki globalnego wyszukiwania pogrupowane wg typu
//   @param {Object}   props.results        – { profiles[], projects[], tasks[], notepad[] }
//   @param {boolean}  props.isSearching    – czy trwa ładowanie
//   @param {Function} props.onSelect       – callback wyboru wyniku { type, id, label }
//   @returns {JSX.Element|null}
function GlobalSearchResults({ results, isSearching, onSelect }) {
  const { t } = useContext(TranslationContext);

  if (isSearching) {
    return (
      <div style={{ padding: '8px 12px', fontSize: 11, color: 'var(--text-muted)' }}>
        {t('sidebar.search_searching')}…
      </div>
    );
  }

  if (!results) return null;

  const total = Object.values(results).reduce((s, a) => s + a.length, 0);
  if (total === 0) {
    return (
      <div style={{ padding: '8px 12px', fontSize: 11, color: 'var(--text-muted)' }}>
        {t('sidebar.search_no_results')}
      </div>
    );
  }

  return (
    <div style={{
      background: 'var(--bg-secondary)', border: '1px solid var(--border)',
      borderRadius: 6, marginTop: 4, maxHeight: 320, overflowY: 'auto',
    }}>
      {Object.entries(TYPE_LABELS).map(([type, { label, icon }]) => {
        const items = results[type] || [];
        if (!items.length) return null;
        return (
          <div key={type}>
            <div style={{ padding: '4px 10px', fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {icon} {t(label)}
            </div>
            {items.map(item => (
              <div
                key={`${type}-${item.id}`}
                onClick={() => onSelect?.({ type, id: item.id, label: item.label, sub: item.sub })}
                style={{
                  padding: '5px 12px', fontSize: 12, cursor: 'pointer',
                  color: 'var(--text-primary)',
                  borderTop: '1px solid var(--border-subtle)',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = ''}
              >
                <div style={{ fontWeight: 500 }}>{item.label}</div>
                {item.sub && (
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.sub}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ─── SidebarSearch() – wyszukiwarka z przełącznikiem trybu globalnego
//   @param {string}   props.value             – bieżąca wartość wyszukiwania
//   @param {Function} props.onChange           – callback zmiany wartości
//   @param {boolean}  props.globalEnabled      – czy tryb globalny włączony
//   @param {Function} props.onGlobalToggle     – callback przełączenia trybu globalnego
//   @param {Object}   props.globalResults      – wyniki globalnego wyszukiwania (lub null)
//   @param {boolean}  props.isGlobalSearching  – czy trwa globalne wyszukiwanie
//   @param {Function} props.onGlobalSelect     – callback wyboru wyniku globalnego
//   @returns {JSX.Element}
export default function SidebarSearch({
  value, onChange,
  globalEnabled, onGlobalToggle,
  globalResults, isGlobalSearching,
  onGlobalSelect,
}) {
  const { t } = useContext(TranslationContext);

  useEffect(() => { logDebug('ui', 'SidebarSearch mounted'); }, []);

  return (
    <div style={{ position: 'relative' }}>
      {/* ── Input wyszukiwania ── */}
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'var(--text-muted)' }}>
          {ICONS.SEARCH}
        </span>
        <input
          className="form-input"
          style={{ paddingLeft: 26, paddingRight: 32, fontSize: 12, height: 30, width: '100%' }}
          placeholder={globalEnabled ? t('sidebar.search_global_placeholder') : t('sidebar.search_placeholder')}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
        {/* ── Przycisk przełączenia trybu globalnego ── */}
        <button
          onClick={onGlobalToggle}
          title={globalEnabled ? t('sidebar.search_mode_local') : t('sidebar.search_mode_global')}
          style={{
            position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer', fontSize: 11,
            color: globalEnabled ? 'var(--accent)' : 'var(--text-muted)',
            padding: '0 2px',
          }}
        >
          {ICONS.SEARCH_GLOBAL}
        </button>
      </div>

      {/* ── Wyniki globalnego wyszukiwania ── */}
      {globalEnabled && value.trim() && (
        <GlobalSearchResults
          results={globalResults}
          isSearching={isGlobalSearching}
          onSelect={onGlobalSelect}
        />
      )}
    </div>
  );
}