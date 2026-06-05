// =============================================================================
// FILE: StorageService.js
// PATH: src/utils/StorageService.js
// VERSION: 0.0.3
// PURPOSE: Centralna warstwa dostępu do danych w procesie renderera – cache per klucz z TTL, pattern observer (subscribe/notify), ujednolicone invoke do IPC, deduplicacja równoległych żądań. Używana przez hooki danych (useProfiles, useSettings i inne).
// FUNCTIONS: -
// DEPENDS ON: loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { logDebug, logError, logWarn } from '../utils/loggerRenderer.js';

// ─── CACHE_TTL_MS – czas ważności cache przed wymuszonym odświeżeniem z IPC (ms)
// UWAGA: Ta stała celowo pozostaje w tym pliku – dotyczy wyłącznie logiki StorageService.
const CACHE_TTL_MS = 30_000; // 30 sekund

// ─── IPC_CHANNEL_MAP – mapowanie kluczy StorageService na kanały IPC
// Wzorzec: { get: 'klucz:get', set: 'klucz:update' }
// UWAGA: Ta stała celowo pozostaje w tym pliku – ściśle powiązana z logiką StorageService.
const IPC_CHANNEL_MAP = {
  profiles:   { get: 'profiles:getAll',    set: 'profiles:update'    },
  settings:   { get: 'settings:get',       set: 'settings:update'    },
  workspaces: { get: 'workspaces:getAll',  set: 'workspaces:save'    },
  projects:   { get: 'projects:getAll',    set: 'projects:update'    },
  history:    { get: 'history:getAll',     set: null                  }, // read-only
  tasks:      { get: 'tasks:getAll',       set: 'tasks:update'       },
};

// =============================================================================
// ─── StorageService – klasa zarządzająca dostępem do danych przez IPC
// =============================================================================
class StorageService {
  // ─── #cache – mapa: klucz → { data, ts } (timestamp ostatniego zapisu)
  #cache = new Map();

  // ─── #subscribers – mapa: klucz → Set<callback>
  #subscribers = new Map();

  // ─── #pending – mapa: klucz → Promise (deduplicacja równoległych wywołań get)
  #pending = new Map();

