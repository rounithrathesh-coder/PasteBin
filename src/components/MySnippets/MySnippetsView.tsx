import React, { useState } from 'react';
import { QuickFilterTabs } from './QuickFilterTabs';
import { FilterToolbar } from './FilterToolbar';
import { SnippetsTable } from './SnippetsTable';
import { SnippetOverview } from './SnippetOverview';
import { RecentlyOpenedWidget } from './RecentlyOpenedWidget';
import { LanguageRingWidget } from './LanguageRingWidget';
import { FoldersWidget } from './FoldersWidget';
import { DeleteConfirmModal } from './DeleteConfirmModal';

export const MySnippetsView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Center Workspace */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 space-y-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="space-y-1.5 border-b border-outline-variant/40 pb-5">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-on-surface flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-3xl">description</span>
              My Snippets
            </h1>
            <p className="text-sm text-on-surface-variant">
              Manage, organize and share your code snippets.
            </p>
          </div>

          {/* Quick Filter Tabs & New Folder Button */}
          <QuickFilterTabs />

          {/* Search, Filter Toolbar & List/Grid Toggle */}
          <FilterToolbar viewMode={viewMode} setViewMode={setViewMode} />

          {/* Interactive Snippets List / Grid & Pagination */}
          <SnippetsTable viewMode={viewMode} />
        </div>
      </main>

      {/* Right Sidebar Widgets */}
      <aside className="w-80 border-l border-outline-variant/60 shrink-0 overflow-y-auto custom-scrollbar bg-surface-container-lowest p-5 space-y-6">
        {/* Snippet Overview Stats & Storage Meter */}
        <SnippetOverview />

        {/* Recently Opened Snippets */}
        <RecentlyOpenedWidget />

        {/* Languages Ring Chart */}
        <LanguageRingWidget />

        {/* Folders Management & Drag Handles */}
        <FoldersWidget />

        {/* Recent Activity Timeline */}
        <div className="bg-surface-container-low rounded-xl border border-outline-variant/60 p-4 space-y-3.5 shadow-sm">
          <div className="flex justify-between items-center border-b border-outline-variant/50 pb-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">Recent Activity</h3>
            <a className="text-primary text-[11px] font-semibold hover:underline" href="#">View all →</a>
          </div>
          <div className="space-y-3.5 text-xs font-mono">
            <div className="flex gap-2.5">
              <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-xs">edit</span>
              </div>
              <div>
                <div className="text-[11px] text-on-surface">Updated <span className="text-primary font-semibold">"Quick sort in Python"</span></div>
                <div className="text-[10px] text-outline mt-0.5">2 hours ago</div>
              </div>
            </div>

            <div className="flex gap-2.5">
              <div className="w-6 h-6 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                <span className="material-symbols-outlined text-xs">add</span>
              </div>
              <div>
                <div className="text-[11px] text-on-surface">Created <span className="text-primary font-semibold">"Linux Command Cheatsheet"</span></div>
                <div className="text-[10px] text-outline mt-0.5">2 days ago</div>
              </div>
            </div>

            <div className="flex gap-2.5">
              <div className="w-6 h-6 rounded bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                <span className="material-symbols-outlined text-xs">lock</span>
              </div>
              <div>
                <div className="text-[11px] text-on-surface">Made <span className="text-primary font-semibold">"SQL Join Examples"</span> private</div>
                <div className="text-[10px] text-outline mt-0.5">3 days ago</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal />
    </div>
  );
};
