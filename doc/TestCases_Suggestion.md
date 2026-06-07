<!-- =============================================================================
 FILE: TestCases_Suggestion.md
 PATH: doc/TestCases_Suggestion.md
 VERSION: 0.0.3
 PURPOSE: Sugestie testów dla niepokrytych plików – gotowe bloki do wklejenia.
 FUNCTIONS: -
 DEPENDS ON: build_structure.py
 UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
 ============================================================================= -->

# Sugestie testów dla niepokrytych plików

Poniższe testy można dodać do odpowiednich plików `TestRunner_*.js`.

### src/App.jsx

```js
  {
    name: 'App – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../src/App.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'App nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/aggregated/AggregatedProjectSection.jsx

```js
  {
    name: 'AggregatedProjectSection – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/aggregated/AggregatedProjectSection.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'AggregatedProjectSection nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/aggregated/AggregatedTaskItem.jsx

```js
  {
    name: 'AggregatedTaskItem – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/aggregated/AggregatedTaskItem.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'AggregatedTaskItem nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/modals/CategoryModal.jsx

```js
  {
    name: 'CategoryModal – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/modals/CategoryModal.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'CategoryModal nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/modals/CommentModal.jsx

```js
  {
    name: 'CommentModal – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/modals/CommentModal.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'CommentModal nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/modals/Modal.jsx

```js
  {
    name: 'Modal – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/modals/Modal.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'Modal nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/modals/PromptModal.jsx

```js
  {
    name: 'PromptModal – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/modals/PromptModal.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'PromptModal nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/onboarding/StepAccount.jsx

```js
  {
    name: 'StepAccount – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/onboarding/StepAccount.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'StepAccount nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/onboarding/StepApps.jsx

```js
  {
    name: 'StepApps – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/onboarding/StepApps.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'StepApps nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/onboarding/StepIndicator.jsx

```js
  {
    name: 'StepIndicator – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/onboarding/StepIndicator.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'StepIndicator nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/onboarding/StepLanguage.jsx

```js
  {
    name: 'StepLanguage – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/onboarding/StepLanguage.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'StepLanguage nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/onboarding/StepPrivacy.jsx

```js
  {
    name: 'StepPrivacy – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/onboarding/StepPrivacy.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'StepPrivacy nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/onboarding/StepTheme.jsx

```js
  {
    name: 'StepTheme – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/onboarding/StepTheme.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'StepTheme nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/settings/AccountSection.jsx

```js
  {
    name: 'AccountSection – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/settings/AccountSection.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'AccountSection nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/settings/DataManagementSection.jsx

```js
  {
    name: 'DataManagementSection – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/settings/DataManagementSection.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'DataManagementSection nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/settings/DebugModulesSection.jsx

```js
  {
    name: 'DebugModulesSection – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/settings/DebugModulesSection.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'DebugModulesSection nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/settings/GeneralSection.jsx

```js
  {
    name: 'GeneralSection – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/settings/GeneralSection.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'GeneralSection nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/settings/HotkeyModal.jsx

```js
  {
    name: 'HotkeyModal – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/settings/HotkeyModal.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'HotkeyModal nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/settings/HotkeysListSection.jsx

```js
  {
    name: 'HotkeysListSection – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/settings/HotkeysListSection.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'HotkeysListSection nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/settings/HotkeysManagerSection.jsx

```js
  {
    name: 'HotkeysManagerSection – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/settings/HotkeysManagerSection.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'HotkeysManagerSection nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/settings/LogsSection.jsx

```js
  {
    name: 'LogsSection – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/settings/LogsSection.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'LogsSection nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/settings/NotificationsSection.jsx

```js
  {
    name: 'NotificationsSection – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/settings/NotificationsSection.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'NotificationsSection nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/settings/TabsSection.jsx

```js
  {
    name: 'TabsSection – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/settings/TabsSection.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'TabsSection nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/settings/WebViewSection.jsx

```js
  {
    name: 'WebViewSection – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/settings/WebViewSection.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'WebViewSection nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/sidebar/Sidebar.jsx

```js
  {
    name: 'Sidebar – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/sidebar/Sidebar.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'Sidebar nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/sidebar/SidebarCategory.jsx

```js
  {
    name: 'SidebarCategory – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/sidebar/SidebarCategory.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'SidebarCategory nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/sidebar/SidebarHeader.jsx

```js
  {
    name: 'SidebarHeader – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/sidebar/SidebarHeader.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'SidebarHeader nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/sidebar/SidebarProfileItem.jsx

```js
  {
    name: 'SidebarProfileItem – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/sidebar/SidebarProfileItem.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'SidebarProfileItem nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/sidebar/SidebarSearch.jsx

```js
  {
    name: 'SidebarSearch – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/sidebar/SidebarSearch.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'SidebarSearch nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/sidebar/SidebarTools.jsx

```js
  {
    name: 'SidebarTools – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/sidebar/SidebarTools.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'SidebarTools nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/sidebar/SidebarWorkspaces.jsx

```js
  {
    name: 'SidebarWorkspaces – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/sidebar/SidebarWorkspaces.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'SidebarWorkspaces nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/taskpanel/TaskDetails.jsx

```js
  {
    name: 'TaskDetails – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/taskpanel/TaskDetails.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'TaskDetails nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/taskpanel/TaskEditor.jsx

```js
  {
    name: 'TaskEditor – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/taskpanel/TaskEditor.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'TaskEditor nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/taskpanel/TaskEmptyState.jsx

```js
  {
    name: 'TaskEmptyState – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/taskpanel/TaskEmptyState.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'TaskEmptyState nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/taskpanel/TaskList.jsx

```js
  {
    name: 'TaskList – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/taskpanel/TaskList.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'TaskList nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/tools/ClipboardHistory.jsx

```js
  {
    name: 'ClipboardHistory – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/tools/ClipboardHistory.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'ClipboardHistory nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/tools/CookieGrabber.jsx

```js
  {
    name: 'CookieGrabber – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/tools/CookieGrabber.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'CookieGrabber nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/tools/FilePreviewer.jsx

```js
  {
    name: 'FilePreviewer – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/tools/FilePreviewer.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'FilePreviewer nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/tools/ImageTools.jsx

```js
  {
    name: 'ImageTools – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/tools/ImageTools.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'ImageTools nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/tools/JsonFormatter.jsx

```js
  {
    name: 'JsonFormatter – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/tools/JsonFormatter.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'JsonFormatter nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/tools/MarkdownPreviewer.jsx

```js
  {
    name: 'MarkdownPreviewer – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/tools/MarkdownPreviewer.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'MarkdownPreviewer nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/tools/MiniPostman.jsx

```js
  {
    name: 'MiniPostman – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/tools/MiniPostman.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'MiniPostman nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/tools/RegexTester.jsx

```js
  {
    name: 'RegexTester – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/tools/RegexTester.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'RegexTester nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/tools/RemoveBgTool.jsx

```js
  {
    name: 'RemoveBgTool – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/tools/RemoveBgTool.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'RemoveBgTool nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/tools/StringCombiner.jsx

```js
  {
    name: 'StringCombiner – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/tools/StringCombiner.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'StringCombiner nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/tools/SvgToPngConverter.jsx

```js
  {
    name: 'SvgToPngConverter – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/tools/SvgToPngConverter.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'SvgToPngConverter nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/tools/ToolsPanel.jsx

```js
  {
    name: 'ToolsPanel – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/tools/ToolsPanel.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'ToolsPanel nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/views/ContentRenderer.jsx

```js
  {
    name: 'ContentRenderer – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/views/ContentRenderer.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'ContentRenderer nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/views/SettingsContainer.jsx

```js
  {
    name: 'SettingsContainer – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/views/SettingsContainer.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'SettingsContainer nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/views/Spinner.jsx

```js
  {
    name: 'Spinner – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/views/Spinner.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'Spinner nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```
### src/ui/views/ToolsContainer.jsx

```js
  {
    name: 'ToolsContainer – eksportowany jako komponent React',
    run: async () => {
      try {
        const module = await import('../../../src/ui/views/ToolsContainer.jsx');
        const ok = typeof module.default === 'function';
        return { ok, details: ok ? '' : 'ToolsContainer nie jest eksportowany jako default' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
```