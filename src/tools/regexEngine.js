// =============================================================================
// FILE: regexEngine.js
// PATH: src/tools/regexEngine.js
// VERSION: 0.0.3
// PURPOSE: Helper do testowania wyrażeń regularnych
//          - testRegex(pattern, flags, text)
//            zwraca tablicę wszystkich dopasowań z podanego tekstu
// =============================================================================

export function testRegex(pattern, flags, text) {
  const regex = new RegExp(pattern, flags || "");
  return [...text.matchAll(regex)];
}

// =============================================================================
// END OF FILE
// =============================================================================
