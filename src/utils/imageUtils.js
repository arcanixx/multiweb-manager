// =============================================================================
// FILE: imageUtils.js
// PATH: src/utils/imageUtils.js
// VERSION: 0.0.3
// PURPOSE: Funkcje pomocnicze do manipulacji plikami graficznymi (resize, format conversion) oparte na silniku sharp.
// FUNCTIONS: resizeImage, convertImage, compressJpeg
// DEPENDS ON: sharp, logger.js
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
    logInfo("tools", "resizeImage success", { inputPath, width, height, outputPath });
    return outputPath;
  } catch (err) {
    logError("tools", "resizeImage failed", { inputPath, error: err.message });
    logWarn("tools", "Nie można zmienić rozmiaru obrazu");
    // In a real implementation, the calling code would show a toast here for user feedback
    // For example: showToast(`Failed to resize image: ${err.message}`, 'error');
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
    logInfo("tools", "convertImage success", { inputPath, format, outputPath });
    return outputPath;
  } catch (err) {
    logError("tools", "convertImage failed", { inputPath, format, error: err.message });
    logWarn("tools", "Nie można skonwertować obrazu");
    // In a real implementation, the calling code would show a toast here for user feedback
    // For example: showToast(`Failed to convert image: ${err.message}`, 'error');
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
    logInfo("tools", "compressJpeg success", { inputPath, quality, outputPath });
    return outputPath;
  } catch (err) {
    logError("tools", "compressJpeg failed", { inputPath, quality, error: err.message });
    logWarn("tools", "Nie można skompresować obrazu JPEG");
    // In a real implementation, the calling code would show a toast here for user feedback
    // For example: showToast(`Failed to compress JPEG: ${err.message}`, 'error');
    throw err;
  }
}