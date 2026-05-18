// =============================================================================
// FILE: WebViewTab.jsx
// PATH: src/ui/webview/WebViewTab.jsx
// VERSION: 0.0.3
// PURPOSE: Pojedyncza karta WebView – ładowanie URL, przełączanie,
//          obsługa sleepTabs, screenshot, userAgent, i18n-ready.
// DEPENDS ON: config.js (DEFAULT_SETTINGS, FEATURES), logger.js
// =============================================================================

import React, { useEffect, useRef } from "react";
import { DEFAULT_SETTINGS, FEATURES } from "../../config";
import { logError, logInfo } from "../../utils/logger";

export default function WebViewTab({
  tab,
  isActive,
  onScreenshot,
  onCrashed
}) {
  const ref = useRef(null);
  const sleepTimeout = DEFAULT_SETTINGS.sleepTabsTimeout;

  useEffect(() => {
    const webview = ref.current;
    if (!webview) return;

    webview.src = tab.url;
    if (tab.userAgent) {
      webview.setUserAgentOverride(tab.userAgent);
    }

    const handleDomReady = () => {
      logInfo(`WebViewTab: dom-ready for ${tab.id}`);
    };

    const handleCrashed = () => {
      logError(`WebViewTab: crashed ${tab.id}`);
      onCrashed && onCrashed(tab.id);
    };

    const handleIpcMessage = event => {
      if (event.channel === "screenshot-request" && FEATURES.screenshotWebView) {
        onScreenshot && onScreenshot(tab.id);
      }
    };

    webview.addEventListener("dom-ready", handleDomReady);
    webview.addEventListener("crashed", handleCrashed);
    webview.addEventListener("ipc-message", handleIpcMessage);

    let sleepTimer = null;
    if (FEATURES.sleepTabs && !isActive) {
      sleepTimer = setTimeout(() => {
        try {
          webview.stop();
          webview.src = "about:blank";
          logInfo(`WebViewTab: slept ${tab.id}`);
        } catch (e) {
          logError("WebViewTab: sleep error", e);
        }
      }, sleepTimeout);
    }

    return () => {
      webview.removeEventListener("dom-ready", handleDomReady);
      webview.removeEventListener("crashed", handleCrashed);
      webview.removeEventListener("ipc-message", handleIpcMessage);
      if (sleepTimer) clearTimeout(sleepTimer);
    };
  }, [tab.id, tab.url, tab.userAgent, isActive, sleepTimeout, onScreenshot, onCrashed]);

  return (
    <div className={`webview-tab ${isActive ? "active" : ""}`}>
      <webview
        ref={ref}
        src={tab.url}
        partition={tab.partition}
        allowpopups="true"
      />
    </div>
  );
}

// =============================================================================
// END OF FILE
// =============================================================================