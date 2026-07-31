import React, { useState } from 'react';
import { usePastes } from '../../context/PasteContext';
import { IntegrationsWidgets } from './IntegrationsWidgets';

export const IntegrationsView: React.FC = () => {
  const { showToast } = usePastes();

  const [activeCategory, setActiveCategory] = useState('All');

  const integrations = [
    {
      id: 'github',
      name: 'GitHub Gists',
      icon: 'code',
      category: 'VCS',
      desc: 'Automatically sync public and private snippets to your GitHub Gists account.',
      connected: true,
      authType: 'OAuth 2.0',
      account: '@rounithrathesh-coder'
    },
    {
      id: 'vscode',
      name: 'VS Code Extension',
      icon: 'terminal',
      category: 'IDE & Extensions',
      desc: 'Search, insert, and publish PasteBin snippets directly inside Visual Studio Code.',
      connected: true,
      authType: 'Personal Token',
      account: 'Extension v1.4.2'
    },
    {
      id: 'slack',
      name: 'Slack Workspace',
      icon: 'chat',
      category: 'Messaging & Alerts',
      desc: 'Send automated snippet previews and notifications to designated Slack channels.',
      connected: true,
      authType: 'Incoming Webhook',
      account: '#dev-pastes'
    },
    {
      id: 'docker',
      name: 'Docker Engine',
      icon: 'deployed_code',
      category: 'DevOps & CI/CD',
      desc: 'Push, pull, and validate Dockerfiles and docker-compose configs in real time.',
      connected: true,
      authType: 'Daemon Socket',
      account: 'unix:///var/run/docker.sock'
    },
    {
      id: 'gitlab',
      name: 'GitLab Snippets',
      icon: 'source',
      category: 'VCS',
      desc: 'Export snippets directly to GitLab projects and private code repositories.',
      connected: false,
      authType: 'Personal Access Token'
    },
    {
      id: 'discord',
      name: 'Discord Webhook',
      icon: 'forum',
      category: 'Messaging & Alerts',
      desc: 'Post code snippets with syntax highlighting to Discord community servers.',
      connected: false,
      authType: 'Webhook URL'
    },
    {
      id: 'webhook',
      name: 'Custom Webhooks',
      icon: 'webhook',
      category: 'Automation',
      desc: 'Trigger HTTP POST payloads to your server on paste creation, updates, or deletion.',
      connected: true,
      authType: 'HMAC Signature',
      account: '2 Active Webhooks'
    },
    {
      id: 'cli',
      name: 'PasteBin CLI',
      icon: 'terminal',
      category: 'IDE & Extensions',
      desc: 'Command-line tool to pipe code stdout directly to PasteBin from Linux/macOS terminal.',
      connected: true,
      authType: 'CLI Key',
      account: 'v1.0.4 installed'
    },
    {
      id: 'zapier',
      name: 'Zapier Automation',
      icon: 'bolt',
      category: 'Automation',
      desc: 'Connect PasteBin triggers to over 5,000+ apps like Notion, Trello, and Jira.',
      connected: false,
      authType: 'API Token'
    }
  ];

  const categories = ['All', 'VCS', 'IDE & Extensions', 'Messaging & Alerts', 'DevOps & CI/CD', 'Automation'];

  const filtered = integrations.filter((item) => activeCategory === 'All' || item.category === activeCategory);

  return (
    <div className="flex flex-1 overflow-hidden">
      <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 space-y-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-1 border-b border-outline-variant/40 pb-5">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-on-surface flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-3xl">hub</span>
              Integrations &amp; Webhooks
            </h1>
            <p className="text-sm text-on-surface-variant">
              Connect external developer tools, IDE extensions, CI/CD pipelines, and webhooks.
            </p>
          </div>

          {/* Categories Bar */}
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 ${
                  activeCategory === cat
                    ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                    : 'bg-surface-container-high/60 text-outline hover:text-on-surface border border-outline-variant/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Integrations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-5 hover:border-primary/40 transition-all space-y-4 flex flex-col justify-between shadow-sm group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-surface-container-high border border-outline-variant/50 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                      <span className="material-symbols-outlined text-xl">{item.icon}</span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                        item.connected
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-surface-container-highest text-outline border-outline-variant/40'
                      }`}
                    >
                      {item.connected ? 'Connected' : 'Not Connected'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-on-surface-variant/80 line-clamp-2 mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-outline-variant/40">
                  {item.connected && item.account && (
                    <div className="text-[11px] font-mono text-outline flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-xs text-emerald-400">check_circle</span>
                      <span className="truncate">{item.account}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    {item.connected ? (
                      <>
                        <button
                          onClick={() => showToast(`Opened settings for ${item.name}`)}
                          className="flex-1 py-1.5 bg-surface-container-lowest border border-outline-variant/60 hover:bg-surface-container-high rounded-lg text-xs font-semibold text-on-surface transition-colors"
                        >
                          Configure
                        </button>
                        <button
                          onClick={() => showToast(`Disconnected ${item.name}`)}
                          className="px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-mono transition-colors"
                          title="Disconnect integration"
                        >
                          Disconnect
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => showToast(`Initiated connection for ${item.name}`)}
                        className="w-full py-1.5 bg-primary-container text-on-primary-container rounded-lg text-xs font-semibold hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <span className="material-symbols-outlined text-sm">add</span> Connect
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Right Sidebar Widgets */}
      <aside className="w-80 border-l border-outline-variant/60 shrink-0 overflow-y-auto custom-scrollbar bg-surface-container-lowest p-5 space-y-6">
        <IntegrationsWidgets />
      </aside>
    </div>
  );
};
