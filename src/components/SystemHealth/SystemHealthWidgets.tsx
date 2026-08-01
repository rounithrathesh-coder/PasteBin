import React, { useEffect, useState } from 'react';

interface HealthInfo {
  status: string;
  version: string;
  uptime: string;
  latencyMs: number;
  storage: { display: string; percent: number };
  deployment: { commit: string; deployedAt: string };
}

export const SystemHealthWidgets: React.FC = () => {
  const [health, setHealth] = useState<HealthInfo | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then(r => r.json())
      .then(data => setHealth(data))
      .catch(() => {});
  }, []);

  const relativeTime = (iso: string) => {
    try {
      const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
      if (diff < 60) return `${diff}s ago`;
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      return `${Math.floor(diff / 3600)}h ago`;
    } catch { return 'recently'; }
  };

  return (
    <div className="space-y-6">
      {/* Overall Health Card */}
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-3.5 shadow-sm">
        <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-400 text-lg">verified_user</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">System Status</h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            {health ? `Up ${health.uptime}` : 'Checking...'}
          </span>
        </div>

        <div className="space-y-2 text-xs font-mono">
          <div className="flex justify-between text-on-surface">
            <span>Overall Health:</span>
            <span className={`font-bold ${health?.status === 'Healthy' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {health?.status ?? '...'}
            </span>
          </div>
          <div className="flex justify-between text-on-surface">
            <span>Active Incidents:</span>
            <span className="font-bold text-outline">0 Critical / 0 Degraded</span>
          </div>
          <div className="flex justify-between text-on-surface">
            <span>Average Latency:</span>
            <span className="font-bold text-purple-300">
              {health ? `${health.latencyMs} ms` : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Backup & Storage */}
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">backup</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">Storage & Backup</h3>
          </div>
        </div>

        <div className="space-y-2 text-xs font-mono">
          <div className="flex justify-between text-on-surface">
            <span>Storage:</span>
            <span className="text-purple-300 font-bold">{health?.storage?.display ?? '—'}</span>
          </div>
          <div className="flex justify-between text-on-surface">
            <span>Backup Schedule:</span>
            <span className="text-outline">Daily at 02:00 UTC</span>
          </div>
          <div className="flex justify-between text-on-surface">
            <span>Last Deployment:</span>
            <span className="text-outline">
              {health?.deployment?.deployedAt ? relativeTime(health.deployment.deployedAt) : '—'}
            </span>
          </div>
        </div>

        {health?.storage && (
          <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(health.storage.percent, 1)}%` }}
            />
          </div>
        )}
      </div>

      {/* Active Version Info */}
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">memory</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">Environment</h3>
          </div>
        </div>

        <div className="space-y-2 text-xs font-mono">
          <div className="flex justify-between text-on-surface">
            <span>API Version:</span>
            <span className="font-bold text-on-surface">v{health?.version ?? '...'}</span>
          </div>
          <div className="flex justify-between text-on-surface">
            <span>Commit Hash:</span>
            <span className="text-purple-300 font-bold">
              #{health?.deployment?.commit ?? '...'}
            </span>
          </div>
          <div className="flex justify-between text-on-surface">
            <span>Runtime:</span>
            <span className="text-outline">Node.js + Express</span>
          </div>
        </div>
      </div>
    </div>
  );
};
