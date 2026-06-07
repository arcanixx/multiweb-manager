// =============================================================================
// FILE: SidebarProfileList.jsx
// PATH: src/ui/sidebar/SidebarProfileList.jsx
// VERSION: 0.0.3
// PURPOSE: Lista profilów w sidebarze – favorites, kategorie, profil bez kategorii, z obsługą menu kontekstowego.
// FUNCTIONS: SidebarProfileList
// DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js, SidebarCategory, SidebarProfileItem, ContextMenu
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
import { logError } from '../../utils/loggerRenderer.js';
import SidebarCategory from './SidebarCategory';
import SidebarProfileItem from './SidebarProfileItem';
import ContextMenu from '../common/ContextMenu';

// ─── SidebarProfileList() – renderuje listę profilów z kategoriami i ulubionymi
// @param {Object} props
// @param {Array} props.favorites – ulubione profile
// @param {Object} props.byCategory – profile pogrupowane po kategoriach
// @param {Array} props.categories – lista obiektów kategorii
// @param {Object} props.collapsed – stan zwinięcia kategorii
// @param {Object} props.activeItem – aktywny element
// @param {Function} props.onSelect – callback wyboru profilu
// @param {Function} props.onToggleCollapse – callback przełączania zwinięcia
// @param {Function} props.onEditCategory – callback edycji kategorii
// @param {Function} props.onDeleteCategory – callback usuwania kategorii
// @param {Function} props.onEditProfile – callback edycji profilu
// @param {Function} props.onToggleFavorite – callback przełączania ulubionego
// @param {Function} props.onDeleteProfile – callback usuwania profilu
// @param {Function} props.onOpenTasks – callback otwarcia zadań profilu
// @returns {JSX.Element} – renderowana lista profili
export default function SidebarProfileList({
  favorites, byCategory, categories, collapsed,
  activeItem, onSelect,
  onToggleCollapse, onEditCategory, onDeleteCategory,
  onEditProfile, onToggleFavorite, onDeleteProfile, onOpenTasks
}) {
  const { t } = useContext(TranslationContext);
  const [contextMenu, setContextMenu] = useState(null);

  // ─── handleProfileContext() – menu kontekstowe dla profilu
  const handleProfileContext = (e, profile) => {
    try {
      e.preventDefault();
      const items = [
        { icon: ICONS.EDIT, label: t('sidebar.edit_profile'), action: () => onEditProfile(profile) },
        { icon: profile.favorite ? ICONS.UNPIN : ICONS.STAR, label: profile.favorite ? t('sidebar.unpin') : t('sidebar.pin'), action: () => onToggleFavorite(profile.id) },
        '---',
        { icon: ICONS.TASKS, label: t('sidebar.open_tasks'), action: () => onOpenTasks?.(profile) },
        '---',
        { icon: ICONS.DELETE, label: t('sidebar.delete_profile'), action: () => onDeleteProfile(profile.id), danger: true },
      ];
      setContextMenu({ x: e.clientX, y: e.clientY, items });
    } catch (err) {
      logError('ui', 'SidebarProfileList: profile context menu failed', err.message);
    }
  };

  // ─── handleCategoryContext() – menu kontekstowe dla kategorii
  const handleCategoryContext = (e, catObj) => {
    try {
      e.preventDefault();
      if (!catObj) return;
      setContextMenu({
        x: e.clientX, y: e.clientY,
        items: [
          { icon: ICONS.EDIT, label: t('sidebar.edit_category'), action: () => onEditCategory(catObj) },
          { icon: ICONS.DELETE, label: t('sidebar.delete_category'), action: () => onDeleteCategory(catObj.id), danger: true }
        ]
      });
    } catch (err) {
      logError('ui', 'SidebarProfileList: category context menu failed', err.message);
    }
  };

  // ─── renderProfile() – renderuje pojedynczy profil
  const renderProfile = (p) => {
    const isActive = activeItem?.id === p.id;
    return (
      <SidebarProfileItem
        key={p.id}
        profile={p}
        isActive={isActive}
        onSelect={() => onSelect({ ...p, type: 'webview' })}
        onContextMenu={(e) => handleProfileContext(e, p)}
      />
    );
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '6px 6px' }}>
      {/* ─── Sekcja ulubionych ─── */}
      {favorites.length > 0 && (
        <div>
          <div className="sidebar-category">{ICONS.STAR} {t('sidebar.favorites')}</div>
          {favorites.map(renderProfile)}
        </div>
      )}

      {/* ─── Profile pogrupowane po kategoriach ─── */}
      {Object.entries(byCategory).sort(([a], [b]) => a.localeCompare(b)).map(([catName, catProfiles]) => {
        const catObj = categories.find(c => c.name === catName);
        const catId = catObj?.id || catName;
        const isCollapsed = collapsed[catId];
        return (
          <div key={catName}>
            <SidebarCategory
              name={catName}
              icon={catObj?.icon || ICONS.FOLDER}
              isCollapsed={isCollapsed}
              onToggle={() => onToggleCollapse(catId)}
              onContextMenu={(e) => handleCategoryContext(e, catObj)}
            />
            {!isCollapsed && catProfiles.map(renderProfile)}
          </div>
        );
      })}

      {/* ─── Menu kontekstowe ─── */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}