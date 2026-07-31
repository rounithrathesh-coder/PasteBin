import React from 'react';

export const ApiDocsWidgets: React.FC = () => {
  const recentLogs = [
    { method: 'POST', endpoint: '/v1/pastes', status: 201, latency: '14ms', time: '2m ago' },
    { method: 'GET', endpoint: '/v1/pastes/pst-01', status: 200, latency: '8ms', time: '12m ago' },
    { method: 'GET', endpoint: '/v1/pastes', status: 200, latency: '22ms', time: '45m ago' },
    { method: 'DELETE', endpoint: '/v1/pastes/tr-05', status: 200, latency: '18ms', time: '2h ago' }
  ];

  return (
    <div className="space-y-6">
      {/* API Overview & Authentication */}
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">vpn_key</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">API Overview</h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            v1.4.0 Stable
          </span>
        </div>

        <div className="space-y-2 text-xs font-mono">
          <div className="text-outline">Base URL:</div>
          <div className="bg-surface-container-lowest p-2 rounded border border-outline-variant/50 text-purple-300 select-all font-bold">
            https://api.pastebin.dev/v1
          </div>

          <div className="text-outline pt-1">Authentication Header:</div>
          <div className="bg-surface-container-lowest p-2 rounded border border-outline-variant/50 text-on-surface text-[11px]">
            Authorization: Bearer pb_live_...
          </div>
        </div>
      </div>

      {/* Rate Limits & Quotas */}
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400 text-lg">speed</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">Rate Limits</h3>
          </div>
          <span className="text-[10px] font-mono text-outline">Production Tier</span>
        </div>

        <div className="space-y-2 font-mono text-xs">
          <div className="flex justify-between text-on-surface">
            <span>Requests / Minute:</span>
            <span className="font-bold text-primary">1,000 req/min</span>
          </div>
          <div className="flex justify-between text-on-surface">
            <span>Burst Limit:</span>
            <span className="font-bold text-emerald-400">100 req/sec</span>
          </div>
          <div className="flex justify-between text-on-surface">
            <span>Daily Quota:</span>
            <span className="font-bold text-amber-400">10,000 req/day</span>
          </div>
        </div>
      </div>

      {/* Recent API Activity */}
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">data_object</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">Recent API Activity</h3>
          </div>
        </div>

        <div className="space-y-2">
          {recentLogs.map((log, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-xs font-mono">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    log.method === 'GET'
                      ? 'bg-emerald-500/15 text-emerald-300'
                      : log.method === 'POST'
                      ? 'bg-blue-500/15 text-blue-300'
                      : 'bg-red-500/15 text-red-300'
                  }`}
                >
                  {log.method}
                </span>
                <span className="text-on-surface font-semibold truncate">{log.endpoint}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0 text-[10px] text-outline">
                <span className="text-emerald-400">{log.status}</span>
                <span>{log.latency}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
