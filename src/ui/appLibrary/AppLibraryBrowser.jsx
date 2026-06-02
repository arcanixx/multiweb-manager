// =============================================================================
// FILE: AppLibraryBrowser.jsx
// PATH: src/ui/appLibrary/AppLibraryBrowser.jsx
// VERSION: 0.0.3
// PURPOSE: Główny widok biblioteki aplikacji (App Library) – umożliwia przeglądanie skatalogowanych usług webowych, ich wyszukiwanie oraz szybkie dodawanie do profili użytkownika. Współpracuje z appLibraryStore.
// FUNCTIONS: AppLibraryBrowser
// DEPENDS ON: react, config.js, translations.js, loggerRenderer, icons, appLibraryStore
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useEffect } from 'react';
import { isFeatureEnabled } from '../../config.js';
import { TranslationContext } from '../../utils/translations.js';
import { logDebug, logError, logInfo, logWarn } from '../../utils/loggerRenderer';
import { ICONS } from '../../utils/icons';

import { loadAppLibrary, searchAppLibrary, getAppsByCategory } from '../../core/appLibraryStore'; // getAppsByCategory to helper do filtrowania aplikacji po kategorii, loadAppLibrary i searchAppLibrary to funkcje do pobierania danych z appLibraryStore

// ─── AppLibraryBrowser() – komponent przeglądarki aplikacji z kategoriami i wyszukiwarką
//   @param {Object} props – właściwości komponentu
//   @param {Function} props.onAddProfile – callback dodawania profilu
//   @returns {JSX.Element} – renderowany komponent
export default function AppLibraryBrowser({ onAddProfile }) {
  const { t } = React.useContext(TranslationContext);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // ─── useEffect – ładowanie biblioteki aplikacji przy montowaniu
  useEffect(() => {
    try {
      const lib = loadAppLibrary();
      setCategories(lib);
      logDebug('ui', `AppLibraryBrowser: loaded ${lib.length} categories`);
      logInfo('ui', 'AppLibraryBrowser: library loaded successfully');
    } catch (err) {
      logError('ui', 'AppLibraryBrowser: failed to load library', err.message);
      logWarn('ui', 'Nie można załadować biblioteki aplikacji');
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── useEffect – wyszukiwanie aplikacji przy zmianie zapytania
  useEffect(() => {
    if (searchQuery.trim()) {
      try {
        const results = searchAppLibrary(searchQuery);
        setSearchResults(results);
        setSelectedCategory(null);
        logInfo('ui', `AppLibraryBrowser: found ${results.length} results for "${searchQuery}"`);
      } catch (err) {
        logError('ui', 'AppLibraryBrowser: search failed', err.message);
        logWarn('ui', 'Wystąpił błąd podczas wyszukiwania aplikacji');
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  if (!isFeatureEnabled("appLibrary")) return null;

  // ─── handleCategoryClick() – Obsługuje zdarzenie kliknięcia kategorii aplikacji; ustawia wybraną kategorię jako aktywny filtr i resetuje pole wyszukiwania
  //   @param {string} categoryId – identyfikator kategorii
  //   @returns {void}
  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchQuery('');
    logInfo('ui', `AppLibraryBrowser: category selected ${categoryId}`);
  };

  // ─── handleAddApp() – Obsługuje dodawanie wybranej aplikacji z biblioteki do profili użytkownika poprzez wywołanie zewnętrznego callbacku onAddProfile
  const handleAddApp = (app) => {
    logDebug('ui', `AppLibraryBrowser: adding app ${app.name}`);
    onAddProfile?.(app);
  };

  // ─── renderAppCard() – Funkcja pomocnicza renderująca kartę graficzną aplikacji (nazwę, URL, ikonę oraz przycisk dodawania) w strukturze JSX
  const renderAppCard = (app, categoryId) => (
    <div key={app.id} className="app-card">
      <div className="app-card-icon">
        {app.icon ? <img src={app.icon} alt="" /> : <span>{ICONS.DEFAULT}</span>}
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