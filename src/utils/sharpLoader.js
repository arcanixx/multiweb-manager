// =============================================================================
// FILE: sharpLoader.js
// PATH: src/utils/sharpLoader.js
// VERSION: 0.0.3
// PURPOSE: Leniwe ładowanie modułu sharp (przetwarzanie obrazów) z obsługą braku zależności. Używane przez ipcMainHandlers_imageSharp.js w main process.
// FUNCTIONS: loadSharp
// DEPENDS ON: komponenty z folderu sharp/
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { logWarn } from './logger.js';
// ─── loadSharp() – próbuje załadować sharp; zwraca null jeśli moduł niedostępny
//   @returns {Object|null} – instancja sharp lub null
export async function loadSharp() {
  try {
    return (await import('sharp')).default;
  } catch {
    logWarn('ui', 'sharpLoader: moduł sharp niedostępny – operacje na obrazach wyłączone');
    return null;
  }
}
