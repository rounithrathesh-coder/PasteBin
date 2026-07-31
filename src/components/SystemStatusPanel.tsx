import React from 'react';

export const SystemStatusPanel: React.FC = () => {
  return (
    <div className="bg-surface-container-low rounded-xl border border-outline-variant/60 p-4 space-y-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-outline-variant/50 pb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-400 text-lg">sensors</span>
          <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">System Status</h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow"></span> All Operational
        </span>
      </div>

      <div className="space-y-3">
        {/* API Status */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-base text-primary">api</span>
            <span>API Status</span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Healthy
          </span>
        </div>

        {/* PostgreSQL */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-base text-sky-400">database</span>
            <span>PostgreSQL</span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Connected
          </span>
        </div>

        {/* Docker Containers */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-base text-blue-400">deployed_code</span>
            <span>Docker Containers</span>
          </div>
          <span className="text-[11px] font-mono font-semibold text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> 8/8 Running
          </span>
        </div>

        {/* Storage Usage */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-on-surface-variant text-[11px]">Storage Usage</span>
            <span className="text-[11px] font-mono text-outline">2.34 GB / 10 GB (23%)</span>
          </div>
          <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-[23%] rounded-full"></div>
          </div>
        </div>

        {/* Recent Deployments */}
        <div className="border-t border-outline-variant/40 pt-3 space-y-1.5">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-outline">Recent Deployment</span>
            <span className="text-emerald-400 font-mono font-semibold text-[10px]">v1.0.4 • Success</span>
          </div>
          <div className="text-[10px] font-mono text-outline flex items-center justify-between">
            <span>Commit 8a1514e</span>
            <span>12m ago</span>
          </div>
        </div>

        {/* Last Backup Time */}
        <div className="flex items-center justify-between text-[11px] text-outline border-t border-outline-variant/40 pt-2.5">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">backup</span> Last Backup
          </span>
          <span className="font-mono text-[10px]">2 hours ago (Auto)</span>
        </div>
      </div>
    </div>
  );
};
