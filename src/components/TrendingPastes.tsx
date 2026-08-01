import React from 'react';
import { usePastes } from '../context/PasteContext';

export const TrendingPastes: React.FC = () => {
  const { pastes, setActiveSnippet, setIsEditorModalOpen, setActiveView } = usePastes();

  // Top 4 most-viewed public snippets
  const topItems = [...pastes]
    .filter(p => p.visibility === 'Public')
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 4);

  const handleOpen = (p: typeof pastes[0]) => {
    setActiveSnippet(p);
    setIsEditorModalOpen(true);
  };

  const formatViews = (v: number) =>
    v >= 1000 ? `${(v / 1000).toFixed(1)}K` : String(v);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-400">local_fire_department</span>
          <h2 className="text-lg font-bold text-on-surface">Trending Pastes</h2>
        </div>
        <button
          onClick={() => setActiveView('trending')}
          className="text-primary text-xs font-semibold flex items-center gap-1 hover:underline"
        >
          View trending <span className="material-symbols-outlined text-base">chevron_right</span>
        </button>
      </div>

      {topItems.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/60 shadow-sm animate-pulse">
              <div className="h-4 bg-surface-container-high rounded w-3/4 mb-3" />
              <div className="h-3 bg-surface-container-high rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => handleOpen(item)}
              className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/60 hover:border-primary/40 transition-all cursor-pointer group shadow-sm"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-surface-container-high w-6 h-6 flex items-center justify-center rounded text-[10px] font-mono font-bold text-primary shrink-0">
                  {idx + 1}
                </div>
                <div className="font-semibold text-sm leading-tight text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-medium border border-emerald-500/20">
                  {item.language}
                </span>
                <span className="text-[11px] font-mono text-outline flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">visibility</span>
                  {formatViews(item.views || 0)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
