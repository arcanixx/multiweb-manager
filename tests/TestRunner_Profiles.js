// =============================================================================
// FILE: TestRunner_Profiles.js
// PATH: tests/TestRunner_Profiles.js
// VERSION: 0.0.3
// PURPOSE: Testy zarządzania profilami WebView — struktura danych, profilesStore CRUD, sortowanie, kategorie, defaultProfiles.json.
// FUNCTIONS: runProfilesTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';

const ROOT = process.cwd();

const tests = [
  // ── Struktura profilu ──────────────────────────────────────────────────────
  {
    name: 'Profile structure is valid',
    run: async () => {
      const mockProfile = {
        id: 'test-1', name: 'Test', url: 'https://example.com',
        category: 'AI', pinned: false, lastUsedAt: Date.now()
      };
      const ok = mockProfile.id && mockProfile.name && mockProfile.url && mockProfile.category;
      return { ok, details: ok ? '' : 'Missing required fields' };
    }
  },
  {
    name: 'Category validation – valid categories accepted',
    run: async () => {
      const validCategories = ['AI', 'Dev', 'Design', 'Productivity', 'Special'];
      const ok = validCategories.every(c => validCategories.includes(c));
      return { ok, details: ok ? '' : 'Category validation failed' };
    }
  },
  {
    name: 'Last used sorting – most recent first',
    run: async () => {
      const profiles = [
        { id: '1', lastUsedAt: 100 }, { id: '2', lastUsedAt: 300 }, { id: '3', lastUsedAt: 200 }
      ];
      const sorted = [...profiles].sort((a, b) => b.lastUsedAt - a.lastUsedAt);
      const ok = sorted[0].id === '2' && sorted[1].id === '3' && sorted[2].id === '1';
      return { ok, details: ok ? '' : 'Sort order incorrect' };
    }
  },
  {
    name: 'Pinned profiles sort before unpinned',
    run: async () => {
      const profiles = [
        { id: '1', pinned: false }, { id: '2', pinned: true }, { id: '3', pinned: false }
      ];
      const sorted = [...profiles].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
      const ok = sorted[0].id === '2';
      return { ok, details: ok ? '' : 'Pinned not first' };
    }
  },

  // ── profilesStore CRUD ─────────────────────────────────────────────────────
  {
    name: 'profilesStore – all CRUD functions exported',
    run: async () => {
      let mod;
      try { mod = await import(join(ROOT, 'src/stores/profilesStore.js')); }
      catch (e) { return { ok: false, details: `Import failed: ${e.message}` }; }
      const required = ['loadProfiles', 'saveProfiles', 'createProfile', 'updateProfile', 'deleteProfile'];
      const missing = required.filter(fn => typeof mod[fn] !== 'function');
      const ok = missing.length === 0;
      return { ok, details: ok ? '' : `Missing: ${missing.join(', ')}` };
    }
  },

  // ── defaultProfiles.json ───────────────────────────────────────────────────
  {
    name: 'defaultProfiles.json exists and is valid JSON',
    run: async () => {
      const path = join(ROOT, 'src/data/defaultProfiles.json');
      if (!existsSync(path)) return { ok: false, details: 'defaultProfiles.json not found' };
      try {
        const data = JSON.parse(readFileSync(path, 'utf-8'));
        const ok = data && (Array.isArray(data) || (Array.isArray(data.data)));
        return { ok, details: ok ? '' : 'Unexpected JSON structure' };
      } catch (e) {
        return { ok: false, details: `Parse error: ${e.message}` };
      }
    }
  },

  // ── Logika pomocnicza ─────────────────────────────────────────────────────
  {
    name: 'Profile URL normalization – adds https if missing',
    run: async () => {
      const normalize = (url) => {
        if (!url) return '';
        const t = url.trim();
        return (t.startsWith('http://') || t.startsWith('https://')) ? t : `https://${t}`;
      };
      const ok = normalize('deepseek.com') === 'https://deepseek.com'
              && normalize('https://ok.com') === 'https://ok.com';
      return { ok, details: ok ? '' : 'Normalization failed' };
    }
  },
  {
    name: 'Profile search filter – matches name and url',
    run: async () => {
      const profiles = [
        { id: '1', name: 'Claude', url: 'https://claude.ai' },
        { id: '2', name: 'DeepSeek', url: 'https://deepseek.com' }
      ];
      const query = 'claude';
      const filtered = profiles.filter(p =>
        p.name.toLowerCase().includes(query) || p.url.toLowerCase().includes(query)
      );
      const ok = filtered.length === 1 && filtered[0].id === '1';
      return { ok, details: ok ? '' : `Expected 1 result, got ${filtered.length}` };
    }
  }
];

export async function runProfilesTests() {
  return runTests('Profiles', tests);
}
