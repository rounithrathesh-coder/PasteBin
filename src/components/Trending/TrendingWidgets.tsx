import React from 'react';

export const TrendingWidgets: React.FC = () => {
  const topContributors = [
    { name: 'dev_master', avatar: 'DM', count: '142 pastes', points: '2.8K stars' },
    { name: 'ui_developer', avatar: 'UI', count: '98 pastes', points: '1.9K stars' },
    { name: 'script_kid', avatar: 'SK', count: '87 pastes', points: '1.4K stars' },
    { name: 'data_guy', avatar: 'DG', count: '64 pastes', points: '1.1K stars' },
    { name: 'algo_expert', avatar: 'AE', count: '52 pastes', points: '980 stars' }
  ];

  const trendingLangs = [
    { name: 'Python', growth: '+34%', count: '412 pastes', color: 'bg-blue-400' },
    { name: 'TypeScript', growth: '+28%', count: '380 pastes', color: 'bg-indigo-400' },
    { name: 'JavaScript', growth: '+22%', count: '310 pastes', color: 'bg-yellow-400' },
    { name: 'Rust', growth: '+45%', count: '190 pastes', color: 'bg-orange-400' },
    { name: 'Go', growth: '+19%', count: '165 pastes', color: 'bg-cyan-400' }
  ];

  const trendingTags = [
    { name: '#react', count: '420' },
    { name: '#python', count: '380' },
    { name: '#docker', count: '290' },
    { name: '#fastapi', count: '210' },
    { name: '#postgresql', count: '185' },
    { name: '#nextjs', count: '170' },
    { name: '#algorithms', count: '145' },
    { name: '#kubernetes', count: '120' }
  ];

  return (
    <div className="space-y-6">
      {/* Featured Developer */}
      <div className="bg-gradient-to-br from-purple-950/40 via-surface-container-low to-surface-container-low border border-purple-500/30 rounded-xl p-4 space-y-3 shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-purple-500/20 pb-2.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-amber-400">workspace_premium</span> Developer of the Week
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-sm ring-2 ring-purple-500/40">
            DM
          </div>
          <div>
            <div className="text-xs font-bold text-on-surface flex items-center gap-1">
              dev_master
              <span className="material-symbols-outlined text-blue-400 text-xs">verified</span>
            </div>
            <div className="text-[10px] font-mono text-outline">Lead Systems Architect • 142 Pastes</div>
          </div>
        </div>
        <p className="text-xs text-on-surface-variant/80 line-clamp-2">
          Creator of popular Python DSA helper modules and FastAPI microservice templates.
        </p>
      </div>

      {/* Top Contributors */}
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-3.5 shadow-sm">
        <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400 text-lg">emoji_events</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">Top Contributors</h3>
          </div>
          <span className="text-[10px] font-mono text-outline">Ranked</span>
        </div>

        <div className="space-y-2.5">
          {topContributors.map((c, i) => (
            <div key={c.name} className="flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-mono font-bold text-outline w-3 text-center">{i + 1}</span>
                <div className="w-7 h-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                  {c.avatar}
                </div>
                <div>
                  <div className="text-xs font-bold text-on-surface flex items-center gap-1">
                    {c.name}
                    <span className="material-symbols-outlined text-blue-400 text-[13px]">verified</span>
                  </div>
                  <div className="text-[10px] font-mono text-outline">{c.count} • {c.points}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Languages */}
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">trending_up</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">Trending Languages</h3>
          </div>
        </div>

        <div className="space-y-2">
          {trendingLangs.map((lang) => (
            <div key={lang.name} className="flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-xs">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${lang.color}`}></span>
                <span className="font-bold text-on-surface">{lang.name}</span>
                <span className="text-[10px] font-mono text-outline">({lang.count})</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                {lang.growth}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Tags */}
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">tag</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">Trending Tags</h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {trendingTags.map((tag) => (
            <button
              key={tag.name}
              className="px-2.5 py-1 rounded-md bg-surface-container-highest/80 hover:bg-surface-container-highest border border-outline-variant/40 text-[11px] font-mono text-outline hover:text-on-surface transition-all flex items-center gap-1"
            >
              <span>{tag.name}</span>
              <span className="text-[9px] opacity-60">({tag.count})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
