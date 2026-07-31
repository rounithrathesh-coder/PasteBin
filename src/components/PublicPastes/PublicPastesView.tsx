import React, { useState } from 'react';
import { PublicPastesTable } from './PublicPastesTable';
import { CommunityOverviewWidgets } from './CommunityOverviewWidgets';

export const PublicPastesView: React.FC = () => {
  const [activeChip, setActiveChip] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedTime, setSelectedTime] = useState('All Time');
  const [sortBy, setSortBy] = useState('Most Viewed');

  const chips = [
    { key: 'All', label: 'All', count: '1,248' },
    { key: 'Python', label: 'Python', count: '312', icon: 'terminal' },
    { key: 'JavaScript', label: 'JavaScript', count: '284', icon: 'code' },
    { key: 'HTML', label: 'HTML', count: '198', icon: 'html' },
    { key: 'SQL', label: 'SQL', count: '156', icon: 'database' },
    { key: 'C++', label: 'C++', count: '98', icon: 'memory' }
  ];

  const handleClearFilters = () => {
    setActiveChip('All');
    setSearchQuery('');
    setSelectedLanguage('All');
    setSelectedTime('All Time');
    setSortBy('Most Viewed');
  };

  const isFilterActive =
    activeChip !== 'All' ||
    searchQuery !== '' ||
    selectedLanguage !== 'All' ||
    selectedTime !== 'All Time' ||
    sortBy !== 'Most Viewed';

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Center Main Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 space-y-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="space-y-1 border-b border-outline-variant/40 pb-5">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-on-surface flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl lg:text-3xl text-primary">public</span>
              Public Pastes
            </h1>
            <p className="text-sm text-on-surface-variant">
              Explore code snippets shared by the community.
            </p>
          </div>

          {/* Language Filter Chips Row with Increased Spacing */}
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar py-1">
            {chips.map((chip) => {
              const isActive = activeChip === chip.key;
              return (
                <button
                  key={chip.key}
                  onClick={() => {
                    setActiveChip(chip.key);
                    setSelectedLanguage(chip.key);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 shrink-0 ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm shadow-primary/20'
                      : 'bg-surface-container-high/60 text-outline hover:text-on-surface hover:bg-surface-container-high border border-outline-variant/50'
                  }`}
                >
                  {chip.icon && <span className="material-symbols-outlined text-sm">{chip.icon}</span>}
                  <span>{chip.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive ? 'bg-white/20 text-white' : 'bg-surface-container-highest text-outline'
                    }`}
                  >
                    {chip.count}
                  </span>
                </button>
              );
            })}

            {/* More Dropdown */}
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono text-outline hover:text-on-surface bg-surface-container-high/60 border border-outline-variant/50 transition-all shrink-0">
              <span>More</span>
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
          </div>

          {/* Advanced Filter Toolbar */}
          <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center shadow-sm">
            {/* Search Input */}
            <div className="sm:col-span-5 relative group">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg group-focus-within:text-primary transition-colors">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search public pastes by title, tag, or author..."
                className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg py-2.5 pl-10 pr-4 text-xs font-mono text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all placeholder:text-outline/60"
              />
            </div>

            {/* Language Selector */}
            <div className="sm:col-span-2 relative">
              <select
                value={selectedLanguage}
                onChange={(e) => {
                  setSelectedLanguage(e.target.value);
                  setActiveChip(e.target.value);
                }}
                className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg py-2.5 px-3 text-xs font-mono text-on-surface focus:outline-none focus:border-primary appearance-none cursor-pointer"
              >
                <option value="All">All Languages</option>
                <option value="Python">Python</option>
                <option value="HTML">HTML</option>
                <option value="JavaScript">JavaScript</option>
                <option value="SQL">SQL</option>
                <option value="C++">C++</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-base pointer-events-none">
                unfold_more
              </span>
            </div>

            {/* Time Filter */}
            <div className="sm:col-span-2 relative">
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg py-2.5 px-3 text-xs font-mono text-on-surface focus:outline-none focus:border-primary appearance-none cursor-pointer"
              >
                <option value="All Time">All Time</option>
                <option value="Past 24 Hours">Past 24 Hours</option>
                <option value="Past Week">Past Week</option>
                <option value="Past Month">Past Month</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-base pointer-events-none">
                unfold_more
              </span>
            </div>

            {/* Sort Selector & Clear Button */}
            <div className="sm:col-span-3 flex items-center gap-2">
              <div className="relative flex-1">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg py-2.5 px-3 text-xs font-mono text-on-surface focus:outline-none focus:border-primary appearance-none cursor-pointer truncate"
                >
                  <option value="Most Viewed">Sort: Most Viewed</option>
                  <option value="Most Liked">Sort: Most Liked</option>
                  <option value="Recently Added">Sort: Recently Added</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-outline text-base pointer-events-none">
                  unfold_more
                </span>
              </div>

              {/* Clear Filters Button */}
              {isFilterActive && (
                <button
                  onClick={handleClearFilters}
                  className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-mono font-semibold transition-colors flex items-center gap-1 shrink-0"
                  title="Clear all active filters"
                >
                  <span className="material-symbols-outlined text-sm">clear_all</span> Clear
                </button>
              )}

              <button
                className="p-2 bg-surface-container-lowest border border-outline-variant/60 rounded-lg text-outline hover:text-on-surface hover:border-outline transition-colors shrink-0"
                title="Advanced Filter Options"
              >
                <span className="material-symbols-outlined text-base">filter_list</span>
              </button>
            </div>
          </div>

          {/* Snippets Table */}
          <PublicPastesTable
            searchQuery={searchQuery}
            selectedLanguage={selectedLanguage}
            sortBy={sortBy}
          />
        </div>
      </main>

      {/* Right Sidebar Widgets */}
      <aside className="w-80 border-l border-outline-variant/60 shrink-0 overflow-y-auto custom-scrollbar bg-surface-container-lowest p-5 space-y-6">
        <CommunityOverviewWidgets />
      </aside>
    </div>
  );
};
