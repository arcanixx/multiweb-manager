// =============================================================================
// FILE: Sidebar.jsx
// PATH: src/ui/sidebar/Sidebar.jsx
// VERSION: 0.0.3
// PURPOSE: Główny panel boczny – nawigacja, profile, kategorie, narzędzia
// FUNCTIONS: Sidebar
// DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js, ProfileModal, CategoryModal, ContextMenu, SidebarSearch, SidebarCategory, SidebarProfileItem, SidebarTools, SidebarWorkspaces
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useEffect, useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
import { log } from '../../utils/loggerRenderer.js';
import ProfileModal from './ProfileModal';
import CategoryModal from './CategoryModal';
import ContextMenu from './ContextMenu';
import SidebarSearch from './SidebarSearch';
import SidebarCategory from './SidebarCategory';
import SidebarProfileItem from './SidebarProfileItem';
import SidebarTools from './SidebarTools';
import SidebarWorkspaces from './SidebarWorkspaces';
export default function Sidebar({ profiles, onSelect, activeItem, onProfilesChange, onOpenTaskPanel, onModalOpenChange }) {
  const { t } = useContext(TranslationContext);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [collapsed, setCollapsed] = useState({});
  const [toolsCollapsed, setToolsCollapsed] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const modalOpen = showProfileModal || showCategoryModal;
  useEffect(() => onModalOpenChange?.(modalOpen), [modalOpen, onModalOpenChange]);
  useEffect(() => {
    window.electronAPI.getSettings().then(s => {
      setCategories(s.categories || []);
      setCollapsed(s.collapsedCategories || {});
    });
  }, []);
  const saveCategories = (cats, cols = collapsed) => {
    setCategories(cats);
    window.electronAPI.saveSettings({ categories: cats, collapsedCategories: cols });
  };
  const saveProfiles = (newProfiles) => {
    onProfilesChange(newProfiles);
    window.electronAPI.saveProfiles(newProfiles);
  };

  const handleAddProfile = () => {
    setEditingProfile(null);
    setShowProfileModal(true);
  };

  const handleSaveProfile = (profileData) => {
    const exists = profiles.find(p => p.id === profileData.id);
    const newProfiles = exists
      ? profiles.map(p => p.id === profileData.id ? profileData : p)
      : [...profiles, profileData];
    saveProfiles(newProfiles);
    setShowProfileModal(false);
    onSelect({ ...profileData, type: 'webview' });
    if (!exists) window.electronAPI.addHistory({ profileName: profileData.name, url: profileData.url });
  };

  const toggleFavorite = (profileId) => {
    saveProfiles(profiles.map(p => p.id === profileId ? { ...p, favorite: !p.favorite } : p));
  };

  const deleteProfile = (profileId) => {
    if (!window.confirm('Czy na pewno usunąć ten profil?')) return;
    saveProfiles(profiles.filter(p => p.id !== profileId));
  };

  const toggleCollapse = (catId) => {
    const newCollapsed = { ...collapsed, [catId]: !collapsed[catId] };
    setCollapsed(newCollapsed);
    saveCategories(categories, newCollapsed);
  };

  const handleContext = (e, profile) => {
    e.preventDefault();
    const items = [
      { icon: ICONS.EDIT, label: t('sidebar.edit_profile'), action: () => { setEditingProfile(profile); setShowProfileModal(true); } },
      { icon: profile.favorite ? ICONS.UNPIN : ICONS.STAR, label: profile.favorite ? t('sidebar.unpin') : t('sidebar.pin'), action: () => toggleFavorite(profile.id) },
      '---',
      { icon: ICONS.TASKS, label: t('sidebar.open_tasks'), action: () => onOpenTaskPanel?.(profile) },
      '---',
      { icon: ICONS.DELETE, label: t('sidebar.delete_profile'), action: () => deleteProfile(profile.id), danger: true },
    ];
    setContextMenu({ x: e.clientX, y: e.clientY, items });
  };

  const searchLower = search.toLowerCase();
  const filtered = profiles.filter(p => !search || p.name.toLowerCase().includes(searchLower) || (p.category || '').toLowerCase().includes(searchLower));
  const favorites = filtered.filter(p => p.favorite);
  const byCategory = {};
  filtered.filter(p => !p.favorite).forEach(p => { const cat = p.category || ''; if (!byCategory[cat]) byCategory[cat] = []; byCategory[cat].push(p); });

  const renderProfile = (p) => {
    const isActive = activeItem?.id === p.id;
    return <SidebarProfileItem key={p.id} profile={p} isActive={isActive} onSelect={() => onSelect({ ...p, type: 'webview' })} onContextMenu={(e) => handleContext(e, p)} />;
  };

  return (
    <div style={{ width: 'var(--sidebar-width)', minWidth: 200, maxWidth: 280, background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', height: '100vh', flexShrink: 0 }}>
      <div style={{ padding: '12px 10px 8px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 8 }}>
          <button className="btn btn-primary" style={{ flex: 1, fontSize: 12 }} onClick={handleAddProfile}>{ICONS.PLUS} {t('sidebar.add_profile')}</button>
          <button className="btn-icon" onClick={() => { setEditingCategory(null); setShowCategoryModal(true); }} title={t('sidebar.add_category')}>{ICONS.FOLDER_ADD}</button>
        </div>
        <SidebarSearch value={search} onChange={setSearch} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 6px' }}>
        {favorites.length > 0 && (
          <div>
            <div className="sidebar-category">{ICONS.STAR} {t('sidebar.favorites')}</div>
            {favorites.map(renderProfile)}
          </div>
        )}

        {Object.entries(byCategory).sort(([a], [b]) => a.localeCompare(b)).map(([catName, catProfiles]) => {
          const catObj = categories.find(c => c.name === catName);
          const catId = catObj?.id || catName;
          const isCollapsed = collapsed[catId];
          return (
            <div key={catName}>
              <SidebarCategory name={catName} icon={catObj?.icon || ICONS.FOLDER} isCollapsed={isCollapsed}
                onToggle={() => toggleCollapse(catId)} onContextMenu={(e) => {
                  e.preventDefault();
                  if (catObj) setContextMenu({ x: e.clientX, y: e.clientY, items: [
                    { icon: ICONS.EDIT, label: t('sidebar.edit_category'), action: () => { setEditingCategory(catObj); setShowCategoryModal(true); } },
                    { icon: ICONS.DELETE, label: t('sidebar.delete_category'), action: () => saveCategories(categories.filter(c => c.id !== catObj.id)), danger: true }
                  ]});
                }} />
              {!isCollapsed && catProfiles.map(renderProfile)}
            </div>
          );
        })}

        {byCategory['']?.length > 0 && (
          <div>
            <div className="sidebar-category">{ICONS.FOLDER} {t('sidebar.all_workspaces') || t('sidebar.all_profiles')}</div>
            {byCategory[''].map(renderProfile)}
          </div>
        )}

        <div style={{ height: 1, background: 'var(--border)', margin: '10px 4px' }} />
        <div className="sidebar-category" onClick={() => setToolsCollapsed(c => !c)}>
          <span>{ICONS.SETTINGS}</span><span style={{ flex: 1 }}>{t('sidebar.special')}</span>
          <span style={{ fontSize: 10 }}>{toolsCollapsed ? ICONS.CHEVRON_RIGHT : ICONS.CHEVRON_DOWN}</span>
        </div>
        {!toolsCollapsed && <SidebarTools activeItem={activeItem} onSelect={onSelect} />}
      </div>

      {showProfileModal && <ProfileModal profile={editingProfile} categories={categories} onSave={handleSaveProfile} onClose={() => setShowProfileModal(false)} />}
      {showCategoryModal && <CategoryModal category={editingCategory} onSave={(cat) => { const exists = categories.find(c => c.id === cat.id); saveCategories(exists ? categories.map(c => c.id === cat.id ? cat : c) : [...categories, cat]); setShowCategoryModal(false); }} onClose={() => setShowCategoryModal(false)} />}
      {contextMenu && <ContextMenu x={contextMenu.x} y={contextMenu.y} items={contextMenu.items} onClose={() => setContextMenu(null)} />}
    </div>
  );
}