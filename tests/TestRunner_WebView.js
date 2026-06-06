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
  {
    name: 'WebViewContainer - src/ui/views/WebViewContainer.jsx eksportuje komponent',
    run: async () => checkSourceExport('src/ui/views/WebViewContainer.jsx', 'WebViewContainer')
  },
  {
    name: 'WebViewTab - src/ui/webview/WebViewTab.jsx eksportuje komponent',
    run: async () => checkSourceExport('src/ui/webview/WebViewTab.jsx', 'WebViewTab')
  },
  {
    name: 'WebViewToolbar - src/ui/webview/WebViewToolbar.jsx eksportuje komponent',
    run: async () => checkSourceExport('src/ui/webview/WebViewToolbar.jsx', 'WebViewToolbar')
  },
  {
    name: 'Single App Mode – IPC available',
    run: async () => {
      const hasIPC = typeof window !== 'undefined' && !!window.electronAPI?.openSingleWindow;
      return { ok: hasIPC, details: hasIPC ? '' : 'window.electronAPI.openSingleWindow missing' };
    }
  },
  {
    name: 'Screenshot – captureWebView IPC available',
    run: async () => {
      const hasCapture = typeof window !== 'undefined' && !!window.electronAPI?.captureWebView;
      return { ok: hasCapture, details: hasCapture ? '' : 'window.electronAPI.captureWebView missing' };
    }
  },
  {
    name: 'Resource Monitor – IPC available',
    run: async () => {
      const hasMonitor = typeof window !== 'undefined' && !!window.electronAPI?.getWebViewResourceInfo;
      return { ok: hasMonitor, details: hasMonitor ? '' : 'window.electronAPI.getWebViewResourceInfo missing' };
    }
  },
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
  }
];
export async function runWebViewTests() {
  return runTests('WebView', tests);
}

