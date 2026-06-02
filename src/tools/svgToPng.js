// =============================================================================
// FILE: svgToPng.js
// PATH: src/tools/svgToPng.js
// VERSION: 0.0.3
// PURPOSE: Konwersja pliku SVG do PNG przy użyciu sharp svgToPng(svgPath, outputPath, width, height)
//          odczytuje SVG z dysku, renderuje do PNG o podanych wymiarach
//          i zapisuje wynik pod outputPath
// FUNCTIONS: svgToPng
// DEPENDS ON: fs, sharp, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import fs from "fs";
import sharp from "sharp";
import { logDebug, logError } from "../utils/logger.js";

// ─── svgToPng() – Odczytuje plik wejściowy SVG z dysku, przeprowadza jego konwersję do formatu PNG przy użyciu biblioteki sharp, po czym zapisuje wynikowy plik graficzny we wskazanej lokalizacji
export async function svgToPng(svgPath, outputPath, width, height) {
  try {
    logDebug('tools', `svgToPng: ${svgPath} → ${width}x${height} → ${outputPath}`);
    if (!fs.existsSync(svgPath)) {
      throw new Error(`SVG file not found: ${svgPath}`);
    }
    const svg = fs.readFileSync(svgPath, "utf8");
    const png = await sharp(Buffer.from(svg))
      .resize(width, height)
      .png()
      .toBuffer();
    fs.writeFileSync(outputPath, png);
    logDebug('tools', `svgToPng: successfully converted to ${outputPath}`);
    return outputPath;
  } catch (err) {
    logError('tools', "svgToPng failed", err);
    throw err;
  }
}