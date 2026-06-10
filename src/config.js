// =============================================================================
// FILE: config.js
// PATH: src/config.js
// VERSION: 0.0.3
// PURPOSE: Re-eksport centralnej konfiguracji aplikacji z src/config/*.
//          Wszystkie importy from '../config.js' lub '../../config.js' trafiają tutaj.
//          Nie modyfikuj tego pliku bezpośrednio – edytuj podpliki w src/config/.
// FUNCTIONS: -
// DEPENDS ON: appConfig.js, featuresConfig.js, limitsConfig.js, pathsConfig.js, settingsConfig.js, endpointsConfig.js, onboardingConfig.js, settingsRegistryConfig.js, toastConfig.js, toolsRegistryConfig.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

export * from './config/appConfig.js';
export * from './config/featuresConfig.js';
export * from './config/limitsConfig.js';
export * from './config/pathsConfig.js';
export * from './config/settingsConfig.js';
export * from './config/endpointsConfig.js';
export * from './config/onboardingConfig.js';
export * from './config/settingsRegistryConfig.js';
export * from './config/toastConfig.js';
export * from './config/toolsRegistryConfig.js';
