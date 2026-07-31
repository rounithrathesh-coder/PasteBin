import React from 'react';

export const FooterStatusBar: React.FC = () => {
  return (
    <footer className="h-8 border-t border-outline-variant/60 bg-surface-container-lowest text-[11px] font-mono text-outline px-6 flex items-center justify-between z-40 shrink-0 select-none">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow"></span> API Healthy
        </span>
        <span className="text-outline-variant/60">•</span>
        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span> PostgreSQL Connected
        </span>
        <span className="text-outline-variant/60">•</span>
        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Docker Running
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span>
          Latency: <span className="text-on-surface-variant font-semibold">24ms</span>
        </span>
        <span className="text-outline-variant/60">•</span>
        <span className="bg-surface-container-high px-2 py-0.5 rounded text-[10px] text-on-surface-variant border border-outline-variant/40">
          v1.0.0
        </span>
      </div>
    </footer>
  );
};
