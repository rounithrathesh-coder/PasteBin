import React, { useEffect, useState } from 'react';

interface FooterHealth {
  status: string;
  latencyMs: number;
  version: string;
  integrations: {
    supabase: string;
    openRouter: string;
    huggingFace: string;
  };
}

export const FooterStatusBar: React.FC = () => {
  const [health, setHealth] = useState<FooterHealth | null>(null);

  useEffect(() => {
    const load = () => {
      const start = Date.now();
      fetch('/api/health')
        .then(r => r.json())
        .then(data => {
          const roundtrip = Date.now() - start;
          setHealth({ ...data, latencyMs: data.latencyMs ?? roundtrip });
        })
        .catch(() => {});
    };
    load();
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
  }, []);

  const apiOk = health?.status === 'Healthy';
  const dbOk = !!health;
  const aiOk = health?.integrations?.openRouter !== undefined;

  return (
    <footer className="h-8 border-t border-outline-variant/60 bg-surface-container-lowest text-[11px] font-mono text-outline px-6 flex items-center justify-between z-40 shrink-0 select-none">
      <div className="flex items-center gap-4">
        <span className={`flex items-center gap-1.5 font-medium ${apiOk ? 'text-emerald-400' : 'text-amber-400'}`}>
          <span className={`w-2 h-2 rounded-full animate-pulse-slow ${apiOk ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
          API {health?.status ?? 'Connecting...'}
        </span>
        <span className="text-outline-variant/60">•</span>
        <span className={`flex items-center gap-1.5 font-medium ${dbOk ? 'text-emerald-400' : 'text-amber-400'}`}>
          <span className={`w-2 h-2 rounded-full ${dbOk ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
          {health?.integrations?.supabase?.includes('Configured') ? 'Supabase Connected' : 'DB Connected'}
        </span>
        <span className="text-outline-variant/60">•</span>
        <span className={`flex items-center gap-1.5 font-medium ${aiOk ? 'text-emerald-400' : 'text-outline'}`}>
          <span className={`w-2 h-2 rounded-full ${aiOk ? 'bg-emerald-400' : 'bg-outline'}`}></span>
          AI {health?.integrations?.openRouter?.includes('Configured') ? 'Ready' : 'Dev Mode'}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span>
          Latency: <span className="text-on-surface-variant font-semibold">{health ? `${health.latencyMs}ms` : '—'}</span>
        </span>
        <span className="text-outline-variant/60">•</span>
        <span className="bg-surface-container-high px-2 py-0.5 rounded text-[10px] text-on-surface-variant border border-outline-variant/40">
          v{health?.version ?? '...'}
        </span>
      </div>
    </footer>
  );
};
