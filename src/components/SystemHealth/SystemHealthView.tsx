import React from 'react';
import { SystemHealthWidgets } from './SystemHealthWidgets';

export const SystemHealthView: React.FC = () => {
  const containers = [
    { name: 'pastebin-api-v1', image: 'pastebin/api:1.4.2', port: '8080:8080', status: 'Running', cpu: '8.4%', ram: '240 MB', uptime: '14 days' },
    { name: 'postgres-db-main', image: 'postgres:15-alpine', port: '5432:5432', status: 'Running', cpu: '12.1%', ram: '890 MB', uptime: '28 days' },
    { name: 'redis-cache-cluster', image: 'redis:7-alpine', port: '6379:6379', status: 'Running', cpu: '2.8%', ram: '112 MB', uptime: '28 days' },
    { name: 'monaco-worker-pool', image: 'pastebin/worker:latest', port: '9000:9000', status: 'Running', cpu: '4.2%', ram: '320 MB', uptime: '7 days' }
  ];

  const systemLogs = [
    { level: 'INFO', service: 'api-gateway', msg: 'HTTP GET /v1/pastes 200 OK - 14ms', time: '10s ago' },
    { level: 'INFO', service: 'postgres-db', msg: 'Automatic checkpoint completed: 42MB written', time: '2m ago' },
    { level: 'OK', service: 'health-checker', msg: 'Ping successful for 12/12 active containers', time: '5m ago' },
    { level: 'WARN', service: 'redis-cache', msg: 'Memory usage reached 65% threshold - key LRU purge initiated', time: '12m ago' }
  ];

  return (
    <div className="flex flex-1 overflow-hidden">
      <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 space-y-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-1 border-b border-outline-variant/40 pb-5">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-on-surface flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-3xl">sensors</span>
              System Health &amp; Infrastructure
            </h1>
            <p className="text-sm text-on-surface-variant">
              Real-time DevOps monitoring for API gateways, databases, Docker containers, and system metrics.
            </p>
          </div>

          {/* Infrastructure Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
            <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-2 shadow-sm">
              <div className="flex justify-between items-center text-xs text-outline">
                <span>CPU Load</span>
                <span className="text-emerald-400 font-bold">24%</span>
              </div>
              <div className="text-2xl font-bold text-on-surface">2.40 GHz</div>
              <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full w-[24%] rounded-full"></div>
              </div>
              <div className="text-[10px] text-outline">4 Cores Active (Intel Xeon)</div>
            </div>

            <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-2 shadow-sm">
              <div className="flex justify-between items-center text-xs text-outline">
                <span>RAM Usage</span>
                <span className="text-purple-400 font-bold">47.5%</span>
              </div>
              <div className="text-2xl font-bold text-on-surface">3.8 / 8 GB</div>
              <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full w-[47.5%] rounded-full"></div>
              </div>
              <div className="text-[10px] text-outline">4.2 GB Free</div>
            </div>

            <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-2 shadow-sm">
              <div className="flex justify-between items-center text-xs text-outline">
                <span>Disk Storage</span>
                <span className="text-sky-400 font-bold">23.4%</span>
              </div>
              <div className="text-2xl font-bold text-on-surface">2.34 / 10 GB</div>
              <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                <div className="bg-sky-400 h-full w-[23.4%] rounded-full"></div>
              </div>
              <div className="text-[10px] text-outline">NVMe SSD Storage</div>
            </div>

            <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-2 shadow-sm">
              <div className="flex justify-between items-center text-xs text-outline">
                <span>Network I/O</span>
                <span className="text-amber-400 font-bold">14 ms</span>
              </div>
              <div className="text-2xl font-bold text-on-surface">1.2 / 3.4 MB/s</div>
              <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full w-[35%] rounded-full"></div>
              </div>
              <div className="text-[10px] text-outline">Inbound / Outbound</div>
            </div>
          </div>

          {/* Running Containers Table */}
          <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between border-b border-outline-variant/50 pb-3">
              <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">deployed_code</span>
                Running Docker Containers (4/4)
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Docker Engine 24.0.5
              </span>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-outline-variant/40 text-[10px] text-outline uppercase tracking-wider">
                    <th className="py-2.5 px-3">Container Name</th>
                    <th className="py-2.5 px-3">Image</th>
                    <th className="py-2.5 px-3">Port</th>
                    <th className="py-2.5 px-3">CPU</th>
                    <th className="py-2.5 px-3">RAM</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {containers.map((c) => (
                    <tr key={c.name} className="hover:bg-surface-container-high/40 transition-colors">
                      <td className="py-3 px-3 font-bold text-on-surface flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        {c.name}
                      </td>
                      <td className="py-3 px-3 text-purple-300">{c.image}</td>
                      <td className="py-3 px-3 text-outline">{c.port}</td>
                      <td className="py-3 px-3 text-emerald-400 font-bold">{c.cpu}</td>
                      <td className="py-3 px-3 text-on-surface">{c.ram}</td>
                      <td className="py-3 px-3 text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                          {c.status} ({c.uptime})
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* System Logs & Incident Stream */}
          <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between border-b border-outline-variant/50 pb-3">
              <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-400 text-base">terminal</span>
                Live Infrastructure Logs
              </h3>
              <span className="text-[10px] font-mono text-outline">Auto-refreshing</span>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-3 space-y-2 font-mono text-xs max-h-48 overflow-y-auto custom-scrollbar">
              {systemLogs.map((log, i) => (
                <div key={i} className="flex items-start justify-between gap-3 text-[11px]">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                        log.level === 'WARN'
                          ? 'bg-amber-500/20 text-amber-300'
                          : log.level === 'OK'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      {log.level}
                    </span>
                    <span className="text-purple-300 font-bold shrink-0">[{log.service}]</span>
                    <span className="text-on-surface-variant truncate">{log.msg}</span>
                  </div>
                  <span className="text-outline shrink-0 text-[10px]">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Right Sidebar Widgets */}
      <aside className="w-80 border-l border-outline-variant/60 shrink-0 overflow-y-auto custom-scrollbar bg-surface-container-lowest p-5 space-y-6">
        <SystemHealthWidgets />
      </aside>
    </div>
  );
};
