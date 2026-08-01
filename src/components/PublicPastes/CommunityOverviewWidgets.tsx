import React, { useState } from 'react';
import { usePastes } from '../../context/PasteContext';

export const CommunityOverviewWidgets: React.FC = () => {
  const { setActiveSnippet, setIsEditorModalOpen, showToast } = usePastes();
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [followedContributors, setFollowedContributors] = useState<string[]>([]);

  const popularLangs = [
    { name: 'Python', percent: '28%', color: 'bg-blue-500', count: '312' },
    { name: 'JavaScript', percent: '24%', color: 'bg-yellow-400', count: '284' },
    { name: 'HTML', percent: '16%', color: 'bg-orange-400', count: '198' },
    { name: 'SQL', percent: '12%', color: 'bg-sky-400', count: '156' },
    { name: 'C++', percent: '8%', color: 'bg-purple-500', count: '98' },
    { name: 'Other', percent: '12%', color: 'bg-slate-400', count: '200' }
  ];

  const topContributors = [
    { name: 'dev_master', avatar: 'DM', count: '142 pastes', verified: true, color: 'bg-purple-500/20 text-purple-300' },
    { name: 'ui_developer', avatar: 'UI', count: '98 pastes', verified: true, color: 'bg-orange-500/20 text-orange-300' },
    { name: 'script_kid', avatar: 'SK', count: '87 pastes', verified: true, color: 'bg-yellow-500/20 text-yellow-300' },
    { name: 'data_guy', avatar: 'DG', count: '64 pastes', verified: true, color: 'bg-sky-500/20 text-sky-300' },
    { name: 'algo_expert', avatar: 'AE', count: '52 pastes', verified: true, color: 'bg-emerald-500/20 text-emerald-300' }
  ];

  const trendingCollections = [
    { name: 'React', icon: 'code_blocks', count: '340 pastes', badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
    { name: 'Machine Learning', icon: 'psychology', count: '215 pastes', badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    { name: 'Docker', icon: 'deployed_code', count: '180 pastes', badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    { name: 'Algorithms', icon: 'account_tree', count: '290 pastes', badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    { name: 'SQL', icon: 'database', count: '165 pastes', badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20' }
  ];

  return (
    <div className="space-y-6">
      {/* 1. Community Overview Widget */}
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">groups</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">Community Overview</h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Live
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 font-mono">
          <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/40 hover:border-primary/40 transition-colors">
            <div className="text-xl font-bold text-on-surface">18.7K</div>
            <div className="text-[10px] text-outline mt-0.5">Total Public Pastes</div>
          </div>

          <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/40 hover:border-emerald-500/40 transition-colors">
            <div className="text-xl font-bold text-emerald-400">1.2K</div>
            <div className="text-[10px] text-outline mt-0.5">Snippets Shared Today</div>
          </div>

          <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/40 hover:border-amber-500/40 transition-colors">
            <div className="text-xl font-bold text-amber-400">542</div>
            <div className="text-[10px] text-outline mt-0.5">Active Developers</div>
          </div>

          <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/40 hover:border-purple-500/40 transition-colors">
            <div className="text-xl font-bold text-purple-400">42</div>
            <div className="text-[10px] text-outline mt-0.5">Languages Supported</div>
          </div>
        </div>
      </div>

      {/* 2. Featured Snippet of the Week Card */}
      <div className="bg-gradient-to-br from-purple-950/40 via-surface-container-low to-surface-container-low border border-purple-500/30 rounded-xl p-4 space-y-3.5 shadow-md relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between border-b border-purple-500/20 pb-2.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-amber-400">star</span> Featured Snippet
          </span>
          <span className="text-[10px] font-mono text-outline">Week #31</span>
        </div>

        <div className="space-y-1.5">
          <h4 className="text-sm font-bold text-on-surface group-hover:text-purple-300 transition-colors line-clamp-1">
            JWT Auth &amp; Refresh Token Pattern
          </h4>
          <p className="text-xs text-on-surface-variant/80 line-clamp-2 leading-relaxed">
            Production-grade authentication workflow with auto-rotation refresh tokens and Express middleware.
          </p>
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-outline pt-1">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-[10px]">
              AD
            </div>
            <span className="text-on-surface font-medium text-[11px]">alex_dev</span>
            <span className="material-symbols-outlined text-blue-400 text-xs" title="Verified Author">verified</span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 text-outline"><span className="material-symbols-outlined text-xs">visibility</span> 12.4K</span>
            <span className="flex items-center gap-1 text-red-400"><span className="material-symbols-outlined text-xs">favorite</span> 842</span>
          </div>
        </div>

        <button
          onClick={() => {
            setActiveSnippet({
              id: 'featured-01',
              title: 'JWT Auth & Refresh Token Pattern',
              description: 'Production-grade authentication workflow with auto-rotation refresh tokens',
              code: `const jwt = require('jsonwebtoken');\n\n// Access & Refresh token generator\nfunction generateTokens(user) {\n  const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_SECRET, { expiresIn: '15m' });\n  const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_SECRET, { expiresIn: '7d' });\n  return { accessToken, refreshToken };\n}`,
              language: 'TypeScript',
              visibility: 'Public',
              views: 12400,
              lines: 34,
              fileSize: '2.4 KB',
              author: 'alex_dev',
              createdAt: '1 day ago',
              isFavorite: true
            });
            setIsEditorModalOpen(true);
          }}
          className="w-full py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/40 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
        >
          <span className="material-symbols-outlined text-sm">open_in_new</span> Open Snippet
        </button>
      </div>

      {/* 3. Popular Languages with Hover Tooltips */}
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">pie_chart</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">Popular Languages</h3>
          </div>
          <span className="text-[10px] font-mono text-outline">Community Usage</span>
        </div>

        <div className="grid grid-cols-12 gap-3 items-center">
          {/* Donut SVG */}
          <div className="col-span-5 flex justify-center py-1 relative">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#2f3445" strokeWidth="4" />
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="28 72" strokeDashoffset="0" />
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#facc15" strokeWidth="4" strokeDasharray="24 76" strokeDashoffset="-28" />
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#fb923c" strokeWidth="4" strokeDasharray="16 84" strokeDashoffset="-52" />
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#38bdf8" strokeWidth="4" strokeDasharray="12 88" strokeDashoffset="-68" />
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#a855f7" strokeWidth="4" strokeDasharray="8 92" strokeDashoffset="-80" />
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#94a3b8" strokeWidth="4" strokeDasharray="12 88" strokeDashoffset="-88" />
            </svg>
          </div>

          {/* List with Tooltips */}
          <div className="col-span-7 space-y-1.5 font-mono text-[11px]">
            {popularLangs.map((l) => (
              <div
                key={l.name}
                onMouseEnter={() => setActiveTooltip(l.name)}
                onMouseLeave={() => setActiveTooltip(null)}
                className="relative flex items-center justify-between p-1 rounded hover:bg-surface-container-high/60 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 text-on-surface-variant group-hover:text-on-surface">
                  <span className={`w-2 h-2 rounded-full ${l.color}`}></span>
                  <span>{l.name}</span>
                </div>
                <span className="text-on-surface font-semibold">{l.percent}</span>

                {/* Hover Tooltip */}
                {activeTooltip === l.name && (
                  <div className="absolute right-0 -top-8 z-20 bg-surface-container-highest border border-outline-variant text-on-surface px-2.5 py-1 rounded text-[10px] font-mono shadow-xl whitespace-nowrap animate-fade-in pointer-events-none">
                    {l.count} public snippets
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Top Contributors Widget */}
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-3.5 shadow-sm">
        <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400 text-lg">emoji_events</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">Top Contributors</h3>
          </div>
          <span className="text-[10px] font-mono text-outline">This Month</span>
        </div>

        <div className="space-y-2.5">
          {topContributors.map((c, i) => (
            <div key={c.name} className="flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-mono font-bold text-outline w-3 text-center">{i + 1}</span>
                <div className={`w-7 h-7 rounded-lg ${c.color} flex items-center justify-center font-bold text-xs shrink-0`}>
                  {c.avatar}
                </div>
                <div>
                  <div className="text-xs font-bold text-on-surface flex items-center gap-1">
                    {c.name}
                    {c.verified && <span className="material-symbols-outlined text-blue-400 text-[13px]">verified</span>}
                  </div>
                  <div className="text-[10px] font-mono text-outline">{c.count}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  const isFollowing = followedContributors.includes(c.name);
                  setFollowedContributors((current) => isFollowing ? current.filter((name) => name !== c.name) : [...current, c.name]);
                  showToast(isFollowing ? `Unfollowed ${c.name}` : `Following ${c.name}`);
                }}
                className="p-1 rounded text-outline hover:text-purple-400 hover:bg-surface-variant/40 transition-colors"
                title={followedContributors.includes(c.name) ? `Unfollow ${c.name}` : `Follow ${c.name}`}
              >
                <span className="material-symbols-outlined text-base">{followedContributors.includes(c.name) ? 'person_remove' : 'person_add'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Trending Collections Section */}
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">collections_bookmark</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">Trending Collections</h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {trendingCollections.map((col) => (
            <button
              key={col.name}
              onClick={() => showToast(`${col.name} collection selected.`)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all hover:scale-105 active:scale-95 ${col.badgeColor}`}
            >
              <span className="material-symbols-outlined text-sm">{col.icon}</span>
              <span>{col.name}</span>
              <span className="opacity-60 text-[10px]">({col.count.split(' ')[0]})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
