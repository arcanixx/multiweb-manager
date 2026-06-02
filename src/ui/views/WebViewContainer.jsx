// =============================================================================
// FILE: WebViewContainer.jsx
// PATH: src/ui/views/WebViewContainer.jsx
// VERSION: 0.0.3
// PURPOSE: Kontener renderowania WebView dla aktywnego profilu
// FUNCTIONS: WebViewContainer
// DEPENDS ON: react, Spinner.jsx
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { lazy, Suspense } from 'react';
import { Spinner } from './Spinner.jsx';

const WebViewTab = lazy(() => import('../webview/WebViewTab'));

// ─── WebViewContainer() – renderuje WebView dla aktywnego profilu
//   @param {Object} props.activeItem – aktywny element (profil WebView)
//   @param {boolean} props.sidebarModalOpen – czy sidebar modal jest otwarty (zawiesza webview)
//   @returns {JSX.Element}
export default function WebViewContainer({ activeItem, sidebarModalOpen }) {
  const profile = activeItem.type === 'webview' ? activeItem : { ...activeItem, type: 'webview' };
  return (
    <Suspense fallback={<Spinner />}>
      <WebViewTab profile={profile} isActive={true} suspended={sidebarModalOpen} />
    </Suspense>
  );
}