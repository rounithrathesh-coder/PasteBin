import React from 'react';
import Editor from '@monaco-editor/react';
import { usePastes } from '../context/PasteContext';

export const MonacoEditorModal: React.FC = () => {
  const { activeSnippet, isEditorModalOpen, setIsEditorModalOpen, showToast, toggleFavorite } = usePastes();

  if (!isEditorModalOpen || !activeSnippet) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSnippet.code);
    showToast('Code copied to clipboard!');
  };

  const handleDownload = () => {
    const blob = new Blob([activeSnippet.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeSnippet.title.replace(/\s+/g, '_')}.${activeSnippet.language.toLowerCase()}`;
    a.click();
    showToast('Download started!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Editor Modal Top Header */}
        <div className="bg-surface-container-low border-b border-outline-variant/60 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 font-mono text-sm">
              <span className="material-symbols-outlined text-xl">code</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-on-surface">{activeSnippet.title}</h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-surface-container-high border border-outline-variant/40 text-on-surface-variant font-medium">
                  {activeSnippet.language}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">
                  {activeSnippet.visibility}
                </span>
              </div>
              <p className="text-xs text-outline font-mono mt-0.5">
                {activeSnippet.lines} lines • {activeSnippet.fileSize || '1.2 KB'} • Author: {activeSnippet.author}
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2">
            {/* Star Favorite Button */}
            <button
              onClick={() => {
                toggleFavorite(activeSnippet.id);
                showToast(activeSnippet.isFavorite ? 'Removed from favorites' : 'Starred in favorites');
              }}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${
                activeSnippet.isFavorite
                  ? 'bg-amber-400/20 text-amber-400 border-amber-400/40 shadow-sm'
                  : 'bg-surface-container-high border-outline-variant/60 text-outline hover:text-amber-400 hover:border-amber-400/40'
              }`}
              title={activeSnippet.isFavorite ? 'Unstar snippet' : 'Star snippet'}
            >
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: activeSnippet.isFavorite ? "'FILL' 1" : "'FILL' 0" }}>
                star
              </span>
              {activeSnippet.isFavorite ? 'Starred' : 'Favorite'}
            </button>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/60 text-xs font-mono text-on-surface font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-base">content_copy</span> Copy Code
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/60 text-xs font-mono text-on-surface font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-base">download</span> Download
            </button>

            <button
              onClick={() => setIsEditorModalOpen(false)}
              className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-variant/60 transition-colors ml-2"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Monaco Editor Container */}
        <div className="flex-1 relative bg-[#1e1e1e]">
          <Editor
            height="100%"
            defaultLanguage={activeSnippet.language.toLowerCase()}
            value={activeSnippet.code}
            theme="vs-dark"
            options={{
              readOnly: true,
              fontSize: 13,
              fontFamily: "'JetBrains Mono', monospace",
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              lineNumbers: 'on',
              folding: true,
              renderLineHighlight: 'all',
              cursorBlinking: 'smooth'
            }}
          />
        </div>
      </div>
    </div>
  );
};
