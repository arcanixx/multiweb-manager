// =============================================================================
// FILE: CategoryModal.jsx
// PATH: src/ui/sidebar/CategoryModal.jsx
// VERSION: 0.0.3
// PURPOSE: Modal dodawania/edycji kategorii
// FUNCTIONS: CategoryModal
// DEPENDS ON: react, translations.js, icons.js, ModalPortal
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
import ModalPortal from '../system/ModalPortal';
export default function CategoryModal({ category, onSave, onClose }) {
  const { t } = useContext(TranslationContext);
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
          <div><label className="form-label">{t('category_modal.name_label')}</label>
            <input className="form-input" value={name} placeholder={t('category_modal.name_placeholder')} onChange={e => setName(e.target.value)} autoFocus /></div>
          <div><label className="form-label">{t('category_modal.icon_label')}</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 22 }}>{icon}</span>
              <input className="form-input" value={icon} onChange={e => setIcon(e.target.value)} />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 20, justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>{t('common.cancel')}</button>
          <button className="btn btn-primary" onClick={() => name.trim() && onSave({ id: category?.id || Date.now().toString(), name: name.trim(), icon })} disabled={!name.trim()}>
            {ICONS.SAVE} {t('common.save')}
          </button>
        </div>
      </div>
    </ModalPortal>
  );
}
