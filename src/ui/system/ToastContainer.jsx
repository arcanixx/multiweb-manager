// =============================================================================
// FILE: ToastContainer.jsx
// PATH: src/ui/system/ToastContainer.jsx
// VERSION: 0.0.3
// PURPOSE: Globalny kontener toastów z kolejką FIFO i animowanym stackiem. Subskrybuje się na CustomEvent 'mwm:toast' z notificationsManager.js. Zarządza stanem przez useReducer — max 3 aktywne jednocześnie, pozostałe czekają w kolejce.
// FUNCTIONS: ToastContainer
// DEPENDS ON: react, icons.js, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useReducer, useEffect, useRef, useCallback } from "react";
import { ICONS } from "../../utils/icons.js";
import { logDebug } from "../../utils/loggerRenderer.js";

// ─── STAŁE ──────────────────────────────────────────────────────────────────
const MAX_ACTIVE    = 3;       // Maksymalna liczba widocznych toastów jednocześnie
const VISIBLE_MS    = 2000;    // Czas widoczności toastu (ms)
const ANIMATE_MS    = 300;     // Czas animacji wejścia/wyjścia (ms)
const TOAST_EVENT   = "mwm:toast";

// ─── KONFIGURACJA TYPÓW TOASTÓW ──────────────────────────────────────────────
// Definiuje ikony i klasy CSS dla każdego typu — jeden obiekt jako source of truth.
// Dodanie nowego typu = jedna linia tutaj, nic więcej.
const TOAST_CONFIG = {
  success: { icon: ICONS.SUCCESS,  bgVar: "var(--success)",  textColor: "#fff",     label: "Sukces"     },
  error:   { icon: ICONS.ERROR,    bgVar: "var(--danger)",   textColor: "#fff",     label: "Błąd"       },
  warning: { icon: ICONS.WARNING,  bgVar: "var(--warning)",  textColor: "#1e293b",  label: "Ostrzeżenie" },
  info:    { icon: ICONS.INFO,     bgVar: "var(--accent)",   textColor: "#fff",     label: "Info"       },
};

// ─── REDUCER ─────────────────────────────────────────────────────────────────

const initialState = {
  active: [],   // Aktualnie widoczne toasty (max MAX_ACTIVE)
  queue:  [],   // Czekające na wyświetlenie
};

// Obsługiwane akcje:
//   PUSH    – dodanie nowego toastu do systemu
//   DISMISS – oznaczenie toastu jako wychodzącego (uruchamia animację exit)
//   REMOVE  – usunięcie toastu po zakończeniu animacji exit + promocja z kolejki
function toastReducer(state, action) {
  switch (action.type) {
    case "PUSH": {
      const toast = action.payload;
      // Jeśli jest miejsce — od razu aktywuj; w przeciwnym razie kolejkuj
      if (state.active.length < MAX_ACTIVE) {
        return { ...state, active: [...state.active, { ...toast, exiting: false }] };
      }
      return { ...state, queue: [...state.queue, toast] };
    }

    case "DISMISS": {
      // Oznacz toast jako wychodzący — CSS zacznie animację exit
      return {
        ...state,
        active: state.active.map((t) =>
          t.id === action.id ? { ...t, exiting: true } : t
        ),
      };
    }

    case "REMOVE": {
      // Usuń toast po animacji; jeśli coś czeka w kolejce — przenieś do active
      const remaining = state.active.filter((t) => t.id !== action.id);
      const [next, ...restQueue] = state.queue;
      const newActive = next
        ? [...remaining, { ...next, exiting: false }]
        : remaining;
      return { active: newActive, queue: restQueue };
    }

    default:
      return state;
  }
}