  // ─── #getChannels() – zwraca kanały IPC dla klucza lub rzuca błąd
  //   @param {string} key – klucz danych (np. 'profiles')
  //   @returns {{ get: string, set: string|null }}
  #getChannels(key) {
    const channels = IPC_CHANNEL_MAP[key];
    if (!channels) {
      const err = `StorageService: unknown key "${key}". Add it to IPC_CHANNEL_MAP.`;
      logError('store', err);
      throw new Error(err);
    }
    return channels;
  }

  // ─── #isCacheValid() – sprawdza czy cache dla klucza jest aktualny (w TTL)
  #isCacheValid(key) {
    const entry = this.#cache.get(key);
    if (!entry) return false;
    return Date.now() - entry.ts < CACHE_TTL_MS;
  }

  // ─── #notify() – powiadamia wszystkich subskrybentów klucza o nowych danych
  //   @param {string} key  – klucz danych
  //   @param {any}    data – nowe dane
  #notify(key, data) {
    const subs = this.#subscribers.get(key);
    if (!subs || subs.size === 0) return;
    logDebug('store', `StorageService: notifying ${subs.size} subscriber(s) for "${key}"`);
    subs.forEach(cb => {
      try { cb(data); }
      catch (err) { logError('store', `StorageService: subscriber error for "${key}"`, err.message); }
    });
  }

  // ─── get() – pobiera dane (z cache lub przez IPC)
  //   @param {string}  key     – klucz danych
  //   @param {boolean} [force] – wymuś pominięcie cache (domyślnie false)
  //   @returns {Promise<any>}  – dane lub null przy błędzie
  async get(key, force = false) {
    this.#getChannels(key); // walidacja klucza

    // Zwróć cache jeśli aktualny i nie wymuszono odświeżenia
    if (!force && this.#isCacheValid(key)) {
      logDebug('store', `StorageService.get: cache hit for "${key}"`);
      return this.#cache.get(key).data;
    }

    // Deduplicacja równoległych żądań dla tego samego klucza
    if (this.#pending.has(key)) {
      logDebug('store', `StorageService.get: deduped pending request for "${key}"`);
      return this.#pending.get(key);
    }

    const channels = this.#getChannels(key);
    const promise = (async () => {
      try {
        logDebug('store', `StorageService.get: IPC invoke "${channels.get}"`);
        const res = await window.electronAPI.invoke(channels.get);
        if (res?.ok === false) {
          logError('store', `StorageService.get failed for "${key}"`, res.error);
          return this.#cache.get(key)?.data ?? null; // stale cache jako fallback
        }
        const data = res?.data !== undefined ? res.data : res;
        this.#cache.set(key, { data, ts: Date.now() });
        logDebug('store', `StorageService.get: cached "${key}"`, Array.isArray(data) ? data.length : typeof data);
        return data;
      } catch (err) {
        logError('store', `StorageService.get exception for "${key}"`, err.message);
        return this.#cache.get(key)?.data ?? null;
      } finally {
        this.#pending.delete(key);
      }
    })();

    this.#pending.set(key, promise);
    return promise;
  }

  // ─── set() – zapisuje dane przez IPC, aktualizuje cache i powiadamia subskrybentów
  //   @param {string} key  – klucz danych
  //   @param {any}    data – dane do zapisania (payload przekazywany do IPC)
  //   @returns {Promise<{ ok: boolean, data?: any, error?: string }>}
  async set(key, data) {
    const channels = this.#getChannels(key);
    if (!channels.set) {
      logWarn('store', `StorageService.set: key "${key}" is read-only`);
      return { ok: false, error: 'READ_ONLY' };
    }

    try {
      logDebug('store', `StorageService.set: IPC invoke "${channels.set}"`);
      const res = await window.electronAPI.invoke(channels.set, data);

      if (res?.ok === false) {
        logError('store', `StorageService.set failed for "${key}"`, res.error);
        return { ok: false, error: res.error };
      }

      // Aktualizuj cache – preferuj dane z odpowiedzi (serwer może je transformować)
      const updated = res?.data !== undefined ? res.data : data;
      this.#cache.set(key, { data: updated, ts: Date.now() });

      // Powiadom subskrybentów o zmianie
      this.#notify(key, updated);

      logDebug('store', `StorageService.set success for "${key}"`);
      return { ok: true, data: updated };
    } catch (err) {
      logError('store', `StorageService.set exception for "${key}"`, err.message);
      return { ok: false, error: err.message };
    }
  }

  // ─── invalidate() – czyści cache dla klucza (wymusza IPC przy następnym get())
  //   @param {string} key – klucz danych
  invalidate(key) {
    this.#cache.delete(key);
    this.#pending.delete(key);
    logDebug('store', `StorageService.invalidate: cleared cache for "${key}"`);
  }

  // ─── invalidateAll() – czyści cały cache (np. po wylogowaniu)
  invalidateAll() {
    this.#cache.clear();
    this.#pending.clear();
    logDebug('store', 'StorageService.invalidateAll: cleared all cache');
  }

  // ─── subscribe() – rejestruje callback wywoływany przy każdej zmianie danych klucza
  //   @param {string}   key      – klucz danych
  //   @param {Function} callback – (data: any) => void
  //   @returns {Function}        – funkcja unsubscribe; wywołaj w cleanup useEffect:
  //                                useEffect(() => { return storageService.subscribe('profiles', cb); }, []);
  subscribe(key, callback) {
    if (!this.#subscribers.has(key)) {
      this.#subscribers.set(key, new Set());
    }
    this.#subscribers.get(key).add(callback);
    logDebug('store', `StorageService.subscribe: registered for "${key}" (total: ${this.#subscribers.get(key).size})`);

    return () => {
      const subs = this.#subscribers.get(key);
      if (subs) {
        subs.delete(callback);
        logDebug('store', `StorageService.unsubscribe: removed for "${key}" (remaining: ${subs.size})`);
      }
    };
  }

  // ─── getCacheSnapshot() – zwraca stan cache do debugowania (np. w DataLogsSection)
  //   @returns {Object} – mapa kluczy → { ts, size, ageMs, valid }
  getCacheSnapshot() {
    const snapshot = {};
    this.#cache.forEach((entry, key) => {
      snapshot[key] = {
        ts:    new Date(entry.ts).toISOString(),
        size:  Array.isArray(entry.data) ? entry.data.length : typeof entry.data,
        ageMs: Date.now() - entry.ts,
        valid: this.#isCacheValid(key),
      };
    });
    return snapshot;
  }
}

// ─── storageService – singleton eksportowany dla całej aplikacji renderera
// Jeden singleton = jeden cache = spójny stan między wszystkimi komponentami
export const storageService = new StorageService();