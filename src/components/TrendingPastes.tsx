import React from 'react';

export const TrendingPastes: React.FC = () => {
  const items = [
    { rank: 1, title: 'Linux Command Cheatsheet', lang: 'Bash', views: '2.3K' },
    { rank: 2, title: 'React useState Hook Example', lang: 'JS', views: '1.8K' },
    { rank: 3, title: 'Dockerfile for Node App', lang: 'Docker', views: '1.5K' },
    { rank: 4, title: 'Top 50 SQL Interview Questions', lang: 'SQL', views: '1.2K' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-400">local_fire_department</span>
          <h2 className="text-lg font-bold text-on-surface">Trending Pastes</h2>
        </div>
        <a className="text-primary text-xs font-semibold flex items-center gap-1 hover:underline" href="#">
          View trending <span className="material-symbols-outlined text-base">chevron_right</span>
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.rank}
            className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/60 hover:border-primary/40 transition-all cursor-pointer group shadow-sm"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="bg-surface-container-high w-6 h-6 flex items-center justify-center rounded text-[10px] font-mono font-bold text-primary">
                {item.rank}
              </div>
              <div className="font-semibold text-sm leading-tight text-on-surface group-hover:text-primary transition-colors">
                {item.title}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-medium border border-emerald-500/20">
                {item.lang}
              </span>
              <span className="text-[11px] font-mono text-outline flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">visibility</span> {item.views}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
