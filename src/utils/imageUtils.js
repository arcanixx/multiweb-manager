// =============================================================================
// FILE: imageUtils.js
// PATH: src/utils/imageUtils.js
// VERSION: 0.0.3
// PURPOSE: Helpers for image operations – thin wrappers around sharp.
//          - resizeImage(inputPath, width, height, outputPath)
//          - convertImage(inputPath, format, outputPath)
//          - compressJpeg(inputPath, quality, outputPath)
//          Używane przez ipcMainHandlers_tools.js i src/tools/imageProcessor.js
// DEPENDS ON: sharp
// =============================================================================

import sharp from "sharp";

// ----------------------------------------------------------------
// resizeImage() – zmienia rozmiar obrazu do podanych wymiarów
// ----------------------------------------------------------------
export async function resizeImage(inputPath, width, height, outputPath) {
  await sharp(inputPath).resize(width, height).toFile(outputPath);
  return outputPath;
}

// ----------------------------------------------------------------
// convertImage() – konwertuje obraz do podanego formatu (png/jpg/webp...)
// ----------------------------------------------------------------
export async function convertImage(inputPath, format, outputPath) {
  await sharp(inputPath).toFormat(format).toFile(outputPath);
  return outputPath;
}

// ----------------------------------------------------------------
// compressJpeg() – kompresuje JPEG do podanej jakości (1–100)
// ----------------------------------------------------------------
export async function compressJpeg(inputPath, quality, outputPath) {
  await sharp(inputPath).jpeg({ quality }).toFile(outputPath);
  return outputPath;
}

// =============================================================================
// END OF FILE
// =============================================================================
