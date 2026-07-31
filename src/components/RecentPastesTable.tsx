import React from 'react';
import { usePastes } from '../context/PasteContext';
import { Snippet } from '../types/paste';

export const RecentPastesTable: React.FC = () => {
  const { pastes, searchQuery, selectedLanguage, setActiveSnippet, setIsEditorModalOpen, showToast, toggleFavorite } = usePastes();

  const filteredPastes = pastes.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLang = selectedLanguage === 'All' || p.language.toLowerCase() === selectedLanguage.toLowerCase();

    return matchesSearch && matchesLang;
  });

  const getLangBadgeStyle = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'python':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'html':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'javascript':
      case 'js':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'sql':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'c++':
      case 'cpp':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
  };

  const getVisibilityPill = (vis: string) => {
    switch (vis) {
      case 'Public':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="material-symbols-outlined text-xs">public</span> Public
          </span>
        );
      case 'Unlisted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <span className="material-symbols-outlined text-xs">link</span> Unlisted
          </span>
        );
      case 'Private':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="material-symbols-outlined text-xs">lock</span> Private
          </span>
        );
      default:
        return null;
    }
  };

  const handleCopyCode = (e: React.MouseEvent, snippet: Snippet) => {
    e.stopPropagation();
    navigator.clipboard.writeText(snippet.code);
    showToast(`Copied "${snippet.title}" code to clipboard!`);
  };

  const handleOpenRow = (snippet: Snippet) => {
    setActiveSnippet(snippet);
    setIsEditorModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-xl">history</span>
          <h2 className="text-lg font-bold text-on-surface">Recent Pastes</h2>
        </div>
        <span className="text-xs text-outline font-mono">
          Showing {filteredPastes.length} of {pastes.length} pastes
        </span>
      </div>

      <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high/40 border-b border-outline-variant/60 text-[10px] text-outline uppercase tracking-widest font-mono font-semibold">
                <th className="px-5 py-3.5">Title &amp; Meta</th>
                <th className="px-5 py-3.5">Language</th>
                <th className="px-5 py-3.5">Visibility</th>
                <th className="px-5 py-3.5">Views</th>
                <th className="px-5 py-3.5">Last Updated</th>
                <th className="px-5 py-3.5 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 text-sm">
              {filteredPastes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-outline text-xs font-mono">
                    No pastes match your search filters. Try clearing search query.
                  </td>
                </tr>
              ) : (
                filteredPastes.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => handleOpenRow(p)}
                    className="hover:bg-surface-container-high/40 transition-all group cursor-pointer"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0 font-mono text-xs">
                          <span className="material-symbols-outlined text-base">code</span>
                        </div>
                        <div>
                          <div className="font-semibold text-on-surface group-hover:text-primary transition-colors flex items-center gap-2">
                            {p.title}
                          </div>
                          <div className="text-[11px] font-mono text-outline flex items-center gap-2 mt-0.5">
                            <span>{p.lines} lines</span>
                            <span>•</span>
                            <span>{p.author}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium border ${getLangBadgeStyle(
                          p.language
                        )}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span> {p.language}
                      </span>
                    </td>

                    <td className="px-5 py-3.5">{getVisibilityPill(p.visibility)}</td>

                    <td className="px-5 py-3.5 text-on-surface-variant font-mono text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm text-outline">visibility</span> {p.views}
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-on-surface-variant text-xs">{p.createdAt}</td>

                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleCopyCode(e, p)}
                          className="p-1.5 hover:bg-surface-variant/80 rounded-md text-outline hover:text-on-surface transition-colors"
                          title="Copy Content"
                        >
                          <span className="material-symbols-outlined text-base">content_copy</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            showToast(`Share URL for "${p.title}" copied!`);
                          }}
                          className="p-1.5 hover:bg-surface-variant/80 rounded-md text-outline hover:text-on-surface transition-colors"
                          title="Share Link"
                        >
                          <span className="material-symbols-outlined text-base">share</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const blob = new Blob([p.code], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${p.title.replace(/\s+/g, '_')}.${p.language.toLowerCase()}`;
                            a.click();
                            showToast(`Downloaded ${p.title}`);
                          }}
                          className="p-1.5 hover:bg-surface-variant/80 rounded-md text-outline hover:text-on-surface transition-colors"
                          title="Download Code"
                        >
                          <span className="material-symbols-outlined text-base">download</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(p.id);
                            showToast(p.isFavorite ? 'Removed from favorites' : 'Added to favorites');
                          }}
                          className={`p-1.5 hover:bg-surface-variant/80 rounded-md transition-colors ${
                            p.isFavorite ? 'text-amber-400' : 'text-outline hover:text-amber-400'
                          }`}
                          title="Favorite Snippet"
                        >
                          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: p.isFavorite ? "'FILL' 1" : "'FILL' 0" }}>
                            star
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
