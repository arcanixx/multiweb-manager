// =============================================================================
// FILE: config.js
// PATH: src/config.js
// VERSION: 0.0.3
// PURPOSE: Re-eksport centralnej konfiguracji aplikacji z src/config/*.
//          Wszystkie importy from '../config.js' lub '../../config.js' trafiają tutaj.
//          Nie modyfikuj tego pliku bezpośrednio – edytuj podpliki w src/config/.
// FUNCTIONS: -
// DEPENDS ON: app.js, features.js, limits.js, paths.js, settings.js, endpoints.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

export * from './config/app.js';
export * from './config/features.js';
export * from './config/limits.js';
export * from './config/paths.js';
export * from './config/settings.js';
export * from './config/endpoints.js';