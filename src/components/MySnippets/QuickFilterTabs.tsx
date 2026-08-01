import React, { useState } from 'react';
import { usePastes } from '../../context/PasteContext';

export const QuickFilterTabs: React.FC = () => {
  const { pastes, filterVisibility, setFilterVisibility, addFolder } = usePastes();
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderName, setFolderName] = useState('');

  const counts = {
    All: pastes.length,
    Public: pastes.filter(p => p.visibility === 'Public').length,
    Private: pastes.filter(p => p.visibility === 'Private').length,
    Unlisted: pastes.filter(p => p.visibility === 'Unlisted').length
  };

  const tabs = [
    { key: 'All', label: 'All', count: counts.All, icon: 'apps' },
    { key: 'Public', label: 'Public', count: counts.Public, icon: 'public' },
    { key: 'Private', label: 'Private', count: counts.Private, icon: 'lock' },
    { key: 'Unlisted', label: 'Unlisted', count: counts.Unlisted, icon: 'link' }
  ];

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (folderName.trim()) {
      addFolder(folderName.trim());
      setFolderName('');
      setIsFolderModalOpen(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2 bg-surface-container-low p-1.5 rounded-xl border border-outline-variant/60">
        {tabs.map((t) => {
          const isActive = filterVisibility === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setFilterVisibility(t.key)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                isActive
                  ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                  : 'text-outline hover:text-on-surface hover:bg-surface-variant/40'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{t.icon}</span>
              <span>{t.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-white/20 text-white' : 'bg-surface-container-high text-outline'}`}>
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => setIsFolderModalOpen(true)}
        className="px-3.5 py-2 bg-surface-container-high/80 hover:bg-surface-container-high border border-outline-variant/60 rounded-xl text-xs font-semibold text-on-surface flex items-center gap-2 transition-all shadow-sm active:scale-95"
      >
        <span className="material-symbols-outlined text-base text-primary">create_new_folder</span>
        New Folder
      </button>

      {/* New Folder Modal */}
      {isFolderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-5 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-outline-variant/50 pb-3">
              <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400">folder</span> Create New Folder
              </h3>
              <button onClick={() => setIsFolderModalOpen(false)} className="text-outline hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateFolder} className="space-y-4">
              <div>
                <label className="block text-xs text-outline mb-1.5 font-mono">Folder Name</label>
                <input
                  type="text"
                  autoFocus
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="e.g. System Utilities..."
                  className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3.5 py-2 text-xs font-mono text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFolderModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-outline-variant/60 text-xs font-mono text-outline hover:text-on-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-primary-container text-on-primary-container text-xs font-semibold hover:brightness-110"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
