import React from 'react';
import { usePastes } from '../../context/PasteContext';

export const FavoritesWidget: React.FC = () => {
  const { pastes, setActiveSnippet, setIsEditorModalOpen, toggleFavorite } = usePastes();

  const favoritePastes = pastes.filter((p) => p.isFavorite);

  return (
    <div className="bg-surface-container-low rounded-xl border border-outline-variant/60 p-4 space-y-3.5 shadow-sm">
      <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
            star
          </span>
          <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">Favorite Snippets</h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 font-semibold border border-amber-400/20">
          {favoritePastes.length} Starred
        </span>
      </div>

      {favoritePastes.length === 0 ? (
        <div className="text-center py-4 space-y-1">
          <p className="text-xs text-outline font-mono">No starred snippets</p>
          <p className="text-[10px] text-outline/60">Click the star icon on any paste to favorite it.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {favoritePastes.slice(0, 4).map((p) => (
            <div
              key={p.id}
              onClick={() => {
                setActiveSnippet(p);
                setIsEditorModalOpen(true);
              }}
              className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/40 hover:border-amber-400/40 hover:bg-surface-container-high/40 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <span className="material-symbols-outlined text-amber-400 text-base shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <div className="truncate">
                  <div className="text-xs font-bold text-on-surface group-hover:text-amber-400 transition-colors truncate">
                    {p.title}
                  </div>
                  <div className="text-[10px] font-mono text-outline">
                    {p.language} • {p.folder || 'Utils'}
                  </div>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(p.id);
                }}
                className="text-outline hover:text-amber-400 p-1 rounded hover:bg-surface-variant/60 transition-colors"
                title="Remove from favorites"
              >
                <span className="material-symbols-outlined text-sm">star_half</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
