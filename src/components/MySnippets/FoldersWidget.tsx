import React, { useState } from 'react';
import { usePastes } from '../../context/PasteContext';

export const FoldersWidget: React.FC = () => {
  const { folders, addFolder, filterFolder, setFilterFolder } = usePastes();
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addFolder(name.trim());
      setName('');
      setIsAdding(false);
    }
  };

  const getFolderIconColor = (color: string) => {
    switch (color) {
      case 'amber':
        return 'text-amber-400';
      case 'orange':
        return 'text-orange-400';
      case 'blue':
        return 'text-sky-400';
      case 'purple':
        return 'text-purple-400';
      case 'emerald':
        return 'text-emerald-400';
      default:
        return 'text-primary';
    }
  };

  return (
    <div className="bg-surface-container-low rounded-xl border border-outline-variant/60 p-4 space-y-3.5 shadow-sm">
      <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-400 text-lg">folder</span>
          <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">Folders Overview</h3>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-1 hover:bg-surface-variant/60 rounded text-outline hover:text-on-surface transition-colors"
          title="Add Folder"
        >
          <span className="material-symbols-outlined text-lg">add</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Folder name..."
            className="flex-1 bg-surface-container-lowest border border-outline-variant/60 rounded px-2.5 py-1 text-xs font-mono text-on-surface focus:outline-none focus:border-primary"
          />
          <button type="submit" className="px-2.5 py-1 bg-primary-container text-on-primary-container text-xs rounded font-semibold">
            Save
          </button>
        </form>
      )}

      <div className="space-y-1">
        <button
          onClick={() => setFilterFolder('All')}
          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-mono transition-all text-left ${
            filterFolder === 'All'
              ? 'bg-primary/15 text-primary font-bold border border-primary/30'
              : 'text-on-surface-variant hover:bg-surface-variant/40'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base">folder_open</span>
            <span>All Folders</span>
          </div>
          <span className="text-outline text-[10px]">All</span>
        </button>

        {folders.map((f) => {
          const isActive = filterFolder === f.name;
          return (
            <div
              key={f.id}
              onClick={() => setFilterFolder(f.name)}
              className={`group w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer select-none ${
                isActive
                  ? 'bg-primary/15 text-primary font-bold border border-primary/30'
                  : 'text-on-surface-variant hover:bg-surface-variant/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-outline/40 group-hover:text-outline text-sm cursor-grab">
                  drag_indicator
                </span>
                <span className={`material-symbols-outlined text-base ${getFolderIconColor(f.color)}`}>
                  folder
                </span>
                <span>{f.name}</span>
              </div>
              <span className="text-outline text-[10px] bg-surface-container-high px-2 py-0.5 rounded-full font-semibold">
                {f.count}
              </span>
            </div>
          );
        })}
      </div>

      <div className="pt-2 border-t border-outline-variant/40 text-center">
        <button
          onClick={() => setFilterFolder('All')}
          className="text-primary text-[11px] font-mono font-semibold hover:underline flex items-center justify-center gap-1 w-full"
        >
          View all folders <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
