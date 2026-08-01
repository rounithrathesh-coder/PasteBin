import React, { useState } from 'react';
import { usePastes } from '../../context/PasteContext';
import { TrendingWidgets } from './TrendingWidgets';

export const TrendingView: React.FC = () => {
  const { pastes, setActiveSnippet, setIsEditorModalOpen, showToast, toggleFavorite, sharePaste } = usePastes();

  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [sortBy, setSortBy] = useState('Most Viewed');

  // Derive distinct languages dynamically from active pastes
  const availableLanguages = Array.from(
    new Set(pastes.map((p) => p.language))
  ).filter(Boolean).sort();

  // Dynamic trending dataset computed from live pastes state with timeframe weighting
  const trendingSnippets = pastes.map((p, idx) => {
    // Timeframe popularity multiplier
    let tfMultiplier = 1;
    if (timeframe === 'today') {
      tfMultiplier = p.createdAt.includes('hour') || p.createdAt.includes('Just') ? 2.5 : 1.2;
    } else if (timeframe === 'week') {
      tfMultiplier = 1.5;
    }

    const calculatedViews = Math.round((p.views || 10) * tfMultiplier);
    const calculatedStars = p.stars || Math.floor(calculatedViews * 0.4) + 5;
    const calculatedLikes = p.likes || Math.floor(calculatedViews * 0.3) + 3;
    const calculatedCopies = p.copies || Math.floor(calculatedViews * 0.5) + 8;

    return {
      ...p,
      rank: idx + 1,
      effectiveViews: calculatedViews,
      stars: calculatedStars,
      likes: calculatedLikes,
      copies: calculatedCopies
    };
  });

  // Timeframe filtering filter
  const timeframeFiltered = trendingSnippets.filter((p) => {
    if (timeframe === 'today') {
      // Prioritize recently created or highly viewed items
      return p.createdAt.includes('hour') || p.createdAt.includes('Just') || p.createdAt.includes('today') || p.effectiveViews > 50;
    }
    return true; // Week & Month include full dataset
  });

  // Search & Language Filtering
  const filtered = timeframeFiltered.filter((p) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      p.title.toLowerCase().includes(query) ||
      (p.description ?? '').toLowerCase().includes(query) ||
      (p.code ?? '').toLowerCase().includes(query) ||
      p.language.toLowerCase().includes(query) ||
      (p.author ?? '').toLowerCase().includes(query) ||
      (p.tags ?? []).some((t) => t.toLowerCase().includes(query));

    const matchesLang =
      selectedLanguage === 'All' ||
      p.language.toLowerCase() === selectedLanguage.toLowerCase();

    return matchesSearch && matchesLang;
  });

  // Sorting logic
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'Most Starred') return b.stars - a.stars;
    if (sortBy === 'Most Copied') return b.copies - a.copies;
    if (sortBy === 'Newest') return (b.id > a.id ? 1 : -1);
    return b.effectiveViews - a.effectiveViews; // Default Most Viewed
  });

  // Re-rank after sort
  const rankedSorted = sorted.map((item, idx) => ({ ...item, rank: idx + 1 }));

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 ring-1 ring-amber-400/30';
      case 2:
        return 'bg-slate-400/20 text-slate-200 border-slate-400/40';
      case 3:
        return 'bg-orange-600/20 text-orange-300 border-orange-600/40';
      default:
        return 'bg-surface-container-high text-outline border-outline-variant/60';
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 space-y-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/40 pb-5">
            <div className="space-y-1">
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-on-surface flex items-center gap-3">
                <span className="material-symbols-outlined text-amber-400 text-3xl">local_fire_department</span>
                Trending Snippets
              </h1>
              <p className="text-sm text-on-surface-variant">
                Discover the most popular code snippets across the developer community.
              </p>
            </div>

            {/* Timeframe Tabs (Trending Today, This Week, This Month) */}
            <div className="flex items-center gap-1.5 bg-surface-container-low p-1.5 rounded-xl border border-outline-variant/60">
              {(['today', 'week', 'month'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    timeframe === tf
                      ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                      : 'text-outline hover:text-on-surface hover:bg-surface-variant/40'
                  }`}
                >
                  {tf === 'today' ? 'Trending Today' : tf === 'week' ? 'This Week' : 'This Month'}
                </button>
              ))}
            </div>
          </div>

          {/* Filter & Sort Toolbar */}
          <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center shadow-sm">
            {/* Search Input */}
            <div className="sm:col-span-6 relative group">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg group-focus-within:text-primary transition-colors">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search trending snippets..."
                className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg py-2.5 pl-10 pr-8 text-xs font-mono text-on-surface focus:outline-none focus:border-primary-container transition-all placeholder:text-outline/60"
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

            {/* Language Selector */}
            <div className="sm:col-span-3 relative">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg py-2.5 px-3 text-xs font-mono text-on-surface focus:outline-none focus:border-primary appearance-none cursor-pointer pr-8"
              >
                <option value="All">All Languages</option>
                {availableLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-base pointer-events-none">
                unfold_more
              </span>
            </div>

            {/* Sort Selector */}
            <div className="sm:col-span-3 relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg py-2.5 px-3 text-xs font-mono text-on-surface focus:outline-none focus:border-primary appearance-none cursor-pointer pr-8"
              >
                <option value="Most Viewed">Sort: Most Viewed</option>
                <option value="Most Starred">Sort: Most Starred</option>
                <option value="Most Copied">Sort: Most Copied</option>
                <option value="Newest">Sort: Newest</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-base pointer-events-none">
                unfold_more
              </span>
            </div>
          </div>

          {/* Active Filter Indicators */}
          {(searchQuery || selectedLanguage !== 'All' || sortBy !== 'Most Viewed' || timeframe !== 'today') && (
            <div className="flex items-center justify-between text-xs font-mono bg-surface-container-lowest px-4 py-2 rounded-lg border border-outline-variant/40 text-outline">
              <div className="flex items-center gap-2">
                <span>Active Filters:</span>
                {timeframe !== 'today' && (
                  <span className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded capitalize">
                    {timeframe}
                  </span>
                )}
                {selectedLanguage !== 'All' && (
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                    {selectedLanguage}
                  </span>
                )}
                {sortBy !== 'Most Viewed' && (
                  <span className="bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded">
                    {sortBy}
                  </span>
                )}
                {searchQuery && (
                  <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded">
                    "{searchQuery}"
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  setTimeframe('today');
                  setSearchQuery('');
                  setSelectedLanguage('All');
                  setSortBy('Most Viewed');
                }}
                className="text-xs text-primary hover:underline font-semibold"
              >
                Reset All
              </button>
            </div>
          )}

          {/* Snippets List */}
          {rankedSorted.length === 0 ? (
            <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-12 text-center space-y-3 font-mono">
              <span className="material-symbols-outlined text-outline text-4xl">search_off</span>
              <div className="text-on-surface font-bold text-sm">No trending snippets match your filter.</div>
              <p className="text-xs text-outline">Try searching for a different language or clearing your search term.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedLanguage('All');
                }}
                className="mt-2 px-4 py-2 bg-primary-container text-on-primary-container text-xs font-semibold rounded-lg hover:brightness-110"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {rankedSorted.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setActiveSnippet(p);
                    setIsEditorModalOpen(true);
                  }}
                  className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-5 hover:border-l-4 hover:border-l-primary hover:bg-surface-container-high/50 transition-all duration-200 cursor-pointer group shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      {/* Rank Badge */}
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs border ${getRankBadge(p.rank)}`}>
                        #{p.rank}
                      </span>

                      <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors">
                        {p.title}
                      </h3>

                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-surface-container-highest text-outline border border-outline-variant/40">
                        {p.language}
                      </span>
                    </div>

                    <p className="text-xs text-on-surface-variant/80 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>

                    {/* Metadata & Metrics */}
                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-outline pt-1">
                      <div className="flex items-center gap-1.5 text-on-surface font-medium">
                        <span>by {p.author}</span>
                      </div>

                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">visibility</span> {p.effectiveViews} views
                      </span>
                      <span className="flex items-center gap-1 text-amber-400">
                        <span className="material-symbols-outlined text-sm">star</span> {p.stars}
                      </span>
                      <span className="flex items-center gap-1 text-red-400">
                        <span className="material-symbols-outlined text-sm">favorite</span> {p.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">content_copy</span> {p.copies}
                      </span>

                      <span>•</span>
                      <span>{p.fileSize}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(p.id);
                        showToast(p.isFavorite ? `Removed "${p.title}" from favorites.` : `Saved "${p.title}" to favorites!`);
                      }}
                      className={`p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/60 transition-colors ${
                        p.isFavorite ? 'text-amber-400 border-amber-400/40 bg-amber-500/10' : 'text-outline hover:text-amber-400'
                      }`}
                      title="Save snippet"
                    >
                      <span className="material-symbols-outlined text-base">star</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(p.code);
                        showToast(`Copied code snippet to clipboard!`);
                      }}
                      className="p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/60 text-outline hover:text-on-surface transition-colors"
                      title="Copy Code"
                    >
                      <span className="material-symbols-outlined text-base">content_copy</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        sharePaste(p);
                      }}
                      className="p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/60 text-outline hover:text-on-surface transition-colors"
                      title="Share Link"
                    >
                      <span className="material-symbols-outlined text-base">share</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSnippet(p);
                        setIsEditorModalOpen(true);
                      }}
                      className="px-3 py-2 bg-primary-container text-on-primary-container rounded-lg text-xs font-semibold hover:brightness-110 transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-base">open_in_new</span>
                      Open
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Right Sidebar Widgets */}
      <aside className="w-80 border-l border-outline-variant/60 shrink-0 overflow-y-auto custom-scrollbar bg-surface-container-lowest p-5 space-y-6">
        <TrendingWidgets />
      </aside>
    </div>
  );
};
