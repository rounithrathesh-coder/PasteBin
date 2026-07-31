import React, { useState } from 'react';
import { usePastes } from '../context/PasteContext';
import { VisibilityType } from '../types/paste';

export const QuickCreateCard: React.FC = () => {
  const { createPaste, setIsEditorModalOpen, setActiveSnippet } = usePastes();
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('Python');
  const [visibility, setVisibility] = useState<VisibilityType>('Public');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPaste(title, language, visibility);
    setTitle('');
  };

  const handleOpenMonaco = () => {
    setActiveSnippet(null);
    setIsEditorModalOpen(true);
  };

  return (
    <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-5 shadow-lg shadow-black/10 hover:border-outline-variant transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg">code_blocks</span>
          <h2 className="text-sm font-semibold text-on-surface">Quick Create Paste</h2>
        </div>
        <button
          type="button"
          onClick={handleOpenMonaco}
          className="text-[11px] font-mono text-primary hover:underline flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">open_in_full</span> Open Monaco Editor
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Paste title (e.g. Auth Middleware snippet)..."
          className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container font-mono transition-all placeholder:text-outline/60"
        />

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">
              code
            </span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg py-2.5 pl-9 pr-8 text-xs text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container appearance-none transition-all cursor-pointer"
            >
              <option value="Python">Python</option>
              <option value="JavaScript">JavaScript</option>
              <option value="TypeScript">TypeScript</option>
              <option value="Go">Go</option>
              <option value="Rust">Rust</option>
              <option value="HTML">HTML / CSS</option>
              <option value="SQL">SQL</option>
              <option value="Bash">Bash / Shell</option>
              <option value="C++">C++</option>
              <option value="JSON">JSON / YAML</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">
              unfold_more
            </span>
          </div>

          <div className="sm:col-span-4 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">
              visibility
            </span>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as VisibilityType)}
              className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg py-2.5 pl-9 pr-8 text-xs text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container appearance-none transition-all cursor-pointer"
            >
              <option value="Public">Public (Indexed & Searchable)</option>
              <option value="Private">Private (Only Me)</option>
              <option value="Unlisted">Unlisted (Secret Link)</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">
              unfold_more
            </span>
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              className="w-full h-full bg-primary-container hover:bg-primary-container/90 text-on-primary-container py-2.5 px-4 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-primary-container/20 group"
            >
              <span className="material-symbols-outlined text-base group-hover:scale-110 transition-transform">
                send
              </span>
              Create Paste
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