// ─── ToastItem — pojedynczy toast ────────────────────────────────────────────
function ToastItem({ toast, onDismiss }) {
  const config = TOAST_CONFIG[toast.type] ?? TOAST_CONFIG.info;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`toast-item ${toast.exiting ? "toast-exit" : "toast-enter"}`}
      style={{
        background:   config.bgVar,
        color:        config.textColor,
        borderRadius: "var(--radius)",
        padding:      "10px 14px",
        boxShadow:    "var(--shadow-md)",
        display:      "flex",
        alignItems:   "center",
        gap:          "8px",
        fontSize:     "13px",
        fontWeight:   500,
        minWidth:     "220px",
        maxWidth:     "380px",
        pointerEvents: "auto",
        cursor:       "default",
        userSelect:   "none",
      }}
    >
      {/* Ikona typu */}
      <span style={{ fontSize: 15, flexShrink: 0 }}>{config.icon}</span>

      {/* Treść */}
      <span style={{ flex: 1, lineHeight: 1.4 }}>{toast.message}</span>

      {/* Przycisk zamknięcia */}
      <button
        onClick={onDismiss}
        aria-label="Zamknij powiadomienie"
        style={{
          background:  "transparent",
          border:      "none",
          color:       "inherit",
          cursor:      "pointer",
          padding:     "0 2px",
          fontSize:    12,
          opacity:     0.7,
          flexShrink:  0,
        }}
      >
        {ICONS.CLOSE}
      </button>
    </div>
  );
}

// ─── ToastContainer — główny kontener ────────────────────────────────────────
//   @param {boolean} props.enabled – czy toasty są włączone (z settings.toastsEnabled)
export default function ToastContainer({ enabled = true }) {
  const [state, dispatch] = useReducer(toastReducer, initialState);

  // Refy dla timerów — żeby cleanup był deterministyczny przy szybkich zmianach
  const timersRef = useRef(new Map());

  // ─── scheduleToastLifecycle() – planuje DISMISS i REMOVE dla danego toastu
  const scheduleToastLifecycle = useCallback((id) => {
    // DISMISS po VISIBLE_MS — uruchamia animację exit
    const dismissTimer = setTimeout(() => {
      dispatch({ type: "DISMISS", id });

      // REMOVE po animacji exit
      const removeTimer = setTimeout(() => {
        dispatch({ type: "REMOVE", id });
        timersRef.current.delete(id);
        logDebug("ui", `ToastContainer: removed toast ${id}`);
      }, ANIMATE_MS);

      // Zachowaj ref do remove timera pod tym samym kluczem
      timersRef.current.set(id, removeTimer);
    }, VISIBLE_MS);

    timersRef.current.set(id, dismissTimer);
  }, []);

  // ─── handleDismiss() – natychmiastowe zamknięcie przez użytkownika
  const handleDismiss = useCallback((id) => {
    // Anuluj zaplanowane timery dla tego toastu
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    dispatch({ type: "DISMISS", id });
    setTimeout(() => dispatch({ type: "REMOVE", id }), ANIMATE_MS);
  }, []);

  // ─── useEffect – subskrybuj CustomEvent z notificationsManager
  useEffect(() => {
    const handleToastEvent = (event) => {
      if (!enabled) return;
      const { id, type, message } = event.detail;
      logDebug("ui", `ToastContainer: received toast [${type}] ${message}`);
      dispatch({ type: "PUSH", payload: { id, type, message } });
      // Cykl życia planujemy gdy toast wejdzie do active — przez obserwację stanu
      // Zamiast planować tu (state może być stale), planujemy w osobnym useEffect na active
    };

    window.addEventListener(TOAST_EVENT, handleToastEvent);
    return () => window.removeEventListener(TOAST_EVENT, handleToastEvent);
  }, [enabled]);

  // ─── useEffect – planuje lifecycle dla nowo dodanych toastów (nie exiting)
  useEffect(() => {
    state.active.forEach((toast) => {
      // Planuj tylko dla toastów bez aktywnego timera i nie będących w trakcie exit
      if (!toast.exiting && !timersRef.current.has(toast.id)) {
        scheduleToastLifecycle(toast.id);
      }
    });
  }, [state.active, scheduleToastLifecycle]);

  // ─── Cleanup timerów przy unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, []);

  // Nie renderuj kontenera gdy nie ma toastów
  if (state.active.length === 0) return null;

  return (
    <div
      aria-label="Powiadomienia"
      style={{
        position:       "fixed",
        bottom:         "20px",
        right:          "20px",
        display:        "flex",
        flexDirection:  "column-reverse", // Nowe toasty wjeżdżają od dołu
        gap:            "8px",
        zIndex:         9000,             // Poniżej modali (20000), powyżej reszty UI
        pointerEvents:  "none",           // Kontener nie blokuje kliknięć — tylko ToastItem
      }}
    >
      {state.active.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={() => handleDismiss(toast.id)}
        />
      ))}
    </div>
  );
}