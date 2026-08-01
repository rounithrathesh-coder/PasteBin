import React, { useEffect, useState } from 'react';
import { SystemHealthWidgets } from './SystemHealthWidgets';

interface Container {
  name: string;
  image: string;
  port: string;
  status: string;
  cpu: string;
  ram: string;
  uptime: string;
}

interface LogEntry {
  level: string;
  service: string;
  msg: string;
  time: string;
}

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
  containers: Container[];
  logs: LogEntry[];
  integrations: Record<string, string>;
}

export const SystemHealthView: React.FC = () => {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetch('/api/health').then(r => r.json());
        setHealth(data);
      } catch (err) {
        console.warn('[SystemHealth] API fetch failed:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  const containers = health?.containers ?? [];
  const logs = health?.logs ?? [];
  const runningCount = containers.filter(c => c.status === 'Running').length;

  const storagePercent = health?.storage?.percent ?? 0;
  const storagePct = `${storagePercent}%`;
  const storageDisplay = health?.storage?.display ?? '—';

  // Compute "metrics" from real health API data
  const latencyMs = health?.latencyMs ?? 0;
  const latencyPct = Math.min(100, latencyMs);

  return (
    <div className="flex flex-1 overflow-hidden">
      <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 space-y-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-1 border-b border-outline-variant/40 pb-5">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-on-surface flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-3xl">sensors</span>
              System Health & Infrastructure
            </h1>
            <p className="text-sm text-on-surface-variant">
              Real-time monitoring for API gateway, database, services, and system metrics.
            </p>
          </div>

          {/* Infrastructure Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
            {/* API Uptime */}
            <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-2 shadow-sm">
              <div className="flex justify-between items-center text-xs text-outline">
                <span>Server Uptime</span>
                <span className="text-emerald-400 font-bold">{health?.status ?? '—'}</span>
              </div>
              <div className="text-2xl font-bold text-on-surface truncate">{health?.uptime ?? '—'}</div>
              <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full w-full rounded-full"></div>
              </div>
              <div className="text-[10px] text-outline">v{health?.version ?? '...'}</div>
            </div>

            {/* Latency */}
            <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-2 shadow-sm">
              <div className="flex justify-between items-center text-xs text-outline">
                <span>API Latency</span>
                <span className="text-amber-400 font-bold">{latencyMs > 0 ? `${latencyMs}ms` : '—'}</span>
              </div>
              <div className="text-2xl font-bold text-on-surface">{latencyMs > 0 ? `${latencyMs}ms` : '—'}</div>
              <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(latencyPct, 100)}%` }}></div>
              </div>
              <div className="text-[10px] text-outline">Inbound / Outbound</div>
            </div>

            {/* Storage */}
            <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-2 shadow-sm">
              <div className="flex justify-between items-center text-xs text-outline">
                <span>Disk Storage</span>
                <span className="text-sky-400 font-bold">{storagePct}</span>
              </div>
              <div className="text-2xl font-bold text-on-surface truncate">{storageDisplay}</div>
              <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                <div className="bg-sky-400 h-full rounded-full transition-all duration-500" style={{ width: `${Math.max(storagePercent, 1)}%` }}></div>
              </div>
              <div className="text-[10px] text-outline">JSON Store Storage</div>
            </div>

            {/* Containers */}
            <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-2 shadow-sm">
              <div className="flex justify-between items-center text-xs text-outline">
                <span>Containers</span>
                <span className="text-purple-400 font-bold">{runningCount}/{containers.length}</span>
              </div>
              <div className="text-2xl font-bold text-on-surface">{runningCount}<span className="text-sm text-outline">/{containers.length}</span></div>
              <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: containers.length > 0 ? `${(runningCount / containers.length) * 100}%` : '0%' }}></div>
              </div>
              <div className="text-[10px] text-outline">Active Services</div>
            </div>
          </div>

          {/* Running Containers Table */}
          <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between border-b border-outline-variant/50 pb-3">
              <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">deployed_code</span>
                Running Services ({runningCount}/{containers.length})
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                v{health?.version ?? '...'}
              </span>
            </div>

            {isLoading ? (
              <div className="space-y-2">
                {[1, 2].map(i => (
                  <div key={i} className="h-8 bg-surface-container-high/50 rounded animate-pulse" />
                ))}
              </div>
            ) : containers.length === 0 ? (
              <div className="text-xs text-outline font-mono text-center py-4">No container data available</div>
            ) : (
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
                        <td className="py-3 px-3 font-bold text-on-surface">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${c.status === 'Running' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                            {c.name}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-purple-300">{c.image}</td>
                        <td className="py-3 px-3 text-outline">{c.port}</td>
                        <td className="py-3 px-3 text-emerald-400 font-bold">{c.cpu}</td>
                        <td className="py-3 px-3 text-on-surface">{c.ram}</td>
                        <td className="py-3 px-3 text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            c.status === 'Running'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                            {c.status} ({c.uptime})
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* System Logs */}
          <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between border-b border-outline-variant/50 pb-3">
              <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-400 text-base">terminal</span>
                Live Infrastructure Logs
              </h3>
              <span className="text-[10px] font-mono text-outline">Auto-refreshing every 15s</span>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-3 space-y-2 font-mono text-xs max-h-48 overflow-y-auto custom-scrollbar">
              {isLoading ? (
                <div className="text-outline text-[11px]">Loading logs...</div>
              ) : logs.length === 0 ? (
                <div className="text-outline text-[11px]">No log entries available</div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="flex items-start justify-between gap-3 text-[11px]">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`px-1.5 rounded text-[9px] font-bold ${
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
                ))
              )}
            </div>
          </div>

          {/* Integrations Status */}
          {health?.integrations && (
            <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-3 shadow-sm">
              <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider border-b border-outline-variant/50 pb-2.5 flex items-center gap-2">
                <span className="material-symbols-outlined text-sky-400 text-base">cloud</span>
                Integration Status
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
                {Object.entries(health.integrations).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between bg-surface-container-lowest rounded-lg p-2.5 border border-outline-variant/40">
                    <span className="text-on-surface-variant capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className={`text-[10px] font-semibold flex items-center gap-1 ${
                      value.includes('Configured') || value.includes('Ollama')
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        value.includes('Configured') || value.includes('Ollama')
                          ? 'bg-emerald-400'
                          : 'bg-amber-400'
                      }`}></span>
                      {value.includes('Configured') ? 'Live' : value.includes('Ollama') ? 'Ollama' : 'Dev Mode'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Right Sidebar Widgets */}
      <aside className="w-80 border-l border-outline-variant/60 shrink-0 overflow-y-auto custom-scrollbar bg-surface-container-lowest p-5 space-y-6">
        <SystemHealthWidgets />
      </aside>
    </div>
  );
};
