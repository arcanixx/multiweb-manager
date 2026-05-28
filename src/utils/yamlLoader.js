// =============================================================================
// FILE: yamlLoader.js
// PATH: src/utils/yamlLoader.js
// VERSION: 0.0.3
// PURPOSE: Leniwe ładowanie modułu js-yaml (parsowanie/serializacja YAML) z obsługą braku zależności
// FUNCTIONS: loadYaml
// DEPENDS ON: komponenty z folderu yaml/
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { logWarn } from './logger.js';
// ─── loadYaml() – próbuje załadować js-yaml; zwraca null jeśli moduł niedostępny
//   @returns {Object|null} – instancja js-yaml lub null
export async function loadYaml() {
  try {
    return (await import('js-yaml')).default;
  } catch {
    logWarn('yamlLoader: moduł js-yaml niedostępny – operacje YAML wyłączone');
    return null;
  }
}
