import React, { useEffect, useState } from 'react';
import { Snippet } from '../types/paste';

/* ─── Language colour map ─── */
const LANG_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  JavaScript: { bg: 'bg-yellow-500/15', text: 'text-yellow-300', dot: 'bg-yellow-400' },
  TypeScript: { bg: 'bg-blue-500/15', text: 'text-blue-300', dot: 'bg-blue-400' },
  Python: { bg: 'bg-emerald-500/15', text: 'text-emerald-300', dot: 'bg-emerald-400' },
  HTML: { bg: 'bg-orange-500/15', text: 'text-orange-300', dot: 'bg-orange-400' },
  CSS: { bg: 'bg-pink-500/15', text: 'text-pink-300', dot: 'bg-pink-400' },
  SQL: { bg: 'bg-cyan-500/15', text: 'text-cyan-300', dot: 'bg-cyan-400' },
  Go: { bg: 'bg-sky-500/15', text: 'text-sky-300', dot: 'bg-sky-400' },
  Rust: { bg: 'bg-red-500/15', text: 'text-red-300', dot: 'bg-red-400' },
  'C++': { bg: 'bg-indigo-500/15', text: 'text-indigo-300', dot: 'bg-indigo-400' },
  Bash: { bg: 'bg-lime-500/15', text: 'text-lime-300', dot: 'bg-lime-400' },
  YAML: { bg: 'bg-violet-500/15', text: 'text-violet-300', dot: 'bg-violet-400' },
};
const DEFAULT_LANG_COLOR = { bg: 'bg-purple-500/15', text: 'text-purple-300', dot: 'bg-purple-400' };

/* ─── Simple syntax highlighter (line numbering) ─── */
function CodeBlock({ code }: { code: string }) {
  const lines = code.split('\n');
  return (
    <div className="relative overflow-hidden rounded-b-xl">
      <pre className="overflow-auto custom-scrollbar text-sm leading-6 font-mono p-0 bg-transparent">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className="group hover:bg-white/[0.03] transition-colors">
                <td
                  className="select-none text-right pr-4 pl-5 py-0 text-on-surface/20 text-xs w-12 border-r border-outline-variant/20 group-hover:text-on-surface/40 transition-colors"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {i + 1}
                </td>
                <td className="pl-5 pr-5 py-0 text-on-surface/90 whitespace-pre">
                  {line || ' '}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </pre>
    </div>
  );
}

