// =============================================================================
// FILE: SidebarProfileItem.jsx
// PATH: src/ui/sidebar/SidebarProfileItem.jsx
// VERSION: 0.0.3
// PURPOSE: Pojedynczy profil w Sidebarze (ikona, nazwa, indykatory)
// FUNCTIONS: SidebarProfileItem
// DEPENDS ON: react, loggerRenderer.js, icons.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React from 'react';
import { logInfo, logError, logWarn, logDebug } from '../../utils/loggerRenderer.js';
import { ICONS } from '../../utils/icons.js';

// ─── SidebarProfileItem() – pojedynczy element profilu w sidebarze
//   @param {Object} props – właściwości komponentu
//   @param {Object} props.profile – obiekt profilu (id, name, icon, favorite, notifs)
//   @param {boolean} props.isActive – czy profil jest aktywny
//   @param {Function} props.onSelect – callback wyboru profilu
//   @param {Function} props.onContextMenu – callback menu kontekstowego
//   @returns {JSX.Element} – renderowany element profilu

export default function SidebarProfileItem({ profile, isActive, onSelect, onContextMenu }) {

  const handleClick = () => {
    logDebug('ui', `Sidebar: profile selected: ${profile.name}`);
    onSelect();
  };

  const iconStr = profile.icon || ICONS.DEFAULT;
  const isEmoji = iconStr.length <= 4;
  return (
    <div className={`sidebar-item ${isActive ? 'active' : ''}`}
      onClick={handleClick} onContextMenu={onContextMenu} title={profile.url}>
      {isEmoji
        ? <span style={{ fontSize: 16, minWidth: 20, flexShrink: 0, textAlign: 'center' }}>{iconStr}</span>
        : <img src={iconStr} alt="" style={{ width: 18, height: 18, flexShrink: 0, objectFit: 'contain', borderRadius: 3 }}
            onError={e => { e.target.style.display = 'none'; }} />
      }
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile.name}</span>
      {profile.favorite && <span style={{ fontSize: 10, opacity: 0.6 }}>{ICONS.STAR}</span>}
      {profile.notifs && <span style={{ fontSize: 10, opacity: 0.6 }}>{ICONS.BELL}</span>}
    </div>
  );
}