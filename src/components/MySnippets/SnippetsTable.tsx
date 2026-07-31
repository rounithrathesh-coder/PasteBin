import React, { useState } from 'react';
import { usePastes } from '../../context/PasteContext';
import { Snippet } from '../../types/paste';

export const SnippetsTable: React.FC<{ viewMode: 'list' | 'grid' }> = ({ viewMode }) => {
  const {
    pastes,
    searchQuery,
    selectedLanguage,
    filterVisibility,
    filterFolder,
    sortBy,
    selectedSnippetIds,
    setSelectedSnippetIds,
    setActiveSnippet,
    setIsEditorModalOpen,
    setDeleteModalSnippet,
    showToast,
    toggleFavorite
  } = usePastes();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filtering Logic
  const filtered = pastes.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesLang = selectedLanguage === 'All' || p.language.toLowerCase() === selectedLanguage.toLowerCase();

    const matchesFolder = filterFolder === 'All' || p.folder === filterFolder;

    let matchesVis = true;
    if (filterVisibility === 'Favorites') {
      matchesVis = !!p.isFavorite;
    } else if (filterVisibility !== 'All') {
      matchesVis = p.visibility === filterVisibility;
    }

    return matchesSearch && matchesLang && matchesFolder && matchesVis;
  });

  // Sorting Logic
  const sorted = [...filtered].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    if (sortBy === 'Views') return b.views - a.views;
    if (sortBy === 'Title') return a.title.localeCompare(b.title);
    return 0; // Default Latest
  });

  // Pagination Slice
  const totalPages = Math.ceil(sorted.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = sorted.slice(startIndex, startIndex + itemsPerPage);

  const isAllPageSelected = paginatedItems.length > 0 && paginatedItems.every((p) => selectedSnippetIds.includes(p.id));
  const isSelectionActive = selectedSnippetIds.length > 0;

  const handleToggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const pageIds = paginatedItems.map((p) => p.id);
      setSelectedSnippetIds(Array.from(new Set([...selectedSnippetIds, ...pageIds])));
    } else {
      const pageIds = paginatedItems.map((p) => p.id);
      setSelectedSnippetIds(selectedSnippetIds.filter((id) => !pageIds.includes(id)));
    }
  };

  const handleToggleRowSelect = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedSnippetIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleCopyCode = (e: React.MouseEvent, p: Snippet) => {
    e.stopPropagation();
    navigator.clipboard.writeText(p.code);
    showToast(`Copied "${p.title}" code to clipboard!`);
  };

  const handleOpenRow = (p: Snippet) => {
    setActiveSnippet(p);
    setIsEditorModalOpen(true);
  };

  const getLangBadgeStyle = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'python':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'html':
        return 'bg-orange-500/15 text-orange-300 border-orange-500/30';
      case 'javascript':
      case 'js':
        return 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30';
      case 'sql':
        return 'bg-sky-500/15 text-sky-300 border-sky-500/30';
      case 'c++':
      case 'cpp':
        return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
      case 'bash':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
    }
  };

  const getVisibilityPill = (vis: string) => {
    switch (vis) {
      case 'Public':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
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

  if (sorted.length === 0) {
    return (
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-12 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-surface-container-high mx-auto flex items-center justify-center text-outline">
          <span className="material-symbols-outlined text-2xl">folder_off</span>
        </div>
        <h3 className="text-base font-bold text-on-surface">No snippets found</h3>
        <p className="text-xs text-outline font-mono max-w-md mx-auto">
          No code snippets match your search criteria or active filters. Try adjusting your search term or clearing filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* View Mode Conditional Rendering */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedItems.map((p) => {
            const isSelected = selectedSnippetIds.includes(p.id);
            return (
              <div
                key={p.id}
                onClick={() => handleOpenRow(p)}
                className={`bg-surface-container-low border ${
                  isSelected ? 'border-primary ring-1 ring-primary' : 'border-outline-variant/60'
                } rounded-xl p-4 space-y-3 hover:border-l-4 hover:border-l-primary hover:bg-surface-container-high/50 transition-all duration-200 cursor-pointer group shadow-sm flex flex-col justify-between`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleToggleRowSelect(e as any, p.id)}
                        className={`rounded border-outline-variant text-primary focus:ring-primary cursor-pointer transition-opacity duration-200 ${
                          isSelected || isSelectionActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}
                      />
                      <span className="font-bold text-base text-on-surface group-hover:text-primary transition-colors line-clamp-1 flex items-center gap-1.5">
                        {p.isPinned && <span className="material-symbols-outlined text-amber-400 text-sm">push_pin</span>}
                        {p.title}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(p.id);
                      }}
                      className={`p-1 rounded-full hover:bg-amber-400/10 transition-colors ${
                        p.isFavorite ? 'text-amber-400' : 'text-outline hover:text-amber-400'
                      }`}
                      title={p.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <span
                        className="material-symbols-outlined text-xl"
                        style={{ fontVariationSettings: p.isFavorite ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        star
                      </span>
                    </button>
                  </div>

                  <p className="text-xs text-outline/80 line-clamp-2 leading-relaxed">{p.description || p.code.slice(0, 80)}</p>
                </div>

                <div className="pt-2 border-t border-outline-variant/40 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono border font-semibold ${getLangBadgeStyle(p.language)}`}>
                      {p.language}
                    </span>
                    {getVisibilityPill(p.visibility)}
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-outline">
                    <span>{p.fileSize || '1.2 KB'} • {p.lastOpened || 'recently'}</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">visibility</span> {p.views}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high/40 border-b border-outline-variant/60 text-[10px] text-outline uppercase tracking-widest font-mono font-semibold">
                  <th className="p-4 w-10">
                    <input
                      type="checkbox"
                      checked={isAllPageSelected}
                      onChange={handleToggleSelectAll}
                      className={`rounded border-outline-variant text-primary focus:ring-primary cursor-pointer transition-opacity duration-200 ${
                        isSelectionActive ? 'opacity-100' : 'opacity-40 hover:opacity-100'
                      }`}
                      title="Select All"
                    />
                  </th>
                  <th className="px-2 py-3.5 w-10 text-center">Star</th>
                  <th className="px-4 py-3.5">Title &amp; Metadata</th>
                  <th className="px-4 py-3.5">Language</th>
                  <th className="px-4 py-3.5">Visibility</th>
                  <th className="px-4 py-3.5">Views</th>
                  <th className="px-4 py-3.5">Updated</th>
                  <th className="px-4 py-3.5 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30 text-sm">
                {paginatedItems.map((p) => {
                  const isSelected = selectedSnippetIds.includes(p.id);
                  return (
                    <tr
                      key={p.id}
                      onClick={() => handleOpenRow(p)}
                      className={`hover:bg-surface-container-high/50 hover:border-l-4 hover:border-l-primary transition-all duration-200 group cursor-pointer ${
                        isSelected ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                      }`}
                    >
                      {/* Checkbox appears smoothly on hover OR stays visible when selected/selection active */}
                      <td className="p-4 w-10" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleToggleRowSelect(e as any, p.id)}
                          className={`rounded border-outline-variant text-primary focus:ring-primary cursor-pointer transition-opacity duration-200 ${
                            isSelected || isSelectionActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                          }`}
                        />
                      </td>

                      {/* Prominent Always-Visible Star Column */}
                      <td className="px-2 py-3.5 w-10 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            toggleFavorite(p.id);
                            showToast(p.isFavorite ? 'Removed from favorites' : 'Starred in favorites');
                          }}
                          className={`p-1 rounded-md transition-all hover:scale-110 ${
                            p.isFavorite
                              ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                              : 'text-outline/40 hover:text-amber-400'
                          }`}
                          title={p.isFavorite ? 'Unstar snippet' : 'Star snippet'}
                        >
                          <span
                            className="material-symbols-outlined text-lg"
                            style={{ fontVariationSettings: p.isFavorite ? "'FILL' 1" : "'FILL' 0" }}
                          >
                            star
                          </span>
                        </button>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0 font-mono text-xs ring-1 ring-primary/20">
                            <span className="material-symbols-outlined text-lg">code</span>
                          </div>
                          <div className="space-y-1">
                            <div className="font-bold text-base text-on-surface group-hover:text-primary transition-colors flex items-center gap-2">
                              {p.isPinned && (
                                <span className="material-symbols-outlined text-amber-400 text-sm" title="Pinned Snippet">
                                  push_pin
                                </span>
                              )}
                              {p.title}
                              {p.createdAt && p.createdAt.includes('hour') && (
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">
                                  Recently Updated
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-outline/80 font-sans line-clamp-1">{p.description}</div>
                            {/* Extended Metadata Pills */}
                            <div className="flex items-center gap-2.5 text-[11px] font-mono text-outline pt-0.5">
                              <span className="px-1.5 py-0.2 rounded bg-surface-container-high text-on-surface-variant/90 border border-outline-variant/40">
                                {p.folder || 'Utils'}
                              </span>
                              <span>{p.fileSize || '1.2 KB'}</span>
                              <span>•</span>
                              <span>Opened {p.lastOpened || 'recently'}</span>
                              {p.tags && p.tags.length > 0 && (
                                <>
                                  <span>•</span>
                                  <div className="flex items-center gap-1">
                                    {p.tags.map((t) => (
                                      <span key={t} className="text-primary/90">
                                        #{t}
                                      </span>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-semibold border ${getLangBadgeStyle(
                            p.language
                          )}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span> {p.language}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">{getVisibilityPill(p.visibility)}</td>

                      <td className="px-4 py-3.5 text-on-surface-variant font-mono text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-outline">visibility</span> {p.views}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-on-surface-variant text-xs">{p.createdAt}</td>

                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => handleCopyCode(e, p)}
                            className="p-1.5 hover:bg-surface-variant/80 rounded-md text-outline hover:text-on-surface transition-colors"
                            title="Copy Code"
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
                              handleOpenRow(p);
                            }}
                            className="p-1.5 hover:bg-surface-variant/80 rounded-md text-outline hover:text-on-surface transition-colors"
                            title="Edit Snippet"
                          >
                            <span className="material-symbols-outlined text-base">edit</span>
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
                              setDeleteModalSnippet(p);
                            }}
                            className="p-1.5 hover:bg-red-500/20 rounded-md text-outline hover:text-red-400 transition-colors"
                            title="Delete Snippet"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upgraded Pagination Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2 text-xs font-mono text-outline">
        <div>
          Showing <span className="text-on-surface font-semibold">{startIndex + 1}–{Math.min(startIndex + itemsPerPage, sorted.length)}</span> of{' '}
          <span className="text-on-surface font-semibold">{sorted.length}</span> snippets
        </div>

        <div className="flex items-center gap-2 self-center">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg border border-outline-variant/60 disabled:opacity-40 hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-base">chevron_left</span>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                currentPage === page
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'hover:bg-surface-container-high text-outline'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-lg border border-outline-variant/60 disabled:opacity-40 hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-base">chevron_right</span>
          </button>
        </div>

        {/* Rows Per Page Selector */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span>Rows per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-surface-container-lowest border border-outline-variant/60 rounded px-2 py-1 text-xs font-mono text-on-surface focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
    </div>
  );
};
