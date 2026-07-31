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

  return (
    <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-3.5 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Wider Search Bar with Focus Glow */}
        <div className="sm:col-span-6 relative group">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg group-focus-within:text-primary transition-colors">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search snippets by title, description, code content, or #tags..."
            className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg py-2.5 pl-10 pr-4 text-xs font-mono text-on-surface focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary/20 focus:shadow-md focus:shadow-primary/10 transition-all duration-200 placeholder:text-outline/60"
          />
        </div>

        {/* Language Selector */}
        <div className="sm:col-span-2 relative">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg py-2.5 px-3 text-xs font-mono text-on-surface focus:outline-none focus:border-primary hover:border-outline transition-all duration-200 appearance-none cursor-pointer"
          >
            <option value="All">All Languages</option>
            <option value="Python">Python</option>
            <option value="JavaScript">JavaScript</option>
            <option value="HTML">HTML</option>
            <option value="SQL">SQL</option>
            <option value="C++">C++</option>
            <option value="Bash">Bash</option>
          </select>
          <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-base pointer-events-none">
            unfold_more
          </span>
        </div>

        {/* Folder Selector */}
        <div className="sm:col-span-2 relative">
          <select
            value={filterFolder}
            onChange={(e) => setFilterFolder(e.target.value)}
            className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg py-2.5 px-3 text-xs font-mono text-on-surface focus:outline-none focus:border-primary hover:border-outline transition-all duration-200 appearance-none cursor-pointer"
          >
            <option value="All">All Folders</option>
            {folders.map((f) => (
              <option key={f.id} value={f.name}>
                {f.name} ({f.count})
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-base pointer-events-none">
            unfold_more
          </span>
        </div>

        {/* Sort Selector */}
        <div className="sm:col-span-1 relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg py-2.5 px-3 text-xs font-mono text-on-surface focus:outline-none focus:border-primary hover:border-outline transition-all duration-200 appearance-none cursor-pointer"
          >
            <option value="Latest">Latest</option>
            <option value="Views">Views</option>
            <option value="Title">Name</option>
          </select>
          <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-outline text-base pointer-events-none">
            unfold_more
          </span>
        </div>

        {/* View Mode & Select Mode Toggle */}
        <div className="sm:col-span-1 flex items-center justify-end gap-1">
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
