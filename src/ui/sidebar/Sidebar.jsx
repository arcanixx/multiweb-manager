// =============================================================================
// FILE: Sidebar.jsx
// PATH: src/ui/sidebar/Sidebar.jsx
// VERSION: 0.0.3
// PURPOSE: Główny sidebar – nawigacja między modułami:
//          WebView, TaskPanel, Notepad, Tools, AppLibrary, Help, Settings.
// PURPOSE: Lewy panel nawigacyjny. Wyświetla profile pogrupowane w kategorie
//          (zwijane/rozwijane), ulubione, narzędzia specjalne. Obsługuje:
//          - dodawanie/edycję profili przez modal
//          - dodawanie/edycję kategorii przez modal
//          - szukanie profili
//          - przypinanie do ulubionych
//          - menu kontekstowe (PPM) na profilu
// DEPENDS ON: icons.js, useTranslation.js, logger.js
// FUNCTIONS: addProfile, editProfile, deleteProfile, addCategory,
//            editCategory, toggleCategory, toggleFavorite, handleSelect
// =============================================================================

import React, { useState, useRef, useEffect } from 'react';
import { ICONS, SIDEBAR_ICON_MAP } from '../../utils/icons';
import { useTranslation } from '../../hooks/useTranslation';
import { log } from '../../utils/loggerRenderer';
import ModalPortal from '../system/ModalPortal';
import { normalizeWebUrl } from '../../utils/urlUtils';

// Stałe narzędzia specjalne – kolejność zawsze ta sama, nad alfabetyczną listą
const SPECIAL_TOOLS = [
  { id: 'notepad',         labelKey: 'notepad.title'         },
  { id: 'projectManager',  labelKey: 'projectManager.title'  },
  { id: 'aggregatedTasks', labelKey: 'aggregatedTasks.title' },
  { id: 'history',         labelKey: 'history.title'         },
  { id: 'removebg',        labelKey: 'removebg.title'        },
  { id: 'stringCombiner',  labelKey: 'stringCombiner.title'  },
  { id: 'terminal',        labelKey: 'terminal.title'        },
  { id: 'settings',        labelKey: 'settings.title'        },
  { id: 'help',            labelKey: 'help.title'            },
];

