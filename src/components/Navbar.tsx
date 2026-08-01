import React, { useEffect, useState, useRef } from 'react';
import { usePastes } from '../context/PasteContext';

export const Navbar: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    setIsEditorModalOpen,
    setActiveSnippet,
    setIsAuthModalOpen,
    setActiveView,
    isAuthenticated,
    logout,
    showToast,
    user
  } = usePastes();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Compute avatar initials from user name dynamically
  const avatarInitials = user.name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U';

  // Fetch notification count from /api/health
  useEffect(() => {
    fetch('/api/health')
      .then(r => r.json())
      .then(data => {
        if (typeof data.notifications === 'number') {
          setNotifCount(data.notifications);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('navbar-search-input');
        if (searchInput) searchInput.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOpenNewEditor = () => {
    setActiveSnippet(null);
    setIsEditorModalOpen(true);
  };

  return (
    <nav className="h-14 border-b border-outline-variant/60 flex items-center justify-between px-5 z-50 bg-surface shrink-0">
      {/* Logo */}
      <div
        onClick={() => setActiveView('dashboard')}
        className="flex items-center gap-2.5 cursor-pointer shrink-0"
      >
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

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => showToast(`You have ${notifCount} workspace notification${notifCount !== 1 ? 's' : ''}.`)}
            className="p-2 text-outline hover:text-on-surface transition-colors rounded-lg hover:bg-surface-variant/40"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
          </button>
          {notifCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-surface">
              {notifCount > 9 ? '9+' : notifCount}
            </span>
          )}
        </div>

        {/* Authentication State Controls */}
        {!isAuthenticated ? (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg border border-primary/40 bg-primary/10 text-xs font-mono font-semibold text-primary hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-base">login</span>
            Sign In
          </button>
        ) : (
          <div className="relative ml-1" ref={profileMenuRef}>
            <div
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-1.5 cursor-pointer group p-1 rounded-lg hover:bg-surface-variant/40 transition-colors"
              title="Account Options"
            >
              <div className="w-8 h-8 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs ring-2 ring-primary/30 shadow-sm">
                {avatarInitials}
              </div>
              <span className="material-symbols-outlined text-outline group-hover:text-on-surface text-base">
                {isProfileMenuOpen ? 'expand_less' : 'expand_more'}
              </span>
            </div>

            {/* Profile Dropdown Menu */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 top-11 w-64 bg-surface-container-low border border-outline-variant/60 rounded-xl shadow-2xl p-2.5 z-50 animate-fade-in font-mono space-y-2">
                {/* User Header */}
                <div className="p-2 border-b border-outline-variant/40 space-y-0.5">
                  <div className="text-xs font-bold text-on-surface flex items-center gap-1">
                    {user.name}
                    <span className="material-symbols-outlined text-blue-400 text-xs">verified</span>
                  </div>
                  <div className="text-[10px] text-outline">@{user.username}</div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1 pt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>{user.plan} Account • Active Session</span>
                  </div>
                </div>

                {/* Dropdown Navigation Links */}
                <div className="space-y-0.5 text-xs text-on-surface">
                  <button
                    onClick={() => { setActiveView('account'); setIsProfileMenuOpen(false); }}
                    className="w-full text-left p-2 rounded-lg hover:bg-surface-container-high flex items-center gap-2 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base text-primary">account_circle</span>
                    <span>Account & Security</span>
                  </button>

                  <button
                    onClick={() => { setActiveView('my-snippets'); setIsProfileMenuOpen(false); }}
                    className="w-full text-left p-2 rounded-lg hover:bg-surface-container-high flex items-center gap-2 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base text-purple-400">code</span>
                    <span>My Snippets</span>
                  </button>

                  <button
                    onClick={() => { setActiveView('api-docs'); setIsProfileMenuOpen(false); }}
                    className="w-full text-left p-2 rounded-lg hover:bg-surface-container-high flex items-center gap-2 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base text-emerald-400">api</span>
                    <span>API Docs & Keys</span>
                  </button>

                  <button
                    onClick={() => { setActiveView('preferences'); setIsProfileMenuOpen(false); }}
                    className="w-full text-left p-2 rounded-lg hover:bg-surface-container-high flex items-center gap-2 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base text-amber-400">settings</span>
                    <span>Preferences</span>
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-outline-variant/40 pt-1">
                  <button
                    onClick={() => { logout(); setIsProfileMenuOpen(false); }}
                    className="w-full text-left p-2 rounded-lg hover:bg-red-500/10 text-red-400 flex items-center gap-2 transition-colors font-semibold"
                  >
                    <span className="material-symbols-outlined text-base">logout</span>
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
