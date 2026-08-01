import React from 'react';
import { usePastes } from '../context/PasteContext';
import { Snippet } from '../types/paste';

export const RecentPastesTable: React.FC = () => {
  const { pastes, searchQuery, selectedLanguage, setActiveSnippet, setIsEditorModalOpen, showToast, toggleFavorite, sharePaste } = usePastes();

  const filteredPastes = pastes.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLang = selectedLanguage === 'All' || p.language.toLowerCase() === selectedLanguage.toLowerCase();
    return matchesSearch && matchesLang;
  });

  const handleCopyCode = (e: React.MouseEvent, snippet: Snippet) => {
    e.stopPropagation();
    navigator.clipboard.writeText(snippet.code);
    showToast(`Copied "${snippet.title}" code to clipboard!`);
  };

  const handleOpenRow = (snippet: Snippet) => {
    setActiveSnippet(snippet);
    setIsEditorModalOpen(true);
  };

  const getVisibilityPill = (vis: string) => {
    switch (vis) {
      case 'Public':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
            <span className="material-symbols-outlined text-xs">public</span> Public
          </span>
        );
      case 'Private':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20 whitespace-nowrap">
            <span className="material-symbols-outlined text-xs">lock</span> Private
          </span>
        );
      case 'Unlisted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 whitespace-nowrap">
            <span className="material-symbols-outlined text-xs">link</span> Unlisted
          </span>
        );
      default:
        return null;
    }
  };

  const getLangBadgeStyle = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'python':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'html':
        return 'bg-orange-500/15 text-orange-300 border-orange-500/30';
      case 'sql':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'c++':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      default:
        return 'bg-primary-container/20 text-on-primary-container border-primary-container/30';
    }
  };

  return (
    <div className="bg-surface-container-low rounded-xl border border-outline-variant/60 overflow-hidden shadow-sm space-y-0">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-outline-variant/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-high/20">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-xl">history</span>
          <h3 className="text-sm font-bold text-on-surface">Recent Pastes</h3>
        </div>
        <div className="text-xs font-mono text-outline">
          Showing {filteredPastes.length} of {pastes.length} pastes
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-outline-variant/60 bg-surface-container-low text-[11px] font-mono text-outline uppercase tracking-wider">
              <th className="px-5 py-3 font-semibold">Title &amp; Meta</th>
              <th className="px-5 py-3 font-semibold">Language</th>
              <th className="px-5 py-3 font-semibold">Visibility</th>
              <th className="px-5 py-3 font-semibold">Views</th>
              <th className="px-5 py-3 font-semibold">Last Updated</th>
              <th className="px-5 py-3 font-semibold text-right">Quick Actions</th>
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
                  {/* Title & Metadata Cell */}
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0 font-mono text-xs border border-outline-variant/40">
                        <span className="material-symbols-outlined text-base">code</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        {/* Title Row */}
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-on-surface group-hover:text-primary transition-colors text-xs truncate max-w-[220px]">
                            {p.title}
                          </span>

                          {p.isPinned && (
                            <span className="material-symbols-outlined text-xs text-primary shrink-0" title="Pinned Paste">
                              push_pin
                            </span>
                          )}

                          {p.createdAt && (p.createdAt.includes('hour') || p.createdAt.includes('Just') || p.createdAt.includes('min')) && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 font-semibold shrink-0 whitespace-nowrap">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
                              Recently Updated
                            </span>
                          )}
                        </div>

                        {/* Metadata Line */}
                        <div className="text-[10px] font-mono text-outline flex items-center gap-2 mt-0.5 shrink-0 whitespace-nowrap">
                          <span className="px-1.5 py-0.2 rounded bg-surface-container-high text-on-surface-variant border border-outline-variant/40 shrink-0">
                            📁 {p.folder || 'Utils'}
                          </span>
                          <span>{p.lines} lines</span>
                          <span>•</span>
                          <span>{p.author}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Language */}
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-mono font-medium border whitespace-nowrap ${getLangBadgeStyle(
                        p.language
                      )}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span> {p.language}
                    </span>
                  </td>

                  {/* Visibility */}
                  <td className="px-5 py-3">{getVisibilityPill(p.visibility)}</td>

                  {/* Views */}
                  <td className="px-5 py-3 text-on-surface-variant font-mono text-xs whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-outline">visibility</span> {p.views}
                    </div>
                  </td>

                  {/* Last Updated */}
                  <td className="px-5 py-3 text-on-surface-variant text-xs font-mono whitespace-nowrap">{p.createdAt}</td>

                  {/* Actions */}
                  <td className="px-5 py-3 text-right">
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
                          sharePaste(p);
                        }}
                        className="p-1.5 hover:bg-surface-variant/80 rounded-md text-outline hover:text-on-surface transition-colors"
                        title="Share Link"
                      >
                        <span className="material-symbols-outlined text-base">share</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(p.id);
                          showToast(p.isFavorite ? `Removed "${p.title}" from favorites.` : `Saved "${p.title}" to favorites!`);
                        }}
                        className={`p-1.5 hover:bg-surface-variant/80 rounded-md transition-colors ${
                          p.isFavorite ? 'text-amber-400' : 'text-outline hover:text-amber-400'
                        }`}
                        title="Favorite Snippet"
                      >
                        <span className="material-symbols-outlined text-base">
                          {p.isFavorite ? 'star' : 'star_border'}
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
  );
};
