// =============================================================================
// FILE:       tailwind.config.js
// PATH:       tailwind.config.js
// VERSION:    0.0.3
// PURPOSE:    Konfiguracja Tailwind CSS v3 dla warstwy renderera (React).
//             Skanuje pliki w src/ i public/index.html. Wspiera dark mode.
//             Tokeny kolorystyczne zsynchronizowane z src/ui/styles/theme.css.
// FUNCTIONS:  -
// DEPENDS ON: tailwindcss, autoprefixer
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
      // Synchronizacja z src/ui/styles/theme.css (CSS variables)
      colors: {
        // Główne kolory interfejsu
        primary: 'var(--bg-primary)',
        secondary: 'var(--bg-secondary)',
        sidebar: 'var(--bg-sidebar)',
        card: 'var(--bg-card)',
        hover: 'var(--bg-hover)',
        active: 'var(--bg-active)',

        // Akcent i stany
        accent: 'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
        'accent-text': 'var(--accent-text)',

        // Statusy
        success: 'var(--success)',
        danger: 'var(--danger)',
        warning: 'var(--warning)',
        info: 'var(--info)',

        // Tekst
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },

        // Border – zgodnie z nazwami w theme.css
        border: {
          DEFAULT: 'var(--border)',
          active: 'var(--border-active)',
        },
      },

      // Shadow (jeśli używasz)
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
      },

      // Border radius
      borderRadius: {
        DEFAULT: 'var(--radius)',
      },

      // Width (sidebar, taskpanel)
      width: {
        sidebar: 'var(--sidebar-width)',
        taskpanel: 'var(--taskpanel-width)',
      },
    },
  },

  plugins: [],
}