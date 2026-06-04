// =============================================================================
// FILE: AppLibraryBrowser.jsx
// PATH: src/ui/appLibrary/AppLibraryBrowser.jsx
// VERSION: 0.0.3
// PURPOSE: Główny widok biblioteki aplikacji (App Library) – przeglądanie skatalogowanych usług webowych, wyszukiwanie i dodawanie do profili. Komunikacja przez hook IPC useAppLibrary.
// FUNCTIONS: AppLibraryBrowser
// DEPENDS ON: react, config.js, useAppLibrary.js, translations.js, loggerRenderer.js, icons.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useEffect, useContext } from 'react';
import { isFeatureEnabled } from '../../config.js';
import { useAppLibrary } from '../../hooks/useAppLibrary.js';
import { TranslationContext } from '../../utils/translations.js';
import { logDebug, logInfo } from '../../utils/loggerRenderer.js';
import { ICONS } from '../../utils/icons.js';

// ─── AppIcon() – ikona aplikacji z fallbackiem na ikonę domyślną przy błędzie ładowania
//   @param {string} icon – URL ikony aplikacji (może być niedostępny lub null)
//   @returns {JSX.Element}
function AppIcon({ icon }) {
  const [hasError, setHasError] = useState(false);
  if (!icon || hasError) return <span>{ICONS.DEFAULT}</span>;
  return (
    <img
      src={icon}
      alt=""
      onError={() => setHasError(true)}
    />
  );
}

// ─── AppLibraryBrowser() – komponent przeglądarki aplikacji z kategoriami i wyszukiwarką
//   @param {Object} props – właściwości komponentu
//   @param {Function} props.onAddProfile – callback dodawania profilu
//   @returns {JSX.Element} – renderowany komponent
export default function AppLibraryBrowser({ onAddProfile }) {
  const { t } = useContext(TranslationContext);

  // ─── hooki (WSZYSTKIE przed warunkami feature flag – zasada .clinerules)
  const { categories, loading, search, searchResults } = useAppLibrary();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // ─── feature flag PO wszystkich hookach
  if (!isFeatureEnabled('appLibrary')) return null;

  // ─── useEffect – wyszukiwanie przez IPC przy zmianie zapytania
  useEffect(() => {
    search(searchQuery);
    if (searchQuery) setSelectedCategory(null);
  }, [searchQuery]);

  // ─── handleCategoryClick() – ustawia aktywną kategorię i resetuje wyszukiwanie
  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchQuery('');
    logInfo('ui', `AppLibraryBrowser: category selected ${categoryId}`);
  };

  // ─── handleAddApp() – przekazuje aplikację do callbacku onAddProfile
  const handleAddApp = (app) => {
    logDebug('ui', `AppLibraryBrowser: adding app ${app.name}`);
    onAddProfile?.(app);
  };

  // ─── renderAppCard() – renderuje kartę pojedynczej aplikacji
  const renderAppCard = (app, categoryId) => (
    <div key={app.id} className="app-card">
      <div className="app-card-icon">
        <AppIcon icon={app.icon} />
      </div>
      <div className="app-card-info">
        <h3>{app.name}</h3>
        <p className="app-card-url">{app.url}</p>
      </div>
      <button onClick={() => handleAddApp({ ...app, categoryId })} className="btn-primary">
        {ICONS.PLUS} {t('appLibrary.add')}
      </button>
    </div>
  );

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  return (
    <div className="app-library-browser">
      <h1>{ICONS.APP_LIBRARY} {t('appLibrary.title')}</h1>

      <div className="app-library-search">
        <input
          type="text"
          placeholder={t('appLibrary.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && <span className="search-icon">{ICONS.SEARCH}</span>}
      </div>

      {searchQuery && searchResults.length > 0 && (
        <div className="app-library-results">
          <h2>{t('appLibrary.searchResults')} ({searchResults.length})</h2>
          <div className="apps-grid">
            {searchResults.map(app => renderAppCard(app, app.categoryId))}
          </div>
        </div>
      )}

      {!searchQuery && (
        <div className="app-library-categories">
          {categories.map(category => (
            <div key={category.id} className="app-category">
              <div
                className="app-category-header"
                onClick={() => handleCategoryClick(category.id)}
              >
                <span className="category-icon">{category.icon || ICONS.FOLDER}</span>
                <h2>{category.label}</h2>
                <span className="category-count">({category.apps?.length || 0})</span>
              </div>

              {(selectedCategory === category.id || !selectedCategory) && (
                <div className="apps-grid">
                  {category.apps?.map(app => renderAppCard(app, category.id))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {searchQuery && searchResults.length === 0 && (
        <div className="no-results">
          {ICONS.SEARCH} {t('appLibrary.noResults')}
        </div>
      )}
    </div>
  );
}
