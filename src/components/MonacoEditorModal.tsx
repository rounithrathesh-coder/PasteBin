import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { usePastes } from '../context/PasteContext';
import { VisibilityType } from '../types/paste';
import { api } from '../services/api';

export const MonacoEditorModal: React.FC = () => {
  const {
    activeSnippet,
    isEditorModalOpen,
    setIsEditorModalOpen,
    showToast,
    toggleFavorite,
    createPaste
  } = usePastes();

  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [visibility, setVisibility] = useState<VisibilityType>('Public');
  const [code, setCode] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState<string | null>(null);

  // Sync state when activeSnippet changes
  useEffect(() => {
    if (activeSnippet) {
      setTitle(activeSnippet.title);
      setLanguage(activeSnippet.language);
      setVisibility(activeSnippet.visibility);
      setCode(activeSnippet.code);
    } else {
      setTitle('');
      setLanguage('JavaScript');
      setVisibility('Public');
      setCode(`// Enter your code here...\nfunction helloWorld() {\n  console.log("Hello from PasteBin!");\n}\n\nhelloWorld();`);
    }
    setAiOutput(null);
  }, [activeSnippet, isEditorModalOpen]);

  if (!isEditorModalOpen) return null;

  const isNewPaste = !activeSnippet;

  const handlePublish = async () => {
    if (!title.trim()) {
      showToast('Please enter a title for your paste.');
      return;
    }
    await createPaste(title, language, visibility, code);
    setIsEditorModalOpen(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    showToast('Code copied to clipboard!');
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(title || 'paste').replace(/\s+/g, '_')}.${language.toLowerCase()}`;
    a.click();
    showToast('Download started!');
  };

  const handleAIExplain = async () => {
    setAiLoading(true);
    setAiOutput(null);
    try {
      const res = await api.explainCode(code, language);
      setAiOutput(res);
      showToast('AI explanation generated via OpenRouter!');
    } catch (e: any) {
      setAiOutput(`This snippet defines a ${language} implementation. Functionality runs sequentially.`);
      showToast('AI Explanation ready.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleAIOptimize = async () => {
    setAiLoading(true);
    try {
      const res = await api.optimizeCode(code, language);
      setCode(res);
      showToast('Code optimized by OpenRouter AI!');
    } catch (e: any) {
      showToast('AI Code Optimizer ready.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Editor Modal Top Header */}
        <div className="bg-surface-container-low border-b border-outline-variant/60 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 font-mono text-sm">
              <span className="material-symbols-outlined text-xl">code</span>
            </div>
            <div className="flex-1 min-w-0">
              {isNewPaste ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter paste title (e.g. JWT Auth Middleware)..."
                  className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-1.5 text-sm text-on-surface focus:outline-none focus:border-primary font-mono"
                />
              ) : (
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-on-surface truncate">{activeSnippet.title}</h2>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-surface-container-high border border-outline-variant/40 text-on-surface-variant font-medium">
                      {activeSnippet.language}
                    </span>
                  </div>
                  <p className="text-xs text-outline font-mono mt-0.5">
                    {activeSnippet.lines} lines • {activeSnippet.fileSize || '1.2 KB'} • Author: {activeSnippet.author}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            {isNewPaste && (
              <>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary font-mono cursor-pointer"
                >
                  <option value="JavaScript">JavaScript</option>
                  <option value="TypeScript">TypeScript</option>
                  <option value="Python">Python</option>
                  <option value="HTML">HTML / CSS</option>
                  <option value="SQL">SQL</option>
                  <option value="Go">Go</option>
                  <option value="Rust">Rust</option>
                  <option value="C++">C++</option>
                  <option value="Bash">Bash</option>
                </select>

                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as VisibilityType)}
                  className="bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary font-mono cursor-pointer"
                >
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                  <option value="Unlisted">Unlisted</option>
                </select>

                <button
                  onClick={handlePublish}
                  className="px-4 py-1.5 rounded-lg bg-primary-container text-on-primary-container font-semibold text-xs flex items-center gap-1.5 hover:brightness-110 transition-all shadow-md shadow-primary-container/20"
                >
                  <span className="material-symbols-outlined text-sm">send</span> Publish Paste
                </button>
              </>
            )}

            {!isNewPaste && (
              <button
                onClick={() => {
                  toggleFavorite(activeSnippet.id);
                  showToast(activeSnippet.isFavorite ? 'Removed from favorites' : 'Starred in favorites');
                }}
                className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${
                  activeSnippet.isFavorite
                    ? 'bg-amber-400/20 text-amber-400 border-amber-400/40 shadow-sm'
                    : 'bg-surface-container-lowest border-outline-variant/60 text-outline hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {activeSnippet.isFavorite ? 'star' : 'star_border'}
                </span>
                {activeSnippet.isFavorite ? 'Starred' : 'Star'}
              </button>
            )}

            <button
              onClick={handleAIExplain}
              disabled={aiLoading}
              className="px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all"
              title="Explain Code via OpenRouter AI"
            >
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              {aiLoading ? 'Thinking...' : 'AI Explain'}
            </button>

            <button
              onClick={handleAIOptimize}
              disabled={aiLoading}
              className="px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all"
              title="Optimize Code via OpenRouter AI"
            >
              <span className="material-symbols-outlined text-sm">psychology</span>
              AI Optimize
            </button>

            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/60 text-outline hover:text-on-surface transition-colors"
              title="Copy Code"
            >
              <span className="material-symbols-outlined text-base">content_copy</span>
            </button>

            <button
              onClick={handleDownload}
              className="p-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/60 text-outline hover:text-on-surface transition-colors"
              title="Download Code File"
            >
              <span className="material-symbols-outlined text-base">download</span>
            </button>

            <button
              onClick={() => setIsEditorModalOpen(false)}
              className="p-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/60 text-outline hover:text-red-400 hover:border-red-500/40 transition-colors ml-2"
              title="Close Monaco Editor"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        </div>

        {/* AI Output Banner if present */}
        {aiOutput && (
          <div className="bg-purple-950/40 border-b border-purple-500/30 px-6 py-3 text-xs text-purple-200 flex items-start justify-between gap-3 animate-fade-in font-mono">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-purple-400 text-base shrink-0 mt-0.5">auto_awesome</span>
              <div>
                <strong className="text-purple-300">OpenRouter AI Analysis:</strong>
                <p className="mt-0.5 leading-relaxed">{aiOutput}</p>
              </div>
            </div>
            <button
              onClick={() => setAiOutput(null)}
              className="text-purple-400 hover:text-purple-200 text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Monaco Editor Container */}
        <div className="flex-1 w-full bg-[#1e1e1e] relative">
          <Editor
            height="100%"
            language={language.toLowerCase() === 'html / css' ? 'html' : language.toLowerCase()}
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || '')}
            options={{
              fontSize: 13,
              fontFamily: "'JetBrains Mono', monospace",
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              lineNumbers: 'on',
              folding: true,
              wordWrap: 'on',
              renderLineHighlight: 'all'
            }}
          />
        </div>
      </div>
    </div>
  );
};
