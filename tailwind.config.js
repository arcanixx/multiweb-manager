// =============================================================================
// FILE: tailwind.config.js
// PATH: tailwind.config.js
// VERSION: 0.0.3
// PURPOSE: Konfiguracja Tailwind CSS v3 dla warstwy renderera (React).
// FUNCTIONS: -
// DEPENDS ON: -
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Skanowanie plików renderera – tylko src/ i public/index.html.
  // Pliki main.js, preload.cjs i config.js są procesem głównym (Node.js),
  // nie używają klas Tailwind.
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  // Dark mode przez klasę (przełączany przez Settings – dark-mode toggle).
  // Klasa 'dark' dodawana na <html> lub <body> przez App.jsx.
  darkMode: 'class',
  theme: {
    extend: {
      // Miejsce na niestandardowe tokeny projektu (kolory, fonty, spacing).
      // Docelowo zsynchronizować z src/ui/styles/theme.css (CSS variables).
    },
  },
  plugins: [],
}

