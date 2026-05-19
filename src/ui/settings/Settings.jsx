// =============================================================================
// FILE: src/components/Settings.jsx
// PATH: multiweb-manager/src/components/Settings.jsx
// VERSION: v1
// PURPOSE: Panel ustawień aplikacji. Sekcje: Ogólne, Wygląd (dark mode),
//          Narzędzia (remove.bg), Zaawansowane (debug). Wszystkie labelki
//          po lewej, inputy po prawej (toggle, select, text). Ikony z icons.js.
//          Aktualna wersja aplikacji wyświetlana z IPC get-app-version.
//          NAPRAWIONE: save używa partial patch, locale zmieniana przez context.
// DEPENDS ON: icons.js, useTranslation.js, logger.js
// FUNCTIONS: save, loadVersion, handleThemeChange, renderToggleRow,
//            renderInputRow, renderSelectRow
// =============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { ICONS } from '../../utils/icons';
import { useTranslation } from '../../hooks/useTranslation';
import { log, setDebugMode } from '../../utils/logger';
import UpdateChecker from './UpdateChecker';

export default function Settings({ settings, onSave }) {
  const { t, locale, setLocale } = useTranslation();
  const [local, setLocal]   = useState(settings || {});
  const [toast, setToast]   = useState('');
  const [appVersion, setAppVersion] = useState('...');

  // Synchronizuj z props gdy settings zmieniają się z zewnątrz
  useEffect(() => { setLocal(settings || {}); }, [settings]);

  // Pobierz wersję aplikacji przez IPC
  useEffect(() => {
    window.electronAPI.getAppVersion?.()
      .then(v => setAppVersion(v || '1.0.0'))
      .catch(() => setAppVersion('1.0.0'));
  }, []);

  // ----------------------------------------------------------------
  // set() – helper do aktualizacji pola w local state
  // ----------------------------------------------------------------
  const set = (key, value) => setLocal(prev => ({ ...prev, [key]: value }));

  // ----------------------------------------------------------------
  // save() – zapisuje ustawienia przez onSave (partial patch)
  // ----------------------------------------------------------------
  const save = useCallback(async () => {
    await onSave(local);
    setDebugMode(local.debugMode || false);
    showToast(t('settings.saved'));
    log('Settings: saved', Object.keys(local).join(', '));
  }, [local, onSave, t]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  // ----------------------------------------------------------------
  // renderToggleRow() – wiersz z togglem (label lewo, toggle prawo)
  //   icon     – ikona z ICONS
  //   label    – tekst etykiety
  //   value    – bool
  //   onChange – setter
  // ----------------------------------------------------------------
  const renderToggleRow = (icon, label, value, onChange) => (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 0', borderBottom: '1px solid var(--border)'
    }}>
      <span style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
        {icon} {label}
      </span>
      <label className="toggle">
        <input type="checkbox" checked={!!value} onChange={e => onChange(e.target.checked)} />
        <span className="toggle-slider"></span>
      </label>
    </div>
  );

  // ----------------------------------------------------------------
  // renderInputRow() – wiersz z polem tekstowym
  // ----------------------------------------------------------------
  const renderInputRow = (icon, label, key, placeholder = '', type = 'text') => (
    <div style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {icon} {label}
      </label>
      <input className="form-input" type={type}
        style={{ marginTop: 6 }}
        value={local[key] || ''}
        placeholder={placeholder}
        onChange={e => set(key, e.target.value)} />
    </div>
  );

  // ----------------------------------------------------------------
  // renderSelectRow() – wiersz z polem select
  // ----------------------------------------------------------------
  const renderSelectRow = (icon, label, key, options) => (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 0', borderBottom: '1px solid var(--border)'
    }}>
      <span style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
        {icon} {label}
      </span>
      <select className="form-select" style={{ width: 160 }}
        value={local[key] || options[0]?.value || ''}
        onChange={e => set(key, e.target.value)}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );

  // ─── Sekcja ────────────────────────────────────────────────────
  const Section = ({ title, icon, children }) => (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{
        fontSize: 12, fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.08em', color: 'var(--text-muted)',
        margin: '0 0 2px', display: 'flex', alignItems: 'center', gap: 6
      }}>
        {icon} {title}
      </h3>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 10, padding: '0 16px'
      }}>
        {children}
      </div>
    </div>
  );

  return (
    <div style={{
      height: '100%', overflowY: 'auto', padding: '20px 24px',
      background: 'var(--bg-primary)'
    }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>

        {/* ─── Tytuł ─── */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: 'var(--text-primary)',
            display: 'flex', alignItems: 'center', gap: 10 }}>
            {ICONS.SETTINGS} {t('settings.title')}
          </h1>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
            {ICONS.VERSION} {t('settings.version_label')}: <strong>{appVersion}</strong>
          </div>
        </div>

        {/* ─── Ogólne ─── */}
        <Section title={t('settings.section_general')} icon={ICONS.SETTINGS_ICON}>
          {renderInputRow(ICONS.DOWNLOAD, t('settings.downloads_path'), 'downloadsPath', app?.getPath?.('downloads') || 'Downloads')}

          {/* Język */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 0', borderBottom: '1px solid var(--border)'
          }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
              {ICONS.INFO} {t('settings.language')}
            </span>
            <select className="form-select" style={{ width: 160 }}
              value={locale}
              onChange={e => {
                setLocale(e.target.value);
                set('language', e.target.value);
              }}>
              <option value="pl">Polski</option>
              <option value="en">English</option>
            </select>
          </div>
        </Section>

        {/* ─── Wygląd ─── */}
        <Section title={t('settings.section_appearance')} icon={ICONS.THEME_SYSTEM}>
          {/* Motyw systemowy */}
          {renderToggleRow(
            ICONS.THEME_SYSTEM,
            t('settings.use_system_theme'),
            local.theme === 'system' || !local.theme,
            (v) => set('theme', v ? 'system' : 'light')
          )}

          {/* Jasny / ciemny (aktywne gdy nie systemowy) */}
          {local.theme && local.theme !== 'system' && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 0', borderBottom: '1px solid var(--border)'
            }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                {local.theme === 'dark' ? ICONS.THEME_DARK : ICONS.THEME_LIGHT} {t('settings.theme')}
              </span>
              <div style={{ display: 'flex', gap: 6 }}>
                {[
                  { value: 'light', label: t('settings.theme_light'), icon: ICONS.THEME_LIGHT },
                  { value: 'dark',  label: t('settings.theme_dark'),  icon: ICONS.THEME_DARK  },
                ].map(opt => (
                  <button key={opt.value}
                    className={`btn ${local.theme === opt.value ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: 12 }}
                    onClick={() => set('theme', opt.value)}>
                    {opt.icon} {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Section>

        {/* ─── Sieć i prywatność ─── */}
        <Section title={t('settings.section_network')} icon={ICONS.LOCK}>
          {renderToggleRow(ICONS.LOCK, t('settings.ad_blocker_global'), local.adBlocker, v => set('adBlocker', v))}
          {renderToggleRow(ICONS.BELL, t('settings.notifications_global'), local.notifications, v => set('notifications', v))}
        </Section>

        {/* ─── Narzędzia ─── */}
        <Section title={t('settings.section_tools')} icon={ICONS.PROCESS}>
          {renderInputRow(ICONS.IMAGE, t('settings.removebg_api_key'), 'removeBgApiKey', 'xxxxxxxx...')}
          {renderSelectRow(ICONS.REMOVEBG, t('settings.removebg_plan'), 'removeBgPlan', [
            { value: 'free', label: t('settings.removebg_plan_free') },
            { value: 'pro',  label: t('settings.removebg_plan_pro') },
          ])}
        </Section>

        {/* ─── Zaawansowane ─── */}
        <Section title={t('settings.section_advanced')} icon={ICONS.DEBUG}>
          {renderToggleRow(ICONS.DEBUG, t('settings.debug_mode'), local.debugMode, v => set('debugMode', v))}
        </Section>

        {/* ─── Aktualizacje ─── */}
        <Section title={t('settings.check_updates')} icon={ICONS.UPDATE}>
          <div style={{ padding: '12px 0' }}>
            <UpdateChecker />
          </div>
        </Section>

        {/* ─── Zapis ─── */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 8 }}>
          <button className="btn btn-primary" style={{ fontSize: 14, padding: '10px 24px' }} onClick={save}>
            {ICONS.SAVE} {t('settings.save')}
          </button>
          {toast && (
            <span style={{ fontSize: 13, color: 'var(--success)' }}>{toast}</span>
          )}
        </div>

      </div>
    </div>
  );
}
