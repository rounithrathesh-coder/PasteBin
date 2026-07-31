import React from 'react';

export const IntegrationsWidgets: React.FC = () => {
  const connectedApps = [
    { name: 'GitHub Gists', status: 'Active', icon: 'code', time: 'Synced 10m ago' },
    { name: 'VS Code Extension', status: 'Active', icon: 'terminal', time: 'Active now' },
    { name: 'Slack Workspace', status: 'Active', icon: 'chat', time: 'Alert 1h ago' },
    { name: 'Docker CLI Engine', status: 'Active', icon: 'deployed_code', time: 'Sync 3h ago' }
  ];

  const recentActivity = [
    { text: 'Gist "Quick sort in Python" synced to GitHub', time: '10 mins ago', type: 'github' },
    { text: 'Slack notification dispatched to #dev-pastes', time: '1 hour ago', type: 'slack' },
    { text: 'VS Code extension authenticated via OAuth', time: '3 hours ago', type: 'vscode' },
    { text: 'Webhook payload delivered (200 OK)', time: '5 hours ago', type: 'webhook' }
  ];

  return (
    <div className="space-y-6">
      {/* Connected Apps Summary */}
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-3.5 shadow-sm">
        <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-400 text-lg">check_circle</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">Connected Apps</h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            4 Active
          </span>
        </div>

        <div className="space-y-2">
          {connectedApps.map((app) => (
            <div key={app.name} className="flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-primary text-base shrink-0">{app.icon}</span>
                <div className="min-w-0">
                  <div className="font-bold text-on-surface truncate">{app.name}</div>
                  <div className="text-[10px] font-mono text-outline">{app.time}</div>
                </div>
              </div>

              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Active"></span>
            </div>
          ))}
        </div>
      </div>

      {/* Connection History & Activity Log */}
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-3.5 shadow-sm">
        <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">history</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">Connection History</h3>
          </div>
        </div>

        <div className="space-y-2.5 text-xs font-mono">
          {recentActivity.map((act, i) => (
            <div key={i} className="space-y-0.5 border-b border-outline-variant/30 pb-2 last:border-none">
              <div className="text-on-surface-variant font-medium leading-tight">{act.text}</div>
              <div className="text-[10px] text-outline">{act.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
