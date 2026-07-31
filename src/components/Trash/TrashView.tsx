import React, { useState } from 'react';
import { usePastes } from '../../context/PasteContext';
import { Snippet } from '../../types/paste';
import { ItemsInTrashWidget, TrashActivityWidget } from './TrashWidgets';

export const TrashView: React.FC = () => {
  const {
    trashedPastes,
    restorePaste,
    permanentlyDeletePaste,
    emptyTrash,
    bulkRestorePastes,
    bulkPermanentlyDeletePastes
  } = usePastes();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedTime, setSelectedTime] = useState('All Time');
  const [sortBy, setSortBy] = useState('Deleted (Newest)');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [confirmEmptyModal, setConfirmEmptyModal] = useState(false);

  // Filtering
  const filtered = trashedPastes.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.language.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLang = selectedLanguage === 'All' || p.language.toLowerCase() === selectedLanguage.toLowerCase();

    return matchesSearch && matchesLang;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'Deleted (Oldest)') return a.id.localeCompare(b.id);
    if (sortBy === 'Title') return a.title.localeCompare(b.title);
    return 0; // Default Deleted (Newest)
  });

  // Pagination Slice
  const totalPages = Math.ceil(sorted.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = sorted.slice(startIndex, startIndex + itemsPerPage);

  const isAllPageSelected = paginatedItems.length > 0 && paginatedItems.every((p) => selectedIds.includes(p.id));

  const handleToggleSelectAll = () => {
    if (isAllPageSelected) {
      const pageIds = paginatedItems.map((p) => p.id);
      setSelectedIds(selectedIds.filter((id) => !pageIds.includes(id)));
    } else {
      const pageIds = paginatedItems.map((p) => p.id);
      setSelectedIds(Array.from(new Set([...selectedIds, ...pageIds])));
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleBulkRestore = () => {
    if (selectedIds.length > 0) {
      bulkRestorePastes(selectedIds);
      setSelectedIds([]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length > 0) {
      bulkPermanentlyDeletePastes(selectedIds);
      setSelectedIds([]);
    }
  };

  const getLangBadgeStyle = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'python':
        return { badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30', dot: 'bg-blue-400' };
      case 'html':
        return { badge: 'bg-orange-500/15 text-orange-300 border-orange-500/30', dot: 'bg-orange-400' };
      case 'javascript':
      case 'js':
        return { badge: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30', dot: 'bg-yellow-400' };
      case 'sql':
        return { badge: 'bg-sky-500/15 text-sky-300 border-sky-500/30', dot: 'bg-sky-400' };
      case 'c++':
      case 'cpp':
        return { badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30', dot: 'bg-indigo-400' };
      case 'bash':
      default:
        return { badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', dot: 'bg-emerald-400' };
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Center Main Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 space-y-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="space-y-1">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-on-surface flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl lg:text-3xl text-on-surface">delete</span>
              Trash
              <span className="bg-primary-container text-on-primary-container px-2.5 py-0.5 rounded-full text-xs font-bold font-mono shadow-sm">
                {trashedPastes.length}
              </span>
            </h1>
            <p className="text-xs text-outline font-medium">
              Snippets you've deleted. You can restore or permanently delete them.
            </p>
          </div>

          {/* Top Actions Bar */}
          <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-mono text-outline hover:text-on-surface px-2 py-1 rounded-lg hover:bg-surface-container-high/40 transition-colors">
                <input
                  type="checkbox"
                  checked={isAllPageSelected}
                  onChange={handleToggleSelectAll}
                  className="rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
                />
                <span>{selectedIds.length} selected</span>
              </label>

              {/* Restore Selected Button */}
              <button
                disabled={selectedIds.length === 0}
                onClick={handleBulkRestore}
                className="px-3.5 py-1.5 rounded-lg border border-outline-variant/60 text-xs font-semibold text-on-surface disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container-high hover:border-outline flex items-center gap-1.5 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-base text-primary">rotate_left</span>
                Restore
              </button>

              {/* Delete Permanently Button */}
              <button
                disabled={selectedIds.length === 0}
                onClick={handleBulkDelete}
                className="px-3.5 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-xs font-semibold text-red-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-500/20 hover:border-red-500/50 flex items-center gap-1.5 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-base">delete</span>
                Delete Permanently
              </button>
            </div>

            {/* Empty Trash Button */}
            <button
              disabled={trashedPastes.length === 0}
              onClick={() => setConfirmEmptyModal(true)}
              className="px-3.5 py-1.5 rounded-lg border border-red-500/40 text-xs font-semibold text-red-400 hover:bg-red-500/15 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-base">delete_forever</span>
              Empty Trash
            </button>
          </div>

          {/* Filter Toolbar */}
          <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-3.5 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center shadow-sm">
            {/* Search Input */}
            <div className="sm:col-span-5 relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-base group-focus-within:text-primary transition-colors">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search in trash..."
                className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg py-2 pl-9 pr-4 text-xs font-mono text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all placeholder:text-outline/60"
              />
            </div>

            {/* Language Selector */}
            <div className="sm:col-span-3 relative">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg py-2 px-3 text-xs font-mono text-on-surface focus:outline-none focus:border-primary appearance-none cursor-pointer"
              >
                <option value="All">All Languages</option>
                <option value="Python">Python</option>
                <option value="HTML">HTML</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Bash">Bash</option>
                <option value="SQL">SQL</option>
                <option value="C++">C++</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-base pointer-events-none">
                unfold_more
              </span>
            </div>

            {/* Time Filter */}
            <div className="sm:col-span-2 relative">
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg py-2 px-3 text-xs font-mono text-on-surface focus:outline-none focus:border-primary appearance-none cursor-pointer"
              >
                <option value="All Time">All Time</option>
                <option value="7 Days">Last 7 Days</option>
                <option value="30 Days">Last 30 Days</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-base pointer-events-none">
                unfold_more
              </span>
            </div>

            {/* Sort Selector & Filter Button */}
            <div className="sm:col-span-2 flex items-center gap-2">
              <div className="relative flex-1">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg py-2 px-3 text-xs font-mono text-on-surface focus:outline-none focus:border-primary appearance-none cursor-pointer truncate"
                >
                  <option value="Deleted (Newest)">Sort: Deleted (Newest)</option>
                  <option value="Deleted (Oldest)">Sort: Deleted (Oldest)</option>
                  <option value="Title">Sort: Title</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-outline text-base pointer-events-none">
                  unfold_more
                </span>
              </div>

              <button
                className="p-2 bg-surface-container-lowest border border-outline-variant/60 rounded-lg text-outline hover:text-on-surface hover:border-outline transition-colors shrink-0"
                title="Filter options"
              >
                <span className="material-symbols-outlined text-base">filter_list</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl overflow-hidden shadow-sm">
            {sorted.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-surface-container-high mx-auto flex items-center justify-center text-outline">
                  <span className="material-symbols-outlined text-2xl">delete_sweep</span>
                </div>
                <h3 className="text-base font-bold text-on-surface">Trash is Empty</h3>
                <p className="text-xs text-outline font-mono max-w-sm mx-auto">
                  No deleted snippets match your criteria. When you delete snippets, they will appear here for 30 days.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-outline-variant/50 bg-surface-container-lowest/50 text-[10px] font-mono uppercase tracking-wider text-outline select-none">
                      <th className="py-3 px-4 w-10">
                        <input
                          type="checkbox"
                          checked={isAllPageSelected}
                          onChange={handleToggleSelectAll}
                          className="rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
                        />
                      </th>
                      <th className="py-3 px-4 font-semibold">Title &amp; Description</th>
                      <th className="py-3 px-4 font-semibold">Language</th>
                      <th className="py-3 px-4 font-semibold">Deleted On</th>
                      <th className="py-3 px-4 font-semibold">Size</th>
                      <th className="py-3 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/40 text-xs">
                    {paginatedItems.map((p) => {
                      const isSelected = selectedIds.includes(p.id);
                      const style = getLangBadgeStyle(p.language);

                      return (
                        <tr
                          key={p.id}
                          className={`group transition-colors ${
                            isSelected ? 'bg-primary/10' : 'hover:bg-surface-container-high/40'
                          }`}
                        >
                          <td className="py-3.5 px-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleRow(p.id)}
                              className="rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
                            />
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-surface-container-high border border-outline-variant/50 flex items-center justify-center shrink-0 text-primary group-hover:border-primary/40 transition-colors">
                                <span className="material-symbols-outlined text-base">description</span>
                              </div>
                              <div className="space-y-0.5 min-w-0">
                                <div className="font-bold text-on-surface group-hover:text-primary transition-colors text-sm truncate">
                                  {p.title}
                                </div>
                                <div className="text-[11px] text-outline line-clamp-1">
                                  {p.description || 'No description provided.'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold border ${style.badge}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
                              {p.language}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-outline whitespace-nowrap">
                            {p.deletedAt || p.createdAt || 'recently'}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-outline whitespace-nowrap">
                            {p.fileSize || '1.2 KB'}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-1">
                              {/* Restore Button */}
                              <button
                                onClick={() => restorePaste(p.id)}
                                className="p-1.5 hover:bg-surface-variant/80 rounded-md text-outline hover:text-on-surface transition-colors"
                                title="Restore Snippet"
                              >
                                <span className="material-symbols-outlined text-base">rotate_left</span>
                              </button>

                              {/* Permanently Delete Button */}
                              <button
                                onClick={() => permanentlyDeletePaste(p.id)}
                                className="p-1.5 hover:bg-red-500/20 rounded-md text-outline hover:text-red-400 transition-colors"
                                title="Delete Permanently"
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
            )}
          </div>

          {/* Pagination Footer */}
          {sorted.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2 text-xs font-mono text-outline">
              <div>
                Showing <span className="text-on-surface font-semibold">{startIndex + 1}</span> to{' '}
                <span className="text-on-surface font-semibold">{Math.min(startIndex + itemsPerPage, sorted.length)}</span> of{' '}
                <span className="text-on-surface font-semibold">{sorted.length}</span> items
              </div>

              <div className="flex items-center gap-1.5 self-center">
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

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-surface-container-lowest border border-outline-variant/60 rounded px-2 py-1 text-xs font-mono text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value={5}>5 / page</option>
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Right Sidebar Widgets */}
      <aside className="w-80 border-l border-outline-variant/60 shrink-0 overflow-y-auto custom-scrollbar bg-surface-container-lowest p-5 space-y-6">
        <ItemsInTrashWidget />
        <TrashActivityWidget />
      </aside>

      {/* Confirm Empty Trash Modal */}
      {confirmEmptyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400 border-b border-outline-variant/50 pb-3">
              <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">delete_forever</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-on-surface">Empty Trash</h3>
                <p className="text-xs text-outline font-mono">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              Are you sure you want to permanently delete all <strong className="text-on-surface">{trashedPastes.length} items</strong> in the trash? All code snippets and shareable links will be destroyed forever.
            </p>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setConfirmEmptyModal(false)}
                className="px-4 py-2 rounded-lg border border-outline-variant/60 text-xs font-mono text-outline hover:text-on-surface transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  emptyTrash();
                  setConfirmEmptyModal(false);
                }}
                className="px-4 py-2 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors shadow-md shadow-red-500/20"
              >
                Empty Entire Trash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
