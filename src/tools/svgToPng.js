// =============================================================================
// FILE: svgToPng.js
// PATH: src/tools/svgToPng.js
// VERSION: 0.0.3
// PURPOSE: Konwersja pliku SVG do PNG przy użyciu sharp
//          - svgToPng(svgPath, outputPath, width, height)
//            odczytuje SVG z dysku, renderuje do PNG o podanych wymiarach
//            i zapisuje wynik pod outputPath
// =============================================================================

import fs from "fs";
import sharp from "sharp";

export async function svgToPng(svgPath, outputPath, width, height) {
  const svg = fs.readFileSync(svgPath, "utf8");
  const png = await sharp(Buffer.from(svg))
    .resize(width, height)
    .png()
    .toBuffer();

  fs.writeFileSync(outputPath, png);
  return outputPath;
}

// =============================================================================
// END OF FILE
// =============================================================================
