// =============================================================================
// FILE: toastConfig.js
// PATH: src/ui/system/toast/toastConfig.js
// VERSION: 0.0.3
// PURPOSE: Konfiguracja systemu toastów – stałe czasowe, nazwy eventów i mapowanie typów na style
// FUNCTIONS: TOAST_CONFIG, MAX_ACTIVE, VISIBLE_MS, ANIMATE_MS, TOAST_EVENT
// DEPENDS ON: icons.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ICONS } from '../../../utils/icons.js';

export const MAX_ACTIVE  = 3;
export const VISIBLE_MS  = 2000;
export const ANIMATE_MS  = 300;
export const TOAST_EVENT = 'mwm:toast';

// ─── TOAST_CONFIG – ikony i style per typ toastu
// Dodanie nowego typu = jedna linia tutaj, nic więcej.
export const TOAST_CONFIG = {
  success: { icon: ICONS.SUCCESS, bgVar: 'var(--success)', textColor: '#fff',     label: 'Sukces'      },
  error:   { icon: ICONS.ERROR,   bgVar: 'var(--danger)',  textColor: '#fff',     label: 'Błąd'        },
  warning: { icon: ICONS.WARNING, bgVar: 'var(--warning)', textColor: '#1e293b',  label: 'Ostrzeżenie' },
  info:    { icon: ICONS.INFO,    bgVar: 'var(--accent)',  textColor: '#fff',     label: 'Info'        },
};
