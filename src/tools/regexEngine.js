// =============================================================================
// FILE: regexEngine.js
// PATH: src/tools/regexEngine.js
// VERSION: 0.0.3
// PURPOSE: Helper do testowania wyrażeń regularnych testRegex(pattern, flags, text)
//          zwraca tablicę wszystkich dopasowań z podanego tekstu
// FUNCTIONS: testRegex
// DEPENDS ON: logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { logDebug, logError } from "../utils/logger.js";
export function testRegex(pattern, flags, text) {
  try {
    logDebug(`regexEngine.testRegex: pattern="${pattern}", flags="${flags}"`);
    const regex = new RegExp(pattern, flags || "");
    const matches = [...text.matchAll(regex)];
    logDebug(`regexEngine.testRegex: found ${matches.length} matches`);
    return matches;
  } catch (err) {
    logError("regexEngine.testRegex failed", err);
    throw err;
  }
}