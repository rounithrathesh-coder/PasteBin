import React from 'react';
import { usePastes } from '../../context/PasteContext';

export const SnippetOverview: React.FC = () => {
  const { pastes } = usePastes();

  const total = pastes.length;
  const publicCount = pastes.filter((p) => p.visibility === 'Public').length;
  const privateCount = pastes.filter((p) => p.visibility === 'Private').length;
  const unlistedCount = pastes.filter((p) => p.visibility === 'Unlisted').length;
  const favoritesCount = pastes.filter((p) => p.isFavorite).length;

  return (
    <div className="bg-surface-container-low rounded-xl border border-outline-variant/60 p-4 space-y-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg">assessment</span>
          <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">Snippet Overview</h3>
        </div>
        <span className="text-[11px] font-mono text-amber-400 flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">star</span> {favoritesCount} Favs
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono">
        <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/40">
          <div className="text-xl font-bold text-on-surface">{total}</div>
          <div className="text-[10px] text-outline mt-0.5">Total Snippets</div>
        </div>

        <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/40">
          <div className="text-xl font-bold text-emerald-400">{publicCount}</div>
          <div className="text-[10px] text-outline mt-0.5">Public</div>
        </div>

        <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/40">
          <div className="text-xl font-bold text-amber-400">{privateCount}</div>
          <div className="text-[10px] text-outline mt-0.5">Private</div>
        </div>

        <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/40">
          <div className="text-xl font-bold text-purple-400">{unlistedCount}</div>
          <div className="text-[10px] text-outline mt-0.5">Unlisted</div>
        </div>
      </div>

      {/* Storage Progress Bar */}
      <div className="space-y-1.5 pt-1 border-t border-outline-variant/40">
        <div className="flex justify-between items-center text-[11px] font-mono">
          <span className="text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-primary">cloud</span> Storage Used
          </span>
          <span className="text-outline">2.34 GB / 10 GB (23%)</span>
        </div>
        <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
          <div className="bg-primary h-full w-[23%] rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
