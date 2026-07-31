import React from 'react';

export const LanguageRingWidget: React.FC = () => {
  const languages = [
    { name: 'Python', percent: '32%', color: 'bg-blue-500', stroke: '#3b82f6' },
    { name: 'JavaScript', percent: '25%', color: 'bg-yellow-400', stroke: '#facc15' },
    { name: 'HTML', percent: '18%', color: 'bg-orange-400', stroke: '#fb923c' },
    { name: 'SQL', percent: '11%', color: 'bg-sky-400', stroke: '#38bdf8' },
    { name: 'C++', percent: '7%', color: 'bg-purple-500', stroke: '#a855f7' },
    { name: 'Bash', percent: '4%', color: 'bg-emerald-400', stroke: '#34d399' },
    { name: 'Other', percent: '3%', color: 'bg-slate-400', stroke: '#94a3b8' }
  ];

  return (
    <div className="bg-surface-container-low rounded-xl border border-outline-variant/60 p-4 space-y-4 shadow-sm">
      <div className="flex items-center gap-2 border-b border-outline-variant/50 pb-2.5">
        <span className="material-symbols-outlined text-primary text-lg">pie_chart</span>
        <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">Languages</h3>
      </div>

      <div className="grid grid-cols-12 gap-3 items-center">
        {/* Donut Chart SVG */}
        <div className="col-span-5 flex justify-center py-1">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#2f3445" strokeWidth="4" />
            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="32 68" strokeDashoffset="0" />
            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#facc15" strokeWidth="4" strokeDasharray="25 75" strokeDashoffset="-32" />
            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#fb923c" strokeWidth="4" strokeDasharray="18 82" strokeDashoffset="-57" />
            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#38bdf8" strokeWidth="4" strokeDasharray="11 89" strokeDashoffset="-75" />
            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#a855f7" strokeWidth="4" strokeDasharray="7 93" strokeDashoffset="-86" />
            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#34d399" strokeWidth="4" strokeDasharray="4 96" strokeDashoffset="-93" />
            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#94a3b8" strokeWidth="4" strokeDasharray="3 97" strokeDashoffset="-97" />
          </svg>
        </div>

        {/* Breakdown List */}
        <div className="col-span-7 space-y-1.5 font-mono text-[11px]">
          {languages.map((l) => (
            <div key={l.name} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-on-surface-variant">
                <span className={`w-2 h-2 rounded-full ${l.color}`}></span>
                <span>{l.name}</span>
              </div>
              <span className="text-on-surface font-semibold">{l.percent}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