// ─── ProfileModal – modal dodawania/edycji profilu ──────────────────────────
function ProfileModal({ profile, categories, onSave, onClose, t }) {
  const [name, setName]         = useState(profile?.name     || '');
  const [url, setUrl]           = useState(profile?.url      || '');
  const [icon, setIcon]         = useState(profile?.icon     || '');
  const [category, setCategory] = useState(profile?.category || '');
  const [adBlock, setAdBlock]   = useState(profile?.adBlock  || false);
  const [notifs, setNotifs]     = useState(profile?.notifs   || false);
  const isEdit = !!profile;

  const handleSave = () => {
    if (!name.trim() || !url.trim()) return;
    const finalUrl = normalizeWebUrl(url);
    if (!finalUrl) {
      window.alert(t('profile_modal.invalid_url'));
      return;
    }
    const id = profile?.id || Date.now().toString();
    onSave({
      id,
      name:     name.trim(),
      url:      finalUrl,
      icon:     icon.trim() || ICONS.DEFAULT,
      category: category.trim(),
      type:      'webview',
      favorite:  profile?.favorite || false,
      zoom:      profile?.zoom     || 1,
      partition: profile?.partition || `persist:profile-${id}`,
      adBlock,
      notifs,
    });
  };

  return (
    <ModalPortal onClose={onClose}>
      <div className="modal-box" onMouseDown={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
            {isEdit ? t('profile_modal.edit_title') : t('profile_modal.add_title')}
          </h2>
          <button type="button" className="btn-icon" onClick={onClose}>{ICONS.CLOSE}</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Nazwa */}
          <div>
            <label className="form-label">{t('profile_modal.name_label')}</label>
            <input className="form-input" value={name}
              placeholder={t('profile_modal.name_placeholder')}
              onChange={e => setName(e.target.value)} autoFocus />
          </div>

          {/* URL */}
          <div>
            <label className="form-label">{t('profile_modal.url_label')}</label>
            <input className="form-input" value={url}
              placeholder={t('profile_modal.url_placeholder')}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()} />
          </div>

          {/* Ikona */}
          <div>
            <label className="form-label">{t('profile_modal.icon_label')}</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 22, width: 36, textAlign: 'center' }}>
                {icon || ICONS.DEFAULT}
              </span>
              <input className="form-input" value={icon}
                placeholder={t('profile_modal.icon_placeholder')}
                onChange={e => setIcon(e.target.value)} />
            </div>
          </div>

          {/* Kategoria */}
          <div>
            <label className="form-label">{t('profile_modal.category_label')}</label>
            <input className="form-input" value={category}
              placeholder={t('profile_modal.category_placeholder')}
              list="category-list"
              onChange={e => setCategory(e.target.value)} />
            <datalist id="category-list">
              {categories.map(c => <option key={c.id} value={c.name} />)}
            </datalist>
          </div>

          {/* Toggles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                {ICONS.BELL} {t('profile_modal.notifications_label')}
              </span>
              <label className="toggle">
                <input type="checkbox" checked={notifs} onChange={e => setNotifs(e.target.checked)} />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                {ICONS.LOCK} {t('profile_modal.ad_blocker_label')}
              </span>
              <label className="toggle">
                <input type="checkbox" checked={adBlock} onChange={e => setAdBlock(e.target.checked)} />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 20, justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>{t('profile_modal.cancel')}</button>
          <button className="btn btn-primary" onClick={handleSave}
            disabled={!name.trim() || !url.trim()}>
            {ICONS.SAVE} {t('profile_modal.save')}
          </button>
        </div>
      </div>
    </ModalPortal>
  );
}

// ─── CategoryModal – modal dodawania/edycji kategorii ───────────────────────
function CategoryModal({ category, onSave, onClose, t }) {
  const [name, setName] = useState(category?.name || '');
  const [icon, setIcon] = useState(category?.icon || '📁');

  return (
    <ModalPortal onClose={onClose}>
      <div className="modal-box" style={{ minWidth: 320, maxWidth: 400 }} onMouseDown={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
            {category ? t('category_modal.edit_title') : t('category_modal.add_title')}
          </h2>
          <button className="btn-icon" onClick={onClose}>{ICONS.CLOSE}</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label className="form-label">{t('category_modal.name_label')}</label>
            <input className="form-input" value={name}
              placeholder={t('category_modal.name_placeholder')}
              onChange={e => setName(e.target.value)} autoFocus />
          </div>
          <div>
            <label className="form-label">{t('category_modal.icon_label')}</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 22 }}>{icon}</span>
              <input className="form-input" value={icon}
                onChange={e => setIcon(e.target.value)} />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 20, justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>{t('category_modal.cancel')}</button>
          <button className="btn btn-primary" onClick={() => name.trim() && onSave({ id: category?.id || Date.now().toString(), name: name.trim(), icon })}
            disabled={!name.trim()}>
            {ICONS.SAVE} {t('category_modal.save')}
          </button>
        </div>
      </div>
    </ModalPortal>
  );
}

// ─── ContextMenu – menu kontekstowe (PPM) ───────────────────────────────────
function ContextMenu({ x, y, items, onClose }) {
  const ref = useRef();
  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [onClose]);

  return (
    <div ref={ref} style={{
      position: 'fixed', left: x, top: y, zIndex: 2000,
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 8, boxShadow: 'var(--shadow-md)', minWidth: 160,
      padding: '4px 0', fontSize: 13
    }}>
      {items.map((item, i) =>
        item === '---'
          ? <div key={i} style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
          : (
            <div key={i}
              style={{ padding: '6px 14px', cursor: 'pointer', color: item.danger ? 'var(--danger)' : 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              onClick={() => { item.action(); onClose(); }}>
              {item.icon} {item.label}
            </div>
          )
      )}
    </div>
  );
}

// =============================================================================
// Sidebar – główny komponent
// =============================================================================
export default function Sidebar({ profiles, onSelect, activeItem, onProfilesChange, onOpenTaskPanel, onModalOpenChange }) {
  const { t } = useTranslation();
  const [search, setSearch]               = useState('');
  const [categories, setCategories]       = useState([]);  // { id, name, icon }
  const [collapsed, setCollapsed]         = useState({});  // { categoryId: bool }
  const [toolsCollapsed, setToolsCollapsed] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editingProfile, setEditingProfile]     = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory]     = useState(null);
  const [contextMenu, setContextMenu]     = useState(null); // { x, y, items[] }

  const modalOpen = showProfileModal || showCategoryModal;

  useEffect(() => {
    onModalOpenChange?.(modalOpen);
  }, [modalOpen, onModalOpenChange]);

  // Ładuj kategorie z settings przy starcie
  useEffect(() => {
    window.electronAPI.getSettings().then(s => {
      setCategories(s.categories || []);
      setCollapsed(s.collapsedCategories || {});
    });
  }, []);

  // ----------------------------------------------------------------
  // saveCategories() – zapisuje kategorie do settings (partial save)
  // ----------------------------------------------------------------
  const saveCategories = (cats, cols = collapsed) => {
    setCategories(cats);
    window.electronAPI.saveSettings({ categories: cats, collapsedCategories: cols });
  };

  // ----------------------------------------------------------------
  // saveProfiles() – zapisuje profile i propaguje zmianę do App
  // ----------------------------------------------------------------
  const saveProfiles = (newProfiles) => {
    const normalized = newProfiles.map((p) => {
      const url = normalizeWebUrl(p.url);
      return url ? { ...p, url } : p;
    });
    onProfilesChange(normalized);
    window.electronAPI.saveProfiles(normalized);
  };

  // ----------------------------------------------------------------
  // handleAddProfile() – otwiera modal dodawania nowego profilu
  // ----------------------------------------------------------------
  const handleAddProfile = () => {
    setEditingProfile(null);
    setShowProfileModal(true);
    log('Sidebar: open add profile modal');
  };

  // ----------------------------------------------------------------
  // handleSaveProfile() – zapisuje nowy lub zaktualizowany profil
  // ----------------------------------------------------------------
  const handleSaveProfile = (profileData) => {
    const exists = profiles.find(p => p.id === profileData.id);
    let newProfiles;
    if (exists) {
      newProfiles = profiles.map(p => p.id === profileData.id ? profileData : p);
      log('Sidebar: profile updated:', profileData.name);
    } else {
      newProfiles = [...profiles, profileData];
      log('Sidebar: profile added:', profileData.name);
      // Dodaj do historii
      window.electronAPI.addHistory({ profileName: profileData.name, url: profileData.url });
    }
    saveProfiles(newProfiles);
    setShowProfileModal(false);
    onSelect({ ...profileData, type: 'webview' });
  };

  // ----------------------------------------------------------------
  // toggleFavorite() – przełącza ulubiony status profilu
  // ----------------------------------------------------------------
  const toggleFavorite = (profileId) => {
    const newProfiles = profiles.map(p =>
      p.id === profileId ? { ...p, favorite: !p.favorite } : p
    );
    saveProfiles(newProfiles);
    log('Sidebar: favorite toggled:', profileId);
  };

  // ----------------------------------------------------------------
  // deleteProfile() – usuwa profil po potwierdzeniu
  // ----------------------------------------------------------------
  const deleteProfile = (profileId) => {
    if (!window.confirm('Czy na pewno usunąć ten profil?')) return;
    saveProfiles(profiles.filter(p => p.id !== profileId));
    log('Sidebar: profile deleted:', profileId);
  };

  // ----------------------------------------------------------------
  // toggleCollapse() – zwija/rozwija kategorię
  // ----------------------------------------------------------------
  const toggleCollapse = (catId) => {
    const newCollapsed = { ...collapsed, [catId]: !collapsed[catId] };
    setCollapsed(newCollapsed);
    saveCategories(categories, newCollapsed);
  };

  // ----------------------------------------------------------------
  // handleContext() – otwiera menu kontekstowe dla profilu (PPM)
  // ----------------------------------------------------------------
  const handleContext = (e, profile) => {
    e.preventDefault();
    const items = [
      { icon: ICONS.EDIT,     label: t('sidebar.edit_profile'),   action: () => { setEditingProfile(profile); setShowProfileModal(true); } },
      { icon: profile.favorite ? ICONS.UNPIN : ICONS.STAR,
        label: profile.favorite ? t('sidebar.unpin') : t('sidebar.pin'),
        action: () => toggleFavorite(profile.id) },
      '---',
      { icon: ICONS.TASKS,    label: t('sidebar.open_tasks'),     action: () => onOpenTaskPanel?.(profile) },
      '---',
      { icon: ICONS.DELETE,   label: t('sidebar.delete_profile'), action: () => deleteProfile(profile.id), danger: true },
    ];
    setContextMenu({ x: e.clientX, y: e.clientY, items });
  };

  // ─── Filtrowanie profili wg wyszukiwarki ───────────────────────────────────
  const searchLower = search.toLowerCase();
  const filtered = profiles.filter(p =>
    !search || p.name.toLowerCase().includes(searchLower) ||
    (p.category || '').toLowerCase().includes(searchLower)
  );

  // ─── Grupowanie profili wg kategorii ──────────────────────────────────────
  const favorites = filtered.filter(p => p.favorite);
  const byCategory = {};
  filtered.filter(p => !p.favorite).forEach(p => {
    const cat = p.category || '';
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(p);
  });

  // ─── Render pojedynczego profilu ──────────────────────────────────────────
  const renderProfile = (p) => {
    const isActive = activeItem?.id === p.id || activeItem?.id === p.id;
    const iconStr = p.icon || ICONS.DEFAULT;
    const isEmoji = iconStr.length <= 4; // emoji vs URL

    return (
      <div key={p.id}
        className={`sidebar-item ${isActive ? 'active' : ''}`}
        onClick={() => {
          onSelect({ ...p, type: p.type || 'webview' });
          log('Sidebar: profile selected:', p.name);
        }}
        onContextMenu={e => handleContext(e, p)}
        title={p.url}>

        {/* Ikona profilu */}
        {isEmoji
          ? <span style={{ fontSize: 16, minWidth: 20, flexShrink: 0, textAlign: 'center' }}>{iconStr}</span>
          : <img src={iconStr} alt="" style={{ width: 18, height: 18, flexShrink: 0, objectFit: 'contain', borderRadius: 3 }}
              onError={e => { e.target.style.display = 'none'; }} />
        }

        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {p.name}
        </span>

        {/* Indykatory */}
        {p.favorite && <span style={{ fontSize: 10, opacity: 0.6 }}>{ICONS.STAR}</span>}
        {p.notifs   && <span style={{ fontSize: 10, opacity: 0.6 }}>{ICONS.BELL}</span>}
      </div>
    );
  };

  // ─── Sortowanie narzędzi specjalnych alfabetycznie (poza głównymi) ─────────
  const topSpecial = SPECIAL_TOOLS.slice(0, 3); // notepad, projectManager, aggregatedTasks
  const sortedSpecial = SPECIAL_TOOLS.slice(3).sort((a, b) =>
    t(a.labelKey).localeCompare(t(b.labelKey))
  );

  return (
    <div style={{
      width: 'var(--sidebar-width)', minWidth: 200, maxWidth: 280,
      background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', height: '100vh', flexShrink: 0
    }}>

      {/* ─── Nagłówek ─── */}
      <div style={{ padding: '12px 10px 8px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 8 }}>
          <button className="btn btn-primary" style={{ flex: 1, fontSize: 12 }} onClick={handleAddProfile}>
            {ICONS.PLUS} {t('sidebar.add_profile')}
          </button>
          <button className="btn-icon" onClick={() => { setEditingCategory(null); setShowCategoryModal(true); }}
            title={t('sidebar.add_category')}>
            {ICONS.FOLDER_ADD}
          </button>
        </div>

        {/* Wyszukiwarka */}
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'var(--text-muted)' }}>
            {ICONS.SEARCH}
          </span>
          <input
            className="form-input"
            style={{ paddingLeft: 26, fontSize: 12, height: 30 }}
            placeholder={t('sidebar.search_placeholder')}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ─── Lista ─── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 6px' }}>

        {/* Ulubione */}
        {favorites.length > 0 && (
          <div>
            <div className="sidebar-category">
              {ICONS.STAR} {t('sidebar.favorites')}
            </div>
            {favorites.map(renderProfile)}
          </div>
        )}

        {/* Kategorie użytkownika */}
        {Object.entries(byCategory)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([catName, catProfiles]) => {
            const catObj = categories.find(c => c.name === catName);
            const catId  = catObj?.id || catName;
            const isCollapsed = collapsed[catId];

            return (
              <div key={catName}>
                <div className="sidebar-category"
                  onClick={() => toggleCollapse(catId)}
                  onContextMenu={e => {
                    e.preventDefault();
                    if (catObj) {
                      setContextMenu({ x: e.clientX, y: e.clientY, items: [
                        { icon: ICONS.EDIT, label: t('sidebar.edit_category'), action: () => { setEditingCategory(catObj); setShowCategoryModal(true); } },
                        { icon: ICONS.DELETE, label: t('sidebar.delete_category'), action: () => saveCategories(categories.filter(c => c.id !== catObj.id)), danger: true }
                      ]});
                    }
                  }}>
                  <span>{catObj?.icon || ICONS.FOLDER}</span>
                  <span style={{ flex: 1 }}>{catName || t('sidebar.all_profiles')}</span>
                  <span style={{ fontSize: 10 }}>
                    {isCollapsed ? ICONS.CHEVRON_RIGHT : ICONS.CHEVRON_DOWN}
                  </span>
                </div>
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

        {/* Separator Narzędzia */}
        <div style={{ height: 1, background: 'var(--border)', margin: '10px 4px' }} />
        <div
          className="sidebar-category"
          onClick={() => setToolsCollapsed(c => !c)}
        >
          <span>{ICONS.SETTINGS}</span>
          <span style={{ flex: 1 }}>{t('sidebar.special')}</span>
          <span style={{ fontSize: 10 }}>
            {toolsCollapsed ? ICONS.CHEVRON_RIGHT : ICONS.CHEVRON_DOWN}
          </span>
        </div>

        {!toolsCollapsed && topSpecial.map(tool => {
          const icon = ICONS[SIDEBAR_ICON_MAP[tool.id]] || ICONS.DEFAULT;
          const isActive = activeItem?.id === tool.id;
          return (
            <div key={tool.id}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => {
                onSelect({ id: tool.id, type: 'special' });
                log('Sidebar: tool selected:', tool.id);
              }}>
              <span style={{ fontSize: 15, flexShrink: 0, minWidth: 20, textAlign: 'center' }}>{icon}</span>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {t(tool.labelKey)}
              </span>
            </div>
          );
        })}

        {!toolsCollapsed && sortedSpecial.map(tool => {
          const icon = ICONS[SIDEBAR_ICON_MAP[tool.id]] || ICONS.DEFAULT;
          const isActive = activeItem?.id === tool.id;
          return (
            <div key={tool.id}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => {
                onSelect({ id: tool.id, type: 'special' });
                log('Sidebar: tool selected:', tool.id);
              }}>
              <span style={{ fontSize: 15, flexShrink: 0, minWidth: 20, textAlign: 'center' }}>{icon}</span>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {t(tool.labelKey)}
              </span>
            </div>
          );
        })}
      </div>

      {/* ─── Modals ─── */}
      {showProfileModal && (
        <ProfileModal
          profile={editingProfile}
          categories={categories}
          onSave={handleSaveProfile}
          onClose={() => setShowProfileModal(false)}
          t={t}
        />
      )}
      {showCategoryModal && (
        <CategoryModal
          category={editingCategory}
          onSave={(cat) => {
            const exists = categories.find(c => c.id === cat.id);
            const newCats = exists
              ? categories.map(c => c.id === cat.id ? cat : c)
              : [...categories, cat];
            saveCategories(newCats);
            setShowCategoryModal(false);
          }}
          onClose={() => setShowCategoryModal(false)}
          t={t}
        />
      )}

      {/* ─── Menu kontekstowe ─── */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x} y={contextMenu.y}
          items={contextMenu.items}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
