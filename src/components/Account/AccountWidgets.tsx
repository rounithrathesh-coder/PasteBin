import React from 'react';

export const AccountWidgets: React.FC = () => {
  const securityLogs = [
    { event: 'Password changed successfully', time: '30 days ago' },
    { event: 'New login from macOS - Chrome (192.168.88.7)', time: '2 hours ago' },
    { event: '2FA Authenticator enabled', time: '45 days ago' },
    { event: 'API Key "pb_live_..." generated', time: '60 days ago' }
  ];

  return (
    <div className="space-y-6">
      {/* Account Stats Widget */}
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-4 shadow-sm text-center">
        <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container font-bold text-2xl flex items-center justify-center mx-auto ring-2 ring-primary/30 shadow-md">
          RA
        </div>

        <div>
          <h3 className="text-base font-bold text-on-surface flex items-center justify-center gap-1">
            Rounith Arrun Rathesh
            <span className="material-symbols-outlined text-blue-400 text-sm">verified</span>
          </h3>
          <p className="text-xs font-mono text-outline">@rounithrathesh</p>
        </div>

        <div className="grid grid-cols-3 gap-2 font-mono border-t border-b border-outline-variant/40 py-3 text-xs">
          <div>
            <div className="font-bold text-on-surface text-base">28</div>
            <div className="text-[10px] text-outline">Snippets</div>
          </div>
          <div>
            <div className="font-bold text-purple-400 text-base">142</div>
            <div className="text-[10px] text-outline">Followers</div>
          </div>
          <div>
            <div className="font-bold text-emerald-400 text-base">38</div>
            <div className="text-[10px] text-outline">Following</div>
          </div>
        </div>

        <div className="text-xs font-mono text-outline flex items-center justify-center gap-1.5 pt-1">
          <span className="material-symbols-outlined text-sm">calendar_month</span>
          <span>Member since Jan 2024</span>
        </div>
      </div>

      {/* Security Activity Log */}
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">shield</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">Security Log</h3>
          </div>
        </div>

        <div className="space-y-2.5 text-xs font-mono">
          {securityLogs.map((log, i) => (
            <div key={i} className="border-b border-outline-variant/30 pb-2 last:border-none space-y-0.5">
              <div className="text-on-surface-variant font-medium leading-tight">{log.event}</div>
              <div className="text-[10px] text-outline">{log.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
