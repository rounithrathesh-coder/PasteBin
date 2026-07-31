import React, { useState } from 'react';
import { usePastes } from '../../context/PasteContext';

export const PreferencesView: React.FC = () => {
  const { showToast } = usePastes();

  // Settings State
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const [accent, setAccent] = useState('purple');
  const [fontSize, setFontSize] = useState(14);
  const [tabSize, setTabSize] = useState(2);
  const [autoSave, setAutoSave] = useState(true);
  const [wordWrap, setWordWrap] = useState(true);
  const [lineNumbers, setLineNumbers] = useState(true);
  const [minimap, setMinimap] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);

  const handleSave = () => {
    showToast('Preferences saved successfully!');
  };

  const handleReset = () => {
    setTheme('dark');
    setAccent('purple');
    setFontSize(14);
    setTabSize(2);
    setAutoSave(true);
    setWordWrap(true);
    setLineNumbers(true);
    setMinimap(true);
    setHighContrast(false);
    setReduceMotion(false);
    setEmailAlerts(true);
    showToast('Preferences reset to default values.');
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 space-y-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-1 border-b border-outline-variant/40 pb-5 flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-on-surface flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-3xl">settings</span>
                Application Preferences
              </h1>
              <p className="text-sm text-on-surface-variant">
                Customize appearance, editor settings, accessibility, and notifications.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg border border-outline-variant/60 text-xs font-mono text-outline hover:text-on-surface transition-colors"
              >
                Reset Defaults
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-1.5 rounded-lg bg-primary-container text-on-primary-container text-xs font-semibold hover:brightness-110 transition-all shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* 1. Appearance & Theme */}
          <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider border-b border-outline-variant/50 pb-2.5 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base">palette</span>
              Appearance &amp; Theme
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-2">
                <label className="text-outline">Theme Mode</label>
                <div className="flex items-center gap-2 bg-surface-container-lowest p-1 rounded-lg border border-outline-variant/50">
                  {(['dark', 'light', 'system'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`flex-1 py-1.5 rounded text-xs capitalize transition-all ${
                        theme === t ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm' : 'text-outline hover:text-on-surface'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-outline">Accent Color</label>
                <div className="flex items-center gap-3 pt-1">
                  {[
                    { name: 'purple', class: 'bg-purple-500' },
                    { name: 'emerald', class: 'bg-emerald-500' },
                    { name: 'blue', class: 'bg-blue-500' },
                    { name: 'amber', class: 'bg-amber-500' },
                    { name: 'rose', class: 'bg-rose-500' }
                  ].map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setAccent(color.name)}
                      className={`w-6 h-6 rounded-full ${color.class} transition-all ${
                        accent === color.name ? 'ring-2 ring-white scale-110 shadow-lg' : 'opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Monaco Code Editor Settings */}
          <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider border-b border-outline-variant/50 pb-2.5 flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-400 text-base">code</span>
              Editor Settings (Monaco / VS Code Engine)
            </h3>

            <div className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-outline">
                    <span>Font Size</span>
                    <span className="text-on-surface font-bold">{fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min={12}
                    max={20}
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-outline">Tab Size</label>
                  <div className="flex items-center gap-2 bg-surface-container-lowest p-1 rounded-lg border border-outline-variant/50">
                    {[2, 4].map((size) => (
                      <button
                        key={size}
                        onClick={() => setTabSize(size)}
                        className={`flex-1 py-1.5 rounded text-xs transition-all ${
                          tabSize === size ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm' : 'text-outline hover:text-on-surface'
                        }`}
                      >
                        {size} spaces
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Toggles Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  { label: 'Auto Save Changes', state: autoSave, set: setAutoSave },
                  { label: 'Word Wrap Code', state: wordWrap, set: setWordWrap },
                  { label: 'Line Numbers', state: lineNumbers, set: setLineNumbers },
                  { label: 'Editor Minimap', state: minimap, set: setMinimap }
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/40">
                    <span className="text-on-surface font-medium">{item.label}</span>
                    <button
                      onClick={() => item.set(!item.state)}
                      className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                        item.state ? 'bg-primary-container' : 'bg-surface-container-highest'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${item.state ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Keyboard Shortcuts Cheatsheet */}
          <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider border-b border-outline-variant/50 pb-2.5 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-400 text-base">keyboard</span>
              Keyboard Shortcuts
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              {[
                { action: 'Global Search', shortcut: '⌘ K' },
                { action: 'New Paste Modal', shortcut: '⌘ N' },
                { action: 'Save Active Snippet', shortcut: '⌘ S' },
                { action: 'Toggle Sidebar', shortcut: '⌘ /' }
              ].map((s) => (
                <div key={s.action} className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/40">
                  <span className="text-on-surface-variant">{s.action}</span>
                  <span className="bg-surface-container-high px-2 py-0.5 rounded border border-outline-variant/60 font-bold text-purple-300">
                    {s.shortcut}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
