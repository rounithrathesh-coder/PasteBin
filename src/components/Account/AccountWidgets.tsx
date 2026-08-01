import React, { useEffect, useState } from 'react';
import { usePastes } from '../../context/PasteContext';

export const AccountWidgets: React.FC = () => {
  const { user, pastes } = usePastes();

  const avatarInitials = user.name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U';

  const [securityLogs, setSecurityLogs] = useState([
    { event: 'Account session started', time: 'Just now' },
    { event: '2FA Authenticator enabled', time: '30 days ago' },
    { event: 'API Key generated', time: '60 days ago' }
  ]);

  useEffect(() => {
    // Generate a security log entry based on recent activity
    const recentPastes = pastes.filter(p => p.createdAt === 'Just now');
    if (recentPastes.length > 0) {
      setSecurityLogs(prev => [
        { event: `New paste "${recentPastes[0].title}" published`, time: 'Just now' },
        ...prev.slice(0, 3)
      ]);
    }
  }, [pastes.length]);

  return (
    <div className="space-y-6">
      {/* Account Stats Widget */}
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-4 shadow-sm text-center">
        <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container font-bold text-2xl flex items-center justify-center mx-auto ring-2 ring-primary/30 shadow-md">
          {avatarInitials}
        </div>

        <div>
          <h3 className="text-base font-bold text-on-surface flex items-center justify-center gap-1">
            {user.name}
            <span className="material-symbols-outlined text-blue-400 text-sm">verified</span>
          </h3>
          <p className="text-xs font-mono text-outline">@{user.username}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 font-mono border-t border-b border-outline-variant/40 py-3 text-xs">
          <div>
            <div className="font-bold text-on-surface text-base">{pastes.length}</div>
            <div className="text-[10px] text-outline">Snippets</div>
          </div>
          <div>
            <div className="font-bold text-purple-400 text-base">{pastes.filter(p => p.isFavorite).length}</div>
            <div className="text-[10px] text-outline">Favorites</div>
          </div>
          <div>
            <div className="font-bold text-emerald-400 text-base">{pastes.filter(p => p.visibility === 'Public').length}</div>
            <div className="text-[10px] text-outline">Public</div>
          </div>
        </div>

        <div className="text-xs font-mono text-outline flex items-center justify-center gap-1.5 pt-1">
          <span className="material-symbols-outlined text-sm">badge</span>
          <span>{user.plan} Account • {user.role}</span>
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
