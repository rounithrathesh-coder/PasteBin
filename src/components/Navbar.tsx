import React, { useEffect } from 'react';
import { usePastes } from '../context/PasteContext';

export const Navbar: React.FC = () => {
  const { searchQuery, setSearchQuery, setIsEditorModalOpen, setActiveSnippet } = usePastes();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('navbar-search-input');
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenNewEditor = () => {
    setActiveSnippet(null);
    setIsEditorModalOpen(true);
  };

  return (
    <nav className="h-14 border-b border-outline-variant/60 flex items-center justify-between px-5 z-50 bg-surface shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 cursor-pointer shrink-0">
        <div className="bg-primary-container p-1.5 rounded-lg shadow-sm shadow-primary-container/40">
          <span className="material-symbols-outlined text-white text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
            terminal
          </span>
        </div>
        <span className="text-lg font-bold tracking-tight text-on-surface">PasteBin</span>
      </div>

      {/* Global Search */}
      <div className="flex-1 max-w-xl px-8">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg group-focus-within:text-primary transition-colors">
            search
          </span>
          <input
            id="navbar-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pastes by title, code content, language, or author..."
            className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg py-2 pl-10 pr-12 text-sm focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all group-hover:border-outline placeholder:text-outline/70"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-surface-container-high/80 px-1.5 py-0.5 rounded border border-outline-variant/60">
            <span className="text-[10px] font-mono font-medium text-on-surface-variant">⌘ K</span>
          </div>
        </div>
      </div>

      {/* Global Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* New Paste */}
        <button
          onClick={handleOpenNewEditor}
          className="bg-primary-container text-on-primary-container px-3.5 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 hover:brightness-110 transition-all shadow-sm shadow-primary-container/20 active:scale-95"
        >
          <span className="material-symbols-outlined text-base">add</span>
          New Paste
        </button>

        <div className="h-7 w-[1px] bg-outline-variant/50 mx-0.5"></div>

        {/* Theme Toggle */}
        <button
          className="p-2 text-outline hover:text-on-surface transition-colors rounded-lg hover:bg-surface-variant/40"
          title="Toggle Theme"
        >
          <span className="material-symbols-outlined text-xl">light_mode</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            className="p-2 text-outline hover:text-on-surface transition-colors rounded-lg hover:bg-surface-variant/40"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
          </button>
          <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-surface">
            3
          </span>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 ml-1 cursor-pointer group p-1 rounded-lg hover:bg-surface-variant/40 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs ring-1 ring-primary/20">
            RA
          </div>
          <span className="material-symbols-outlined text-outline group-hover:text-on-surface text-base">expand_more</span>
        </div>
      </div>
    </nav>
  );
};
