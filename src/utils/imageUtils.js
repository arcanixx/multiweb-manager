// =============================================================================
// FILE: imageUtils.js
// PATH: src/utils/imageUtils.js
// VERSION: 0.0.3
// PURPOSE: Operacje na obrazach – resize, konwersja formatów, kompresja JPEG (resizeImage, convertImage, compressJpeg).
// FUNCTIONS: resizeImage, convertImage, compressJpeg
// DEPENDS ON: sharp
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import sharp from "sharp";
import { logInfo, logError, logWarn, logDebug } from './logger.js';

// ─── resizeImage() – zmienia rozmiar obrazu do podanych wymiarów
//   @param {string} inputPath – ścieżka do pliku wejściowego
//   @param {number} width – szerokość docelowa
//   @param {number} height – wysokość docelowa
//   @param {string} outputPath – ścieżka wyjściowa
//   @returns {Promise<string>} ścieżka do przetworzonego pliku

export async function resizeImage(inputPath, width, height, outputPath) {
  try {
    await sharp(inputPath).resize(width, height).toFile(outputPath);
    logInfo("resizeImage", { inputPath, width, height, outputPath });
    return outputPath;
  } catch (err) {
    logError("resizeImage failed", { inputPath, err });
    logWarn("Nie można zmienić rozmiaru obrazu");
    throw err;
  }
}

// ─── convertImage() – konwertuje obraz do podanego formatu (png/jpg/webp)
//   @param {string} inputPath – ścieżka do pliku wejściowego
//   @param {string} format – format docelowy
//   @param {string} outputPath – ścieżka wyjściowa
//   @returns {Promise<string>} ścieżka do przetworzonego pliku

export async function convertImage(inputPath, format, outputPath) {
  try {
    await sharp(inputPath).toFormat(format).toFile(outputPath);
    logInfo("convertImage", { inputPath, format, outputPath });
    return outputPath;
  } catch (err) {
    logError("convertImage failed", { inputPath, format, err });
    logWarn("Nie można skonwertować obrazu");
    throw err;
  }
}

// ─── compressJpeg() – kompresuje JPEG do podanej jakości (1-100)
//   @param {string} inputPath – ścieżka do pliku wejściowego
//   @param {number} quality – jakość kompresji
//   @param {string} outputPath – ścieżka wyjściowa
//   @returns {Promise<string>} ścieżka do przetworzonego pliku

export async function compressJpeg(inputPath, quality, outputPath) {
  try {
    await sharp(inputPath).jpeg({ quality }).toFile(outputPath);
    logInfo("compressJpeg", { inputPath, quality, outputPath });
    return outputPath;
  } catch (err) {
    logError("compressJpeg failed", { inputPath, quality, err });
    logWarn("Nie można skompresować obrazu JPEG");
    throw err;
  }
}
