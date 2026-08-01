import React, { useEffect, useState } from 'react';
import { usePastes } from '../context/PasteContext';

interface HealthData {
  status: string;
  version: string;
  uptime: string;
  latencyMs: number;
  storage: {
    used: string;
    limit: string;
    percent: number;
    display: string;
  };
  deployment: {
    version: string;
    status: string;
    commit: string;
    deployedAt: string;
  };
  containers: Array<{
    name: string;
    status: string;
    cpu: string;
    ram: string;
    uptime: string;
  }>;
  integrations: {
    openRouter: string;
    huggingFace: string;
    supabase: string;
    turnstile: string;
    cloudflareR2: string;
  };
}

export const SystemStatusPanel: React.FC = () => {
  const { pastes } = usePastes();
  const [health, setHealth] = useState<HealthData | null>(null);

  useEffect(() => {
    const load = () => {
      fetch('/api/health')
        .then(r => r.json())
        .then(data => setHealth(data))
        .catch(() => {});
    };
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  const runningContainers = health?.containers?.filter(c => c.status === 'Running').length ?? 0;
  const totalContainers = health?.containers?.length ?? 0;
  const storagePercent = health?.storage?.percent ?? 0;
  const storageDisplay = health?.storage?.display ?? '—';
  const dbStatus = health?.integrations?.supabase?.includes('Configured') ? 'Supabase Connected' : 'JSON Store Connected';

  // Relative time from ISO string
  const relativeTime = (iso: string) => {
    try {
      const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
      if (diff < 60) return `${diff}s ago`;
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      return `${Math.floor(diff / 3600)}h ago`;
    } catch {
      return 'recently';
    }
  };

  return (
    <div className="bg-surface-container-low rounded-xl border border-outline-variant/60 p-4 space-y-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-outline-variant/50 pb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-400 text-lg">sensors</span>
          <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">System Status</h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow"></span>
          {health?.status || 'Checking...'}
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
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            {health ? 'Healthy' : 'Connecting...'}
          </span>
        </div>

        {/* Database */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-base text-sky-400">database</span>
            <span>Database</span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            {dbStatus}
          </span>
        </div>

        {/* Containers */}
        {totalContainers > 0 && (
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-base text-blue-400">deployed_code</span>
              <span>Containers</span>
            </div>
            <span className="text-[11px] font-mono font-semibold text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              {runningContainers}/{totalContainers} Running
            </span>
          </div>
        )}

        {/* Pastes Count */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-base text-purple-400">description</span>
            <span>Total Pastes</span>
          </div>
          <span className="text-[11px] font-mono font-semibold text-on-surface-variant">
            {pastes.length} active
          </span>
        </div>

        {/* Storage Usage */}
        {health?.storage && (
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-on-surface-variant text-[11px]">Storage Usage</span>
              <span className="text-[11px] font-mono text-outline">{storageDisplay} ({storagePercent}%)</span>
            </div>
            <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(storagePercent, 1)}%` }}
              />
            </div>
          </div>
        )}

        {/* Recent Deployment */}
        {health?.deployment && (
          <div className="border-t border-outline-variant/40 pt-3 space-y-1.5">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-outline">Recent Deployment</span>
              <span className="text-emerald-400 font-mono font-semibold text-[10px]">
                v{health.deployment.version} • {health.deployment.status}
              </span>
            </div>
            <div className="text-[10px] font-mono text-outline flex items-center justify-between">
              <span>Commit {health.deployment.commit}</span>
              <span>{relativeTime(health.deployment.deployedAt)}</span>
            </div>
          </div>
        )}

        {/* Uptime */}
        <div className="flex items-center justify-between text-[11px] text-outline border-t border-outline-variant/40 pt-2.5">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">timer</span> Server Uptime
          </span>
          <span className="font-mono text-[10px]">{health?.uptime ?? '—'}</span>
        </div>
      </div>
    </div>
  );
};
