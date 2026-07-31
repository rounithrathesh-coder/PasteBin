import React from 'react';

export const SystemHealthWidgets: React.FC = () => {
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
            99.99% Uptime
          </span>
        </div>

        <div className="space-y-2 text-xs font-mono">
          <div className="flex justify-between text-on-surface">
            <span>Overall Health:</span>
            <span className="font-bold text-emerald-400">All Systems Operational</span>
          </div>
          <div className="flex justify-between text-on-surface">
            <span>Active Incidents:</span>
            <span className="font-bold text-outline">0 Critical / 0 Degraded</span>
          </div>
          <div className="flex justify-between text-on-surface">
            <span>Average Latency:</span>
            <span className="font-bold text-purple-300">14 ms</span>
          </div>
        </div>
      </div>

      {/* Backup & Version Status */}
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">backup</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">Automated Backup</h3>
          </div>
        </div>

        <div className="space-y-2 text-xs font-mono">
          <div className="flex justify-between text-on-surface">
            <span>Last Backup:</span>
            <span className="text-purple-300 font-bold">2 hours ago</span>
          </div>
          <div className="flex justify-between text-on-surface">
            <span>Schedule:</span>
            <span className="text-outline">Daily at 02:00 UTC</span>
          </div>
          <div className="flex justify-between text-on-surface">
            <span>Snapshot Size:</span>
            <span className="text-outline">1.82 GB (AES-256)</span>
          </div>
        </div>
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
            <span>Cluster Version:</span>
            <span className="font-bold text-on-surface">v1.4.2-prod</span>
          </div>
          <div className="flex justify-between text-on-surface">
            <span>Build Hash:</span>
            <span className="text-purple-300 font-bold">#8f3a2b1</span>
          </div>
          <div className="flex justify-between text-on-surface">
            <span>Orchestrator:</span>
            <span className="text-outline">Docker Swarm / K8s</span>
          </div>
        </div>
      </div>
    </div>
  );
};
