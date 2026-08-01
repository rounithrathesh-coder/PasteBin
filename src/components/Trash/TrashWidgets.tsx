import React from 'react';
import { usePastes } from '../../context/PasteContext';

export const ItemsInTrashWidget: React.FC = () => {
  const { trashedPastes } = usePastes();

  return (
    <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-5 space-y-4 shadow-sm text-center">
      {/* Trash Canvas Vector Illustration */}
      <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
        {/* Glowing backdrop */}
        <div className="absolute inset-0 rounded-full bg-purple-500/10 blur-xl"></div>
        {/* SVG Illustration */}
        <svg className="w-24 h-24 relative z-10 text-outline" viewBox="0 0 120 120" fill="none">
          {/* Paper floating into trash */}
          <path
            d="M75 25L90 15M85 20L95 28"
            stroke="#a78bfa"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="3 3"
          />
          <rect
            x="68"
            y="18"
            width="18"
            height="22"
            rx="3"
            transform="rotate(15 68 18)"
            fill="#2e2a4a"
            stroke="#7c3aed"
            strokeWidth="2"
          />
          <path d="M74 24H80M74 28H78" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
          
          {/* Wireframe Trash Can */}
          <rect x="35" y="42" width="50" height="8" rx="2" fill="#38305c" stroke="#6d28d9" strokeWidth="2" />
          <path
            d="M40 50L45 102C45.5 105.5 48.5 108 52 108H68C71.5 108 74.5 105.5 75 102L80 50"
            fill="#1e1b34"
            stroke="#6d28d9"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Vertical Rib Lines */}
          <line x1="48" y1="56" x2="50" y2="100" stroke="#4c1d95" strokeWidth="2" strokeLinecap="round" />
          <line x1="60" y1="56" x2="60" y2="100" stroke="#4c1d95" strokeWidth="2" strokeLinecap="round" />
          <line x1="72" y1="56" x2="70" y2="100" stroke="#4c1d95" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <div className="space-y-1">
        <h4 className="text-xs font-semibold text-outline uppercase tracking-wider">Items in Trash</h4>
        <div className="text-4xl font-extrabold text-on-surface tracking-tight">{trashedPastes.length}</div>
        <p className="text-xs text-outline font-medium">Total deleted snippets</p>
      </div>

      <p className="text-xs text-on-surface-variant/80 leading-relaxed max-w-xs mx-auto text-left">
        Items in trash are stored for 30 days after deletion. You can restore them anytime within this period.
      </p>

      {/* Auto-delete Countdown Box */}
      <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-3 flex items-center justify-center gap-2.5 text-xs text-on-surface font-mono">
        <span className="material-symbols-outlined text-purple-400 text-base animate-pulse">schedule</span>
        <span>Auto-delete in <strong className="text-purple-300 font-bold">25 days</strong></span>
      </div>
    </div>
  );
};

export const TrashActivityWidget: React.FC = () => {
  const { trashedPastes, setActiveView } = usePastes();
  const recentDeleted = trashedPastes.slice(0, 4);

  return (
    <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-3.5 shadow-sm">
      <div className="flex items-center justify-between border-b border-outline-variant/50 pb-3">
        <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-2">
          Trash Activity
        </h3>
        <button onClick={() => setActiveView('trash')} className="text-[11px] font-mono text-purple-400 hover:text-purple-300 hover:underline">
          View all
        </button>
      </div>

      <div className="space-y-3">
        {recentDeleted.length === 0 ? (
          <p className="text-xs text-outline text-center py-4 font-mono">No recent activity</p>
        ) : (
          recentDeleted.map((p) => (
            <div key={p.id} className="flex items-start gap-3 text-xs">
              <div className="w-7 h-7 rounded-lg bg-surface-container-high border border-outline-variant/50 flex items-center justify-center shrink-0 text-outline mt-0.5">
                <span className="material-symbols-outlined text-sm text-red-400">delete</span>
              </div>
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="text-on-surface font-medium truncate">
                  Deleted <span className="text-on-surface font-bold">"{p.title}"</span>
                </div>
                <div className="text-[10px] font-mono text-outline">{p.deletedAt || p.createdAt || 'recently'}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
