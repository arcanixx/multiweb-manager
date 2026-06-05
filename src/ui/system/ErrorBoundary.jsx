// =============================================================================
// FILE: ErrorBoundary.jsx
// PATH: src/ui/system/ErrorBoundary.jsx
// VERSION: 0.0.3
// PURPOSE: Przechwytuje błędy React w drzewie komponentów, zapobiegając awarii całej aplikacji.
// FUNCTIONS: -
// DEPENDS ON: react
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React from 'react';

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('[AppErrorBoundary] Uncaught error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: 32, color: 'var(--text-primary, #fff)',
          background: 'var(--bg-primary, #1e1e1e)', minHeight: '100vh',
        }}>
          <h2>⚠️ Wystąpił krytyczny błąd aplikacji</h2>
          <pre style={{ fontSize: 12, opacity: 0.7, marginTop: 12 }}>
            {this.state.error?.message}
          </pre>
          <button onClick={() => this.setState({ hasError: false, error: null })} style={{ marginTop: 16 }}>Spróbuj ponownie</button>
        </div>
      );
    }
    return this.props.children;
  }
}