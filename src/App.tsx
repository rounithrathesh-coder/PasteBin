import React from 'react';
import { PasteProvider, usePastes } from './context/PasteContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { QuickCreateCard } from './components/QuickCreateCard';
import { StatsGrid } from './components/StatsGrid';
import { RecentPastesTable } from './components/RecentPastesTable';
import { TrendingPastes } from './components/TrendingPastes';
import { SystemStatusPanel } from './components/SystemStatusPanel';
import { QuickActionsPanel } from './components/QuickActionsPanel';
import { FooterStatusBar } from './components/FooterStatusBar';
import { MonacoEditorModal } from './components/MonacoEditorModal';
import { MySnippetsView } from './components/MySnippets/MySnippetsView';
import { FavoritesView } from './components/Favorites/FavoritesView';
import { FavoritesWidget } from './components/Favorites/FavoritesWidget';
import { TrashView } from './components/Trash/TrashView';
import { PublicPastesView } from './components/PublicPastes/PublicPastesView';

/* ─── Dashboard ─── */
const DashboardViewContent: React.FC = () => {
  const { selectedLanguage, setSelectedLanguage } = usePastes();

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Center Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 space-y-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/40 pb-5">
            <div className="space-y-1">
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-on-surface flex items-center gap-3">
                Dashboard
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-medium inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow"></span> Live
                </span>
              </h1>
              <p className="text-sm text-on-surface-variant">
                Create, manage and share code snippets securely.
              </p>
            </div>

            {/* Language Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-1">
              {['All', 'Python', 'JavaScript', 'HTML', 'SQL', 'C++'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                    selectedLanguage === lang
                      ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                      : 'bg-surface-container-high/60 text-outline hover:text-on-surface border border-outline-variant/50'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Create Paste Card */}
          <QuickCreateCard />

          {/* Statistics Grid */}
          <StatsGrid />

          {/* Recent Pastes Table */}
          <RecentPastesTable />

          {/* Trending Pastes Grid */}
          <TrendingPastes />
        </div>
      </main>

      {/* Right Widgets Sidebar */}
      <aside className="w-80 border-l border-outline-variant/60 shrink-0 overflow-y-auto custom-scrollbar bg-surface-container-lowest p-5 space-y-6">
        <QuickActionsPanel />
        <FavoritesWidget />
        <SystemStatusPanel />
      </aside>
    </div>
  );
};

/* ─── Placeholder Page Shell ─── */
const PlaceholderPage: React.FC<{ title: string; subtitle: string; icon: string }> = ({ title, subtitle, icon }) => (
  <div className="flex flex-1 overflow-hidden">
    <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="space-y-1.5 border-b border-outline-variant/40 pb-5">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-on-surface flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl">{icon}</span>
            {title}
          </h1>
          <p className="text-sm text-on-surface-variant">{subtitle}</p>
        </div>

        <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-3xl">{icon}</span>
          </div>
          <h3 className="text-base font-bold text-on-surface">Coming Soon</h3>
          <p className="text-xs text-outline font-mono max-w-md mx-auto">
            This section is under active development and will be available in an upcoming release.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-mono font-semibold border border-primary/20">
            <span className="material-symbols-outlined text-sm">construction</span>
            In Development
          </div>
        </div>
      </div>
    </main>
  </div>
);

/* ─── Main Layout ─── */
const MainAppLayout: React.FC = () => {
  const { activeView, toastMessage } = usePastes();

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardViewContent />;
      case 'my-snippets':
        return <MySnippetsView />;
      case 'favorites':
        return <FavoritesView />;
      case 'trash':
        return <TrashView />;
      case 'public-pastes':
        return <PublicPastesView />;
      case 'trending':
        return <PlaceholderPage title="Trending" subtitle="Discover the most popular snippets this week." icon="trending_up" />;
      case 'api-docs':
        return <PlaceholderPage title="API Docs & Keys" subtitle="Manage API keys and explore the PasteBin REST API." icon="api" />;
      case 'integrations':
        return <PlaceholderPage title="Integrations" subtitle="Connect third-party services and configure webhooks." icon="hub" />;
      case 'system-health':
        return <PlaceholderPage title="System Health" subtitle="Monitor server status, Docker containers, PostgreSQL, and uptime." icon="sensors" />;
      case 'preferences':
        return <PlaceholderPage title="Preferences" subtitle="Customize your editor, theme, and notification settings." icon="settings" />;
      case 'account':
        return <PlaceholderPage title="Account" subtitle="Manage your profile, security, and authentication." icon="account_circle" />;
      default:
        return <DashboardViewContent />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-surface overflow-hidden text-on-surface">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Flex Section */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Dynamic View Rendering */}
        {renderView()}
      </div>

      {/* Footer Status Bar */}
      <FooterStatusBar />

      {/* Monaco Editor Modal */}
      <MonacoEditorModal />

      {/* Toast Feedback Banner */}
      {toastMessage && (
        <div className="fixed bottom-12 right-6 z-50 bg-primary-container text-on-primary-container px-4 py-2.5 rounded-lg shadow-xl border border-primary/30 text-xs font-mono font-semibold flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-base">check_circle</span>
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export function App() {
  return (
    <PasteProvider>
      <MainAppLayout />
    </PasteProvider>
  );
}

export default App;
