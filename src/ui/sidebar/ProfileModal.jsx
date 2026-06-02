// =============================================================================
// FILE: ProfileModal.jsx
// PATH: src/ui/sidebar/ProfileModal.jsx
// VERSION: 0.0.3
// PURPOSE: Zaawansowany formularz modalny do konfiguracji profili WebView – obsługuje parametry URL, ikony, przypisanie do kategorii oraz przełączniki adblockera i powiadomień.
// FUNCTIONS: ProfileModal
// DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js, urlUtils.js, ModalPortal.jsx, notificationsManager.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useContext } from 'react';
import { logInfo, logError, logWarn } from '../utils/loggerRenderer.js';
import { TranslationContext } from '../../utils/trCanslations.js';
import { ICONS } from '../../utils/icons.js';
import { normalizeWebUrl } from '../../utils/urlUtils.js';
import ModalPortal from '../system/ModalPortal';
import { showNotification } from '../../utils/notificationsManager.js';

// ─── ProfileModal() – modal dodawania lub edycji profilu WebView
//   @param {Object} props – właściwości komponentu
//   @param {Object} props.profile – istniejący profil (tryb edycji) lub null
//   @param {Array} props.categories – lista dostępnych kategorii
//   @param {Function} props.onSave – callback zapisu profilu
//   @param {Function} props.onClose – callback zamknięcia modala
//   @returns {JSX.Element} – renderowany modal profilu

export default function ProfileModal({ profile, categories, onSave, onClose }) {
  const { t } = useContext(TranslationContext);
  const [name, setName] = useState(profile?.name || '');
  const [url, setUrl] = useState(profile?.url || '');
  const [icon, setIcon] = useState(profile?.icon || '');
  const [category, setCategory] = useState(profile?.category || '');
  const [adBlock, setAdBlock] = useState(profile?.adBlock || false);
  const [notifs, setNotifs] = useState(profile?.notifs || false);
  const isEdit = !!profile;

  // ─── handleSave() – obsługa zapisu profilu z walidacją URL
  //   @returns {void}
  const handleSave = () => {
    try {
      if (!name.trim() || !url.trim()) {
        logWarn('ui', 'ProfileModal: validation failed - name or url empty');
        return;
      }
      const finalUrl = normalizeWebUrl(url);
      if (!finalUrl) {
        logError('ui', 'ProfileModal: invalid URL format');
        showNotification(t('profile_modal.invalid_url'), 'error');
        return;
      }
      const id = profile?.id || Date.now().toString();
      onSave({
        id, name: name.trim(), url: finalUrl, icon: icon.trim() || ICONS.DEFAULT,
        category: category.trim(), type: 'webview', favorite: profile?.favorite || false,
        zoom: profile?.zoom || 1, partition: profile?.partition || `persist:profile-${id}`,
        adBlock, notifs
      });
      logInfo('ui', `ProfileModal: profile ${isEdit ? 'updated' : 'created'} ${id}`);
    } catch (err) {
      logError('ui', 'ProfileModal: save failed', err.message);
      logWarn('ui', 'Wystąpił błąd podczas zapisu profilu');
    }
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
          <div><label className="form-label">{t('profile_modal.name_label')}</label>
            <input className="form-input" value={name} placeholder={t('profile_modal.name_placeholder')} onChange={e => setName(e.target.value)} autoFocus /></div>
          <div><label className="form-label">{t('profile_modal.url_label')}</label>
            <input className="form-input" value={url} placeholder={t('profile_modal.url_placeholder')} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSave()} /></div>
          <div><label className="form-label">{t('profile_modal.icon_label')}</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 22, width: 36, textAlign: 'center' }}>{icon || ICONS.DEFAULT}</span>
              <input className="form-input" value={icon} placeholder={t('profile_modal.icon_placeholder')} onChange={e => setIcon(e.target.value)} />
            </div>
          </div>
          <div><label className="form-label">{t('profile_modal.category_label')}</label>
            <input className="form-input" value={category} placeholder={t('profile_modal.category_placeholder')} list="category-list" onChange={e => setCategory(e.target.value)} />
            <datalist id="category-list">{categories.map(c => <option key={c.id} value={c.name} />)}</datalist>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{ICONS.BELL} {t('profile_modal.notifications_label')}</span>
              <label className="toggle"><input type="checkbox" checked={notifs} onChange={e => setNotifs(e.target.checked)} /><span className="toggle-slider"></span></label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{ICONS.LOCK} {t('profile_modal.ad_blocker_label')}</span>
              <label className="toggle"><input type="checkbox" checked={adBlock} onChange={e => setAdBlock(e.target.checked)} /><span className="toggle-slider"></span></label>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 20, justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>{t('common.cancel')}</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={!name.trim() || !url.trim()}>{ICONS.SAVE} {t('common.save')}</button>
        </div>
      </div>
    </ModalPortal>
  );
}