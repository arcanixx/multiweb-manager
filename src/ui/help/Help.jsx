// =============================================================================
// FILE: src/components/Help.jsx
// PATH: multiweb-manager/src/components/Help.jsx
// VERSION: v1
// PURPOSE: Pełna dokumentacja użytkownika z sekcjami: profile i konta,
//          narzędzia (każde z opisem), zadania, skróty klawiszowe, FAQ.
//          Wszystkie ikony z icons.js, wszystkie teksty z locales.
//          Rozwijane/zwijane sekcje dla czytelności.
// DEPENDS ON: icons.js, useTranslation.js
// FUNCTIONS: toggleSection, renderSection, renderShortcut, renderFAQ
// =============================================================================

import React, { useState, useEffect } from 'react';
import { ICONS } from '../../utils/icons';
import { useTranslation } from '../../hooks/useTranslation';

export default function Help() {
  const { t } = useTranslation();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState({ profiles: true });

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!ready) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        {t('app.loading') || 'Ładowanie pomocy…'}
      </div>
    );
  }

  const toggle = (key) => setOpen(prev => ({ ...prev, [key]: !prev[key] }));

  // ─── Komponent sekcji ────────────────────────────────────────────
  const Section = ({ id, icon, titleKey, children }) => (
    <div style={{
      border: '1px solid var(--border)', borderRadius: 10,
      marginBottom: 12, overflow: 'hidden'
    }}>
      {/* Nagłówek sekcji – klikalny */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 16px', cursor: 'pointer',
          background: open[id] ? 'var(--bg-active)' : 'var(--bg-secondary)',
          transition: 'background 0.15s',
          borderBottom: open[id] ? '1px solid var(--border)' : 'none',
        }}
        onClick={() => toggle(id)}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', flex: 1 }}>
          {t(titleKey)}
        </span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          {open[id] ? ICONS.CHEVRON_DOWN : ICONS.CHEVRON_RIGHT}
        </span>
      </div>

      {/* Treść sekcji */}
      {open[id] && (
        <div style={{ padding: '16px 20px', background: 'var(--bg-card)' }}>
          {children}
        </div>
      )}
    </div>
  );

  // ─── Wiersz informacyjny ─────────────────────────────────────────
  const InfoRow = ({ icon, text }) => (
    <div style={{
      display: 'flex', gap: 10, alignItems: 'flex-start',
      padding: '7px 0', borderBottom: '1px solid var(--border)',
      fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5
    }}>
      <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <span>{text}</span>
    </div>
  );

  // ─── Narzędzie – karta ───────────────────────────────────────────
  const ToolCard = ({ icon, titleKey, descKey }) => (
    <div style={{
      display: 'flex', gap: 12, padding: '12px 14px',
      background: 'var(--bg-secondary)', borderRadius: 8, marginBottom: 8,
      border: '1px solid var(--border)'
    }}>
      <span style={{ fontSize: 22, flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', marginBottom: 3 }}>
          {t(titleKey)}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {t(descKey)}
        </div>
      </div>
    </div>
  );

  // ─── Skrót klawiaturowy ──────────────────────────────────────────
  const Shortcut = ({ keys, descKey }) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '8px 0', borderBottom: '1px solid var(--border)'
    }}>
      <div style={{ display: 'flex', gap: 4, minWidth: 140, flexShrink: 0 }}>
        {keys.split('+').map((k, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>+</span>}
            <kbd style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              borderRadius: 4, padding: '2px 7px', fontSize: 12,
              fontFamily: 'monospace', color: 'var(--text-primary)',
              boxShadow: '0 1px 0 var(--border)'
            }}>{k}</kbd>
          </React.Fragment>
        ))}
      </div>
      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{t(descKey)}</span>
    </div>
  );

  // ─── FAQ wpis ────────────────────────────────────────────────────
  const FAQ = ({ qKey, aKey }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', marginBottom: 4,
        display: 'flex', alignItems: 'center', gap: 6 }}>
        {ICONS.HELP} {t(qKey).replace(/^Q: |^Pytanie: /, '')}
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', paddingLeft: 22, lineHeight: 1.6 }}>
        {t(aKey).replace(/^A: |^Odpowiedź: /, '')}
      </div>
    </div>
  );

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '20px 24px', background: 'var(--bg-primary)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* ─── Tytuł ─── */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: 'var(--text-primary)',
            display: 'flex', alignItems: 'center', gap: 10 }}>
            {ICONS.HELP} {t('help.title')}
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '6px 0 0' }}>
            {t('help.subtitle')}
          </p>
        </div>

        {/* ─── SEKCJA: Profile i konta ─── */}
        <Section id="profiles" icon={ICONS.DEFAULT} titleKey="help.section_profiles">
          <InfoRow icon={ICONS.INFO} text={t('help.profiles_intro')} />
          <InfoRow icon={ICONS.PLUS} text={t('help.profiles_add', { icon: ICONS.PLUS })} />
          <InfoRow icon={ICONS.FOLDER} text={t('help.profiles_category', { icon: ICONS.CHEVRON_DOWN })} />
          <InfoRow icon={ICONS.STAR} text={t('help.profiles_pin', { icon: ICONS.STAR })} />
          <InfoRow icon={ICONS.CLEAR_CACHE} text={t('help.profiles_cache')} />

          {/* Mini-instrukcja: jak dodać profil */}
          <div style={{
            marginTop: 14, padding: '12px 16px',
            background: 'var(--bg-secondary)', borderRadius: 8,
            border: '1px solid var(--border)'
          }}>
            <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-muted)',
              textTransform: 'uppercase', marginBottom: 10, letterSpacing: '0.05em' }}>
              {ICONS.PLUS} Jak dodać profil:
            </div>
            {[
              `1. Kliknij ${ICONS.PLUS} "Dodaj profil" w lewym panelu`,
              `2. Wpisz nazwę (np. "DS DEV") i URL (np. "deepseek.com")`,
              `3. Opcjonalnie: wybierz kategorię (np. "DeepSeek"), ikonę, włącz powiadomienia`,
              `4. Kliknij ${ICONS.SAVE} Zapisz – profil pojawi się na liście`,
              `5. Kliknij profil w panelu – otworzy się niezależna sesja przeglądarki`,
            ].map((step, i) => (
              <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
                {step}
              </div>
            ))}
          </div>
        </Section>

        {/* ─── SEKCJA: Narzędzia ─── */}
        <Section id="tools" icon={ICONS.SETTINGS} titleKey="help.section_tools">
          <ToolCard icon={ICONS.NOTEPAD}        titleKey="notepad.title"        descKey="help.tools_notepad"   />
          <ToolCard icon={ICONS.PROJECTMANAGER} titleKey="projectManager.title" descKey="help.tools_removebg"  />
          <ToolCard icon={ICONS.REMOVEBG}       titleKey="removebg.title"       descKey="help.tools_removebg"  />
          <ToolCard icon={ICONS.STRINGCOMBINER} titleKey="stringCombiner.title" descKey="help.tools_string"    />
          <ToolCard icon={ICONS.TERMINAL}       titleKey="terminal.title"       descKey="help.tools_terminal"  />
          <ToolCard icon={ICONS.HISTORY}        titleKey="history.title"        descKey="help.tools_history"   />

          {/* Remove.bg – dodatkowe info */}
          <div style={{
            marginTop: 8, padding: '10px 14px',
            background: 'var(--bg-secondary)', borderRadius: 8,
            border: '1px solid var(--border)', fontSize: 12, color: 'var(--text-secondary)'
          }}>
            {ICONS.INFO} <strong>Remove.bg API:</strong> Klucz API ustaw w {ICONS.SETTINGS} Ustawieniach → Narzędzia.
            Plan darmowy: max 30 plików. Plan PRO: max 120 plików, pełna rozdzielczość.
          </div>
        </Section>

        {/* ─── SEKCJA: Zadania ─── */}
        <Section id="tasks" icon={ICONS.TASKS} titleKey="help.section_tasks">
          <InfoRow icon={ICONS.INFO}   text={t('help.tasks_intro')} />
          <InfoRow icon={ICONS.TASKS}  text={t('help.tasks_sections')} />
          <InfoRow icon={ICONS.PIN}    text={t('help.tasks_pin', { icon: ICONS.PIN })} />
          <InfoRow icon={ICONS.AGGREGATEDTASKS} text={t('help.tasks_aggregated')} />

          {/* Priorytety wizualizacja */}
          <div style={{
            marginTop: 14, padding: '12px 16px',
            background: 'var(--bg-secondary)', borderRadius: 8,
            border: '1px solid var(--border)'
          }}>
            <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-muted)',
              textTransform: 'uppercase', marginBottom: 10, letterSpacing: '0.05em' }}>
              {t('help.tasks_priority')}
            </div>
            {[
              { label: 'A – Krytyk',  color: '#ef4444', desc: 'Pilne, blokujące' },
              { label: 'B – Major',   color: '#f97316', desc: 'Ważne, nieblokujące' },
              { label: 'C – Minor',   color: '#eab308', desc: 'Drobne poprawki' },
              { label: 'Backlog',     color: '#3b82f6', desc: 'Do zrobienia później' },
              { label: 'Done',        color: '#22c55e', desc: 'Ukończone' },
            ].map(p => (
              <div key={p.label} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '5px 0', borderBottom: '1px solid var(--border)', fontSize: 12
              }}>
                <div style={{
                  width: 12, height: 12, borderRadius: 2,
                  background: p.color, flexShrink: 0
                }} />
                <strong style={{ color: 'var(--text-primary)', minWidth: 90 }}>{p.label}</strong>
                <span style={{ color: 'var(--text-secondary)' }}>{p.desc}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ─── SEKCJA: Skróty ─── */}
        <Section id="shortcuts" icon={ICONS.INFO} titleKey="help.section_shortcuts">
          <Shortcut keys="Ctrl+Scroll"   descKey="help.shortcuts_zoom" />
          <Shortcut keys="F11"           descKey="help.shortcuts_f11" />
          <Shortcut keys="Ctrl+S"        descKey="notepad.save" />
          <Shortcut keys="Ctrl+F"        descKey="notepad.find_replace" />
          <Shortcut keys="Ctrl+C"        descKey="terminal.title" />
          <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-muted)' }}>
            {ICONS.INFO} Skróty Ctrl+S i Ctrl+F działają w kontekście aktywnego narzędzia (Notatnik).
          </div>
        </Section>

        {/* ─── SEKCJA: FAQ ─── */}
        <Section id="faq" icon={ICONS.HELP} titleKey="help.section_faq">
          <FAQ qKey="help.faq_offline" aKey="help.faq_offline" />
          <FAQ qKey="help.faq_session" aKey="help.faq_session" />
          <FAQ qKey="help.faq_data"    aKey="help.faq_data" />

          {/* Dodatkowe stałe FAQ */}
          <div style={{ marginTop: 14 }}>
            {[
              {
                q: 'Jak wyczyścić cache profilu?',
                a: `Kliknij prawym przyciskiem na profil w Sidebarze → "${ICONS.CLEAR_CACHE} Wyczyść cache". Pozostaniesz zalogowany jeśli sesja jest zapisana.`
              },
              {
                q: 'Gdzie są zapisywane notatki?',
                a: `W pliku electron-store w AppData (Windows) lub ~/.config (Linux/Mac). Dane przeżywają restart aplikacji automatycznie.`
              },
              {
                q: 'Jak dodać kategorię do profili?',
                a: `Kliknij ${ICONS.FOLDER_ADD} obok "Dodaj profil" – otworzy modal tworzenia kategorii z własną ikoną.`
              },
              {
                q: 'Jak włączyć tryb DEBUG?',
                a: `${ICONS.SETTINGS} Ustawienia → Zaawansowane → Tryb DEBUG. Logi pojawią się w konsoli przeglądarki (DevTools).`
              },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)',
                  marginBottom: 4, display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                  <span style={{ flexShrink: 0 }}>{ICONS.HELP}</span>
                  <span>{item.q}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', paddingLeft: 22, lineHeight: 1.6 }}>
                  {item.a}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ─── Footer ─── */}
        <div style={{
          marginTop: 20, padding: '12px 16px', textAlign: 'center',
          fontSize: 12, color: 'var(--text-muted)',
          border: '1px solid var(--border)', borderRadius: 8,
          background: 'var(--bg-secondary)'
        }}>
          {ICONS.INFO} MultiWeb Manager · Made with {ICONS.FAVORITE} ·
          Dane w: <code style={{ fontSize: 11, background: 'var(--bg-card)',
            padding: '1px 6px', borderRadius: 4 }}>AppData/Roaming/multiweb-manager</code>
        </div>

      </div>
    </div>
  );
}
