import React from 'react';
import { usePastes } from '../context/PasteContext';
import { ViewType } from '../types/paste';

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, setFilterVisibility } = usePastes();

  const handleNavClick = (view: ViewType) => {
    setActiveView(view);
    // Reset filter visibility when switching views
    if (view === 'my-snippets') {
      setFilterVisibility('All');
    } else if (view === 'favorites') {
      setFilterVisibility('Favorites');
    }
  };

  const navItemClass = (view: ViewType) =>
    `w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-left ${
      activeView === view
        ? 'active-nav'
        : 'text-on-surface-variant hover:bg-surface-variant/60 hover:text-on-surface'
    }`;

  return (
    <aside className="w-64 border-r border-outline-variant/60 flex flex-col shrink-0 overflow-y-auto custom-scrollbar bg-surface-container-lowest select-none">
      <div className="p-4 space-y-6">
        {/* Dashboard — Primary */}
        <nav className="space-y-1">
          <button onClick={() => handleNavClick('dashboard')} className={navItemClass('dashboard')}>
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              space_dashboard
            </span>
            Dashboard
          </button>
        </nav>

        {/* MY LIBRARY */}
        <div className="space-y-1">
          <h3 className="px-3 text-[10px] font-bold text-outline uppercase tracking-wider mb-2">My Library</h3>
          <button onClick={() => handleNavClick('my-snippets')} className={navItemClass('my-snippets')}>
            <span className="material-symbols-outlined text-[20px]">description</span>
            My Snippets
          </button>
          <button onClick={() => handleNavClick('favorites')} className={navItemClass('favorites')}>
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
            Favorites
          </button>
          <button onClick={() => handleNavClick('trash')} className={navItemClass('trash')}>
            <span className="material-symbols-outlined text-[20px]">delete</span>
            Trash
          </button>
        </div>

        {/* DISCOVER */}
        <div className="space-y-1">
          <h3 className="px-3 text-[10px] font-bold text-outline uppercase tracking-wider mb-2">Discover</h3>
          <button onClick={() => handleNavClick('public-pastes')} className={navItemClass('public-pastes')}>
            <span className="material-symbols-outlined text-[20px]">public</span>
            Public Pastes
          </button>
          <button onClick={() => handleNavClick('trending')} className={navItemClass('trending')}>
            <span className="material-symbols-outlined text-[20px]">trending_up</span>
            Trending
          </button>
        </div>

        {/* DEVELOPER */}
        <div className="space-y-1">
          <h3 className="px-3 text-[10px] font-bold text-outline uppercase tracking-wider mb-2">Developer</h3>
          <button onClick={() => handleNavClick('api-docs')} className={navItemClass('api-docs')}>
            <span className="material-symbols-outlined text-[20px]">api</span>
            API Docs & Keys
          </button>
          <button onClick={() => handleNavClick('integrations')} className={navItemClass('integrations')}>
            <span className="material-symbols-outlined text-[20px]">hub</span>
            Integrations
          </button>
          <button onClick={() => handleNavClick('system-health')} className={navItemClass('system-health')}>
            <span className="material-symbols-outlined text-[20px]">sensors</span>
            System Health
          </button>
        </div>

        {/* SETTINGS */}
        <div className="space-y-1">
          <h3 className="px-3 text-[10px] font-bold text-outline uppercase tracking-wider mb-2">Settings</h3>
          <button onClick={() => handleNavClick('preferences')} className={navItemClass('preferences')}>
            <span className="material-symbols-outlined text-[20px]">settings</span>
            Preferences
          </button>
          <button onClick={() => handleNavClick('account')} className={navItemClass('account')}>
            <span className="material-symbols-outlined text-[20px]">account_circle</span>
            Account
          </button>
        </div>
      </div>

      {/* Storage Widget */}
      <div className="mt-auto p-4 border-t border-outline-variant/60 space-y-3">
        <div className="bg-surface-container/60 p-3.5 rounded-xl border border-outline-variant/50 space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-on-surface">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-primary">cloud</span> Storage Usage
            </span>
            <span className="text-[10px] font-mono text-outline">23%</span>
          </div>
          <div className="text-[11px] font-mono text-outline">2.34 GB / 10 GB (23%)</div>
          <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-[23%] rounded-full"></div>
          </div>
        </div>
        <button className="w-full py-2 px-3 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-semibold hover:bg-primary/20 transition-all flex items-center justify-center gap-1.5">
          <span className="material-symbols-outlined text-sm">workspace_premium</span> Upgrade Storage
        </button>
      </div>
    </aside>
  );
};
