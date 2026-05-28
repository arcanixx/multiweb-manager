// =============================================================================
// FILE: Help.jsx
// PATH: src/ui/help/Help.jsx
// VERSION: 0.0.3
// PURPOSE: Główny komponent pomocy – łączy sekcje (Profile, Tools, Tasks, Shortcuts, FAQ)
// FUNCTIONS: Help
// DEPENDS ON: react, translations.js, icons.js, HelpSection, ToolCard, Shortcut, FAQ
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useEffect, useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
import HelpSection from './HelpSection';
import ToolCard from './ToolCard';
import Shortcut from './Shortcut';
import FAQ from './FAQ';
export default function Help() {
  const { t } = useContext(TranslationContext);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);
  if (!ready) {
    return <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>{t('common.loading')}</div>;
  }
  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '20px 24px', background: 'var(--bg-primary)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
            {ICONS.HELP} {t('help.title')}
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '6px 0 0' }}>{t('help.subtitle')}</p>
        </div>
        <HelpSection id="profiles" icon={ICONS.DEFAULT} titleKey="help.section_profiles">
          {/* Treść sekcji Profiles – można zostawić inline lub wyciągnąć do osobnego komponentu */}
        </HelpSection>
        <HelpSection id="tools" icon={ICONS.SETTINGS} titleKey="help.section_tools">
          <ToolCard icon={ICONS.NOTEPAD} titleKey="notepad.title" descKey="help.tools_notepad" />
          <ToolCard icon={ICONS.PROJECTMANAGER} titleKey="projectManager.title" descKey="help.tools_removebg" />
          <ToolCard icon={ICONS.REMOVEBG} titleKey="removebg.title" descKey="help.tools_removebg" />
          <ToolCard icon={ICONS.STRINGCOMBINER} titleKey="stringCombiner.title" descKey="help.tools_string" />
          <ToolCard icon={ICONS.TERMINAL} titleKey="terminal.title" descKey="help.tools_terminal" />
          <ToolCard icon={ICONS.HISTORY} titleKey="history.title" descKey="help.tools_history" />
        </HelpSection>
        <HelpSection id="tasks" icon={ICONS.TASKS} titleKey="help.section_tasks">
          {/* Treść sekcji Tasks */}
        </HelpSection>

        <HelpSection id="shortcuts" icon={ICONS.INFO} titleKey="help.section_shortcuts">
          <Shortcut keys="Ctrl+Scroll" descKey="help.shortcuts_zoom" />
          <Shortcut keys="F11" descKey="help.shortcuts_f11" />
          <Shortcut keys="Ctrl+S" descKey="notepad.save" />
          <Shortcut keys="Ctrl+F" descKey="notepad.find_replace" />
        </HelpSection>

        <HelpSection id="faq" icon={ICONS.HELP} titleKey="help.section_faq">
          <FAQ qKey="help.faq_offline" aKey="help.faq_offline" />
          <FAQ qKey="help.faq_session" aKey="help.faq_session" />
          <FAQ qKey="help.faq_data" aKey="help.faq_data" />
        </HelpSection>

        <div style={{ marginTop: 20, padding: '12px 16px', textAlign: 'center', fontSize: 12, color: 'var(--text-muted)',
          border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg-secondary)' }}>
          {ICONS.INFO} MultiWeb Manager · Made with {ICONS.FAVORITE} ·
          Dane w: <code style={{ fontSize: 11, background: 'var(--bg-card)', padding: '1px 6px', borderRadius: 4 }}>AppData/Roaming/multiweb-manager</code>
        </div>
      </div>
    </div>
  );
}