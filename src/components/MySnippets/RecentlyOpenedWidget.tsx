import React from 'react';
import { usePastes } from '../../context/PasteContext';

export const RecentlyOpenedWidget: React.FC = () => {
  const { pastes, setActiveSnippet, setIsEditorModalOpen } = usePastes();

  const recent = pastes.slice(0, 3);

  return (
    <div className="bg-surface-container-low rounded-xl border border-outline-variant/60 p-4 space-y-3 shadow-sm">
      <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg">history_toggle_off</span>
          <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">Recently Opened</h3>
        </div>
        <span className="text-[10px] font-mono text-outline">Quick Resume</span>
      </div>

      <div className="space-y-2">
        {recent.map((p) => (
          <div
            key={p.id}
            onClick={() => {
              setActiveSnippet(p);
              setIsEditorModalOpen(true);
            }}
            className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/40 hover:border-primary/50 hover:bg-surface-container-high/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <span className="material-symbols-outlined text-primary text-base group-hover:scale-110 transition-transform">
                code
              </span>
              <div className="truncate">
                <div className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                  {p.title}
                </div>
                <div className="text-[10px] font-mono text-outline">
                  {p.language} • {p.lastOpened || 'recently'}
                </div>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline group-hover:text-on-surface text-base">
              open_in_new
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