/* ─── Main Share Page ─── */
export function SharePage({ snippetId }: { snippetId: string }) {
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      // 1. Check for self-contained encoded data in URL parameter
      const params = new URLSearchParams(window.location.search);
      const dataParam = params.get('data');
      if (dataParam) {
        try {
          const decodedJson = decodeURIComponent(atob(dataParam));
          const decodedSnippet: Snippet = JSON.parse(decodedJson);
          if (decodedSnippet && decodedSnippet.code) {
            setSnippet(decodedSnippet);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn('[SharePage] Failed to decode URL data parameter:', e);
        }
      }

      // 2. Try API single paste
      try {
        const res = await fetch(`/api/pastes/${snippetId}`);
        if (res.ok) {
          const data = await res.json();
          setSnippet(data);
          setLoading(false);
          return;
        }
      } catch { /* fallback */ }

      // 3. Try full list from API
      try {
        const res = await fetch('/api/pastes');
        if (res.ok) {
          const all: Snippet[] = await res.json();
          const found = all.find((p) => p.id === snippetId);
          if (found) { setSnippet(found); setLoading(false); return; }
        }
      } catch { /* fallback */ }

      // 4. Try local storage (for same browser)
      try {
        const stored = localStorage.getItem('pastebin_pastes');
        if (stored) {
          const pastes: Snippet[] = JSON.parse(stored);
          const found = pastes.find((p) => p.id === snippetId);
          if (found) { setSnippet(found); setLoading(false); return; }
        }
      } catch { /* fallback */ }

      setNotFound(true);
      setLoading(false);
    };
    load();
  }, [snippetId]);


  const handleCopyCode = async () => {
    if (!snippet) return;
    try { await navigator.clipboard.writeText(snippet.code); } catch { /* noop */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyUrl = async () => {
    try { await navigator.clipboard.writeText(window.location.href); } catch { /* noop */ }
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const langColor = snippet ? (LANG_COLORS[snippet.language] || DEFAULT_LANG_COLOR) : DEFAULT_LANG_COLOR;
  const lineCount = snippet ? snippet.code.split('\n').length : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-on-surface-variant font-mono">Loading snippet…</p>
        </div>
      </div>
    );
  }

  if (notFound || !snippet) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-6 p-8">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-red-400 text-3xl">link_off</span>
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-on-surface">Snippet Not Found</h1>
          <p className="text-sm text-on-surface-variant font-mono">
            This snippet may have been deleted, made private, or the link is invalid.
          </p>
        </div>
        <a href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-container text-on-primary-container rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
          <span className="material-symbols-outlined text-base">home</span>
          Go to PasteBin
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 border-b border-outline-variant/40 bg-surface-container-lowest/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-7 h-7 rounded-lg bg-primary-container flex items-center justify-center shadow-md shadow-primary/30 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-on-primary-container text-sm">data_object</span>
            </div>
            <span className="font-bold text-on-surface text-sm tracking-tight">PasteBin</span>
          </a>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyUrl}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high border border-outline-variant/60 text-xs font-mono text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-sm">{copiedUrl ? 'check_circle' : 'link'}</span>
              {copiedUrl ? 'Copied!' : 'Copy Link'}
            </button>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container text-xs font-mono font-semibold hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-sm">{copied ? 'check' : 'content_copy'}</span>
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
            <a href="/" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant/60 text-xs font-mono text-on-surface-variant hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined text-sm">add_box</span>
              New Paste
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-5 py-8 space-y-6">
        {/* Header Card */}
        <div className="bg-surface-container-low border border-outline-variant/50 rounded-2xl p-6 space-y-4 shadow-lg shadow-black/20">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1.5 min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-on-surface leading-tight">{snippet.title}</h1>
              {snippet.description && <p className="text-sm text-on-surface-variant">{snippet.description}</p>}
            </div>
            <div className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold border ${
              snippet.visibility === 'Public' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : snippet.visibility === 'Private' ? 'bg-red-500/10 text-red-400 border-red-500/20'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              <span className="material-symbols-outlined text-xs">
                {snippet.visibility === 'Public' ? 'public' : snippet.visibility === 'Private' ? 'lock' : 'link'}
              </span>
              {snippet.visibility}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-outline-variant/30">
            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-mono">
              <span className="material-symbols-outlined text-sm">person</span>
              <span>{snippet.author}</span>
            </div>
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-mono font-semibold ${langColor.bg} ${langColor.text} border border-current/20`}>
              <span className={`w-1.5 h-1.5 rounded-full ${langColor.dot}`} />
              {snippet.language}
            </div>
            <div className="flex items-center gap-1 text-xs text-on-surface-variant font-mono">
              <span className="material-symbols-outlined text-sm">format_list_numbered</span>
              {lineCount} lines
            </div>
            {snippet.fileSize && (
              <div className="flex items-center gap-1 text-xs text-on-surface-variant font-mono">
                <span className="material-symbols-outlined text-sm">description</span>
                {snippet.fileSize}
              </div>
            )}
            <div className="flex items-center gap-1 text-xs text-on-surface-variant font-mono">
              <span className="material-symbols-outlined text-sm">visibility</span>
              {(snippet.views || 0).toLocaleString()} views
            </div>
            {snippet.folder && (
              <div className="flex items-center gap-1 text-xs text-on-surface-variant font-mono">
                <span className="material-symbols-outlined text-sm">folder</span>
                {snippet.folder}
              </div>
            )}
            <div className="flex items-center gap-1 text-xs text-on-surface-variant font-mono ml-auto">
              <span className="material-symbols-outlined text-sm">schedule</span>
              {snippet.createdAt}
            </div>
          </div>

          {snippet.tags && snippet.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {snippet.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded-full bg-surface-container text-xs font-mono text-on-surface-variant border border-outline-variant/40">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Code Block */}
        <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl overflow-hidden shadow-lg shadow-black/20">
          <div className="flex items-center justify-between px-5 py-3 border-b border-outline-variant/40 bg-surface-container-low/50">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="h-4 w-px bg-outline-variant/40" />
              <span className="text-xs font-mono text-on-surface-variant">
                {snippet.title.includes('.') ? snippet.title : `snippet.${snippet.language.toLowerCase()}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${langColor.bg} ${langColor.text} border-current/20 font-semibold`}>
                {snippet.language}
              </span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-surface-container-high/80 border border-outline-variant/50 text-[10px] font-mono text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-xs">{copied ? 'check' : 'content_copy'}</span>
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
          <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
            <CodeBlock code={snippet.code} />
          </div>
        </div>

        {/* CTA Footer */}
        <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left space-y-1">
            <p className="font-bold text-on-surface text-sm">Want to create your own snippet?</p>
            <p className="text-xs text-on-surface-variant font-mono">PasteBin — the developer workspace for sharing code.</p>
          </div>
          <a href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-container text-on-primary-container rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity shadow-md shadow-primary/20 shrink-0">
            <span className="material-symbols-outlined text-base">add_box</span>
            Create Snippet
          </a>
        </div>
      </main>

      <footer className="border-t border-outline-variant/30 mt-12 py-6">
        <div className="max-w-5xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-on-surface-variant font-mono">
          <span>© 2026 PasteBin · Developer Workspace</span>
          <div className="flex items-center gap-4">
            <a href="/" className="hover:text-on-surface transition-colors">Dashboard</a>
            <a href="/" className="hover:text-on-surface transition-colors">Public Pastes</a>
            <a href="/" className="hover:text-on-surface transition-colors">API Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
