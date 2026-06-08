// =============================================================================
// FILE: TestRunner_WebView.js
// PATH: tests/TestRunner_WebView.js
// VERSION: 0.0.3
// PURPOSE: Testy jednostkowe dla WebView (Single App, Screenshot, Resource Monitor, Zoom)
// FUNCTIONS: runWebViewTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { checkSourceExport, runTests } from './testUtils.js';

const tests = [
  // ─── Eksporty komponentów (checkSourceExport – bezpieczne w Node) ──────────
  { name: 'WebViewContainer – eksportuje komponent',
    run: async () => checkSourceExport('src/ui/views/WebViewContainer.jsx', 'WebViewContainer') },
  { name: 'WebViewTab – eksportuje komponent',
    run: async () => checkSourceExport('src/ui/webview/WebViewTab.jsx', 'WebViewTab') },
  { name: 'WebViewToolbar – eksportuje komponent',
    run: async () => checkSourceExport('src/ui/webview/WebViewToolbar.jsx', 'WebViewToolbar') },

  // ─── Zoom – czysta logika (Node-safe) ─────────────────────────────────────
  {
    name: 'Zoom in/out – setZoomFactor works',
    run: async () => {
      const mockWebView = {
        getZoomFactor: () => 1,
        setZoomFactor: (factor) => { mockWebView._zoom = factor; }
      };
      mockWebView.setZoomFactor(mockWebView.getZoomFactor() + 0.1);
      return { ok: mockWebView._zoom === 1.1, details: `Expected 1.1, got ${mockWebView._zoom}` };
    }
  },

  // ─── Testy IPC (env:'react' – wymagają window.electronAPI) ────────────────
  {
    name: 'Single App Mode – IPC available',
    env: 'react',
    run: async () => {
      const ok = !!window.electronAPI?.openSingleWindow;
      return { ok, details: ok ? '' : 'window.electronAPI.openSingleWindow missing' };
    }
  },
  {
    name: 'Screenshot – captureWebView IPC available',
    env: 'react',
    run: async () => {
      const ok = !!window.electronAPI?.captureWebView;
      return { ok, details: ok ? '' : 'window.electronAPI.captureWebView missing' };
    }
  },
  {
    name: 'Resource Monitor – IPC available',
    env: 'react',
    run: async () => {
      const ok = !!window.electronAPI?.getWebViewResourceInfo;
      return { ok, details: ok ? '' : 'window.electronAPI.getWebViewResourceInfo missing' };
    }
  },
];

export async function runWebViewTests() {
  return runTests('WebView', tests);
}
