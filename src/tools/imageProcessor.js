// =============================================================================
// FILE: imageProcessor.js
// PATH: src/tools/imageProcessor.js
// VERSION: 0.0.3
// PURPOSE: Helpery do przetwarzania obrazów (resize, konwersja formatu, kompresja)
//          - resize(input, w, h, out)       zmienia rozmiar obrazu
//          - convert(input, format, out)    konwertuje format (np. png → webp)
//          - compress(input, quality, out)  kompresuje obraz do JPEG z podaną jakością
// =============================================================================

import sharp from "sharp";

export async function resize(input, w, h, out) {
  await sharp(input).resize(w, h).toFile(out);
  return out;
}

export async function convert(input, format, out) {
  await sharp(input).toFormat(format).toFile(out);
  return out;
}

export async function compress(input, quality, out) {
  await sharp(input).jpeg({ quality }).toFile(out);
  return out;
}

// =============================================================================
// END OF FILE
// =============================================================================
