// =============================================================================
// FILE: index.js
// PATH: src/data/appLibrary/index.js
// VERSION: 0.0.3
// PURPOSE: Agregator biblioteki aplikacji – łączy kategorie JSON w jeden obiekt.
// FUNCTIONS: APP_LIBRARY
// DEPENDS ON: icons.js, appLibrary.AI.json, appLibrary.DEV.json, appLibrary.PRODUCTIVITY.json, appLibrary.COMMUNICATION.json, appLibrary.SOCIAL.json, appLibrary.DESIGN.json, appLibrary.CLOUD.json, appLibrary.ENTERTAINMENT.json
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ICONS } from '../../utils/icons.js';
import aiApps from './appLibrary.AI.json';
import devApps from './appLibrary.DEV.json';
import productivityApps from './appLibrary.PRODUCTIVITY.json';
import communicationApps from './appLibrary.COMMUNICATION.json';
import socialApps from './appLibrary.SOCIAL.json';
import designApps from './appLibrary.DESIGN.json';
import cloudApps from './appLibrary.CLOUD.json';
import entertainmentApps from './appLibrary.ENTERTAINMENT.json';

export const APP_LIBRARY = {
  categories: [
    { id: 'ai', name: 'appLibrary.cat_ai', icon: ICONS.CAT_AI },
    { id: 'dev', name: 'appLibrary.cat_dev', icon: ICONS.CAT_DEV },
    { id: 'productivity', name: 'appLibrary.cat_productivity', icon: ICONS.CAT_PRODUCTIVITY },
    { id: 'communication', name: 'appLibrary.cat_communication', icon: ICONS.CAT_COMMUNICATION },
    { id: 'social', name: 'appLibrary.cat_social', icon: ICONS.CAT_SOCIAL },
    { id: 'design', name: 'appLibrary.cat_design', icon: ICONS.CAT_DESIGN },
    { id: 'cloud', name: 'appLibrary.cat_cloud', icon: ICONS.CAT_CLOUD },
    { id: 'entertainment', name: 'appLibrary.cat_entertainment', icon: ICONS.CAT_ENTERTAINMENT }
  ],
  apps: [
    ...aiApps, 
    ...devApps, 
    ...productivityApps,
    ...communicationApps,
    ...socialApps,
    ...designApps,
    ...cloudApps,
    ...entertainmentApps
  ]
};