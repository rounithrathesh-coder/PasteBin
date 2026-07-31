import React, { useState } from 'react';
import { usePastes } from '../../context/PasteContext';
import { SnippetsTable } from '../MySnippets/SnippetsTable';
import { FilterToolbar } from '../MySnippets/FilterToolbar';
import { SnippetOverview } from '../MySnippets/SnippetOverview';
import { RecentlyOpenedWidget } from '../MySnippets/RecentlyOpenedWidget';
import { LanguageRingWidget } from '../MySnippets/LanguageRingWidget';
import { DeleteConfirmModal } from '../MySnippets/DeleteConfirmModal';

export const FavoritesView: React.FC = () => {
  const { pastes } = usePastes();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const favoritePastes = pastes.filter((p) => p.isFavorite);
  const totalFavoriteViews = favoritePastes.reduce((acc, curr) => acc + curr.views, 0);

  // Determine top language among favorites
  const langCounts: Record<string, number> = {};
  favoritePastes.forEach((p) => {
    langCounts[p.language] = (langCounts[p.language] || 0) + 1;
  });
  const topLanguage = Object.entries(langCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Python';

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Center Workspace */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 space-y-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="space-y-2 border-b border-outline-variant/40 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-md shadow-amber-400/10">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-on-surface flex items-center gap-3">
                  Favorite Snippets
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 font-mono font-medium">
                    {favoritePastes.length} Starred
                  </span>
                </h1>
                <p className="text-sm text-on-surface-variant">
                  Quick access to your starred code snippets, cheatsheets, and algorithms.
                </p>
              </div>
            </div>
          </div>

          {/* Metric Cards Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 flex items-center gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  bookmark
                </span>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-on-surface">{favoritePastes.length}</div>
                <div className="text-xs text-outline">Starred Items</div>
              </div>
            </div>

            <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 flex items-center gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-xl">code</span>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-on-surface">{topLanguage}</div>
                <div className="text-xs text-outline">Top Favorite Lang</div>
              </div>
            </div>

            <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 flex items-center gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <span className="material-symbols-outlined text-xl">visibility</span>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-on-surface">{totalFavoriteViews}</div>
                <div className="text-xs text-outline">Total Starred Views</div>
              </div>
            </div>
          </div>

          {/* Filter Toolbar */}
          <FilterToolbar viewMode={viewMode} setViewMode={setViewMode} />

          {/* Snippets List View */}
          <SnippetsTable viewMode={viewMode} />
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-80 border-l border-outline-variant/60 shrink-0 overflow-y-auto custom-scrollbar bg-surface-container-lowest p-5 space-y-6">
        <SnippetOverview />
        <RecentlyOpenedWidget />
        <LanguageRingWidget />
      </aside>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal />
    </div>
  );
};
