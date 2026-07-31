import React from 'react';
import { usePastes } from '../context/PasteContext';

export const StatsGrid: React.FC = () => {
  const { pastes } = usePastes();

  const totalPastes = pastes.length;
  const publicCount = pastes.filter(p => p.visibility === 'Public').length;
  const publicPercent = totalPastes > 0 ? Math.round((publicCount / totalPastes) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Total Pastes */}
      <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/60 flex items-center gap-4 hover:border-outline-variant transition-all shadow-sm">
        <div className="w-11 h-11 rounded-xl bg-primary-container/20 border border-primary-container/30 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-primary text-xl">description</span>
        </div>
        <div>
          <div className="text-2xl font-bold font-mono tracking-tight text-on-surface">{totalPastes}</div>
          <div className="text-xs text-outline flex items-center gap-1 mt-0.5">
            Total Pastes
            <span className="text-emerald-400 font-semibold flex items-center text-[11px] bg-emerald-500/10 px-1.5 py-0.5 rounded">
              ↑ 12%
            </span>
          </div>
        </div>
      </div>

      {/* Shared Today */}
      <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/60 flex items-center gap-4 hover:border-outline-variant transition-all shadow-sm">
        <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-purple-400 text-xl">share</span>
        </div>
        <div>
          <div className="text-2xl font-bold font-mono tracking-tight text-on-surface">24</div>
          <div className="text-xs text-outline flex items-center gap-1 mt-0.5">
            Shared Today
            <span className="text-emerald-400 font-semibold flex items-center text-[11px] bg-emerald-500/10 px-1.5 py-0.5 rounded">
              ↑ 15%
            </span>
          </div>
        </div>
      </div>

      {/* Public Snippets */}
      <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/60 flex items-center gap-4 hover:border-outline-variant transition-all shadow-sm">
        <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-emerald-400 text-xl">public</span>
        </div>
        <div>
          <div className="text-2xl font-bold font-mono tracking-tight text-on-surface">{publicCount}</div>
          <div className="text-xs text-outline flex items-center gap-1 mt-0.5">
            Public Snippets
            <span className="text-outline font-mono text-[11px]">({publicPercent}% ratio)</span>
          </div>
        </div>
      </div>

      {/* API Uptime */}
      <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/60 flex items-center gap-4 hover:border-outline-variant transition-all shadow-sm">
        <div className="w-11 h-11 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-sky-400 text-xl">dns</span>
        </div>
        <div>
          <div className="text-2xl font-bold font-mono tracking-tight text-on-surface">99.98%</div>
          <div className="text-xs text-outline flex items-center gap-1.5 mt-0.5">
            API Uptime
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow"></span> Operational
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
