import React from 'react';
import { usePastes } from '../../context/PasteContext';

export const FilterToolbar: React.FC<{
  viewMode: 'list' | 'grid';
  setViewMode: (mode: 'list' | 'grid') => void;
}> = ({ viewMode, setViewMode }) => {
  const {
    searchQuery,
    setSearchQuery,
    selectedLanguage,
    setSelectedLanguage,
    filterFolder,
    setFilterFolder,
    sortBy,
    setSortBy,
    folders,
    selectedSnippetIds,
    pastes,
    setSelectedSnippetIds,
    bulkDeletePastes
  } = usePastes();

  const isAllSelected = selectedSnippetIds.length > 0 && selectedSnippetIds.length === pastes.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedSnippetIds([]);
    } else {
      setSelectedSnippetIds(pastes.map((p) => p.id));
    }
  };

  // Derive distinct languages dynamically from live pastes
  const availableLanguages = Array.from(
    new Set(pastes.map((p) => p.language))
  ).filter(Boolean).sort();

  return (
    <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-3.5 shadow-sm">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="flex-1 relative group min-w-[200px]">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg group-focus-within:text-primary transition-colors">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search snippets by title, description, code content, or #tags..."
            className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg py-2.5 pl-10 pr-8 text-xs font-mono text-on-surface focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline/60"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>

        {/* Filter Controls Group */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Language Selector */}
          <div className="relative w-36 sm:w-40">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg py-2.5 pl-3 pr-8 text-xs font-mono text-on-surface focus:outline-none focus:border-primary hover:border-outline transition-all appearance-none cursor-pointer truncate"
            >
              <option value="All">All Languages</option>
              {availableLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-outline text-base pointer-events-none">
              unfold_more
            </span>
          </div>

          {/* Folder Selector */}
          <div className="relative w-36 sm:w-40">
            <select
              value={filterFolder}
              onChange={(e) => setFilterFolder(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg py-2.5 pl-3 pr-8 text-xs font-mono text-on-surface focus:outline-none focus:border-primary hover:border-outline transition-all appearance-none cursor-pointer truncate"
            >
              <option value="All">All Folders</option>
              {folders.map((f) => (
                <option key={f.id} value={f.name}>
                  {f.name} ({f.count})
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-outline text-base pointer-events-none">
              unfold_more
            </span>
          </div>

          {/* Sort Selector */}
          <div className="relative w-32 sm:w-36">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg py-2.5 pl-3 pr-8 text-xs font-mono text-on-surface focus:outline-none focus:border-primary hover:border-outline transition-all appearance-none cursor-pointer truncate"
            >
              <option value="Latest">Latest</option>
              <option value="Views">Views</option>
              <option value="Title">Name</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-outline text-base pointer-events-none">
              unfold_more
            </span>
          </div>

          {/* View Mode & Multi-Select Buttons */}
          <div className="flex items-center gap-1 border-l border-outline-variant/50 pl-2">
            <button
              onClick={handleToggleSelectAll}
              className={`p-2 rounded-lg border transition-all duration-200 ${
                selectedSnippetIds.length > 0
                  ? 'bg-primary/20 text-primary border-primary/40 shadow-sm'
                  : 'bg-surface-container-lowest border-outline-variant/60 text-outline hover:text-on-surface hover:border-outline'
              }`}
              title={selectedSnippetIds.length > 0 ? 'Deselect All' : 'Select All / Multi-Select'}
            >
              <span className="material-symbols-outlined text-base">checklist</span>
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg border transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-primary-container text-on-primary-container border-primary-container shadow-sm'
                  : 'bg-surface-container-lowest border-outline-variant/60 text-outline hover:text-on-surface hover:border-outline'
              }`}
              title="List View"
            >
              <span className="material-symbols-outlined text-base">format_list_bulleted</span>
            </button>

            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg border transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-primary-container text-on-primary-container border-primary-container shadow-sm'
                  : 'bg-surface-container-lowest border-outline-variant/60 text-outline hover:text-on-surface hover:border-outline'
              }`}
              title="Grid View"
            >
              <span className="material-symbols-outlined text-base">grid_view</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedSnippetIds.length > 0 && (
        <div className="flex items-center justify-between bg-primary/10 border border-primary/30 p-2.5 rounded-lg text-xs font-mono animate-fade-in">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleToggleSelectAll}
                className="rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
              />
              <span className="font-semibold text-primary">{selectedSnippetIds.length} Snippets Selected</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedSnippetIds([])}
              className="px-2.5 py-1 rounded bg-surface-container-high text-outline hover:text-on-surface text-[11px] transition-colors"
            >
              Clear Selection
            </button>
            <button
              onClick={bulkDeletePastes}
              className="px-3 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 font-semibold flex items-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">delete</span> Delete Selected
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
