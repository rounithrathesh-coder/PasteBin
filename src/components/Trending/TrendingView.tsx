import React, { useState } from 'react';
import { usePastes } from '../../context/PasteContext';
import { Snippet } from '../../types/paste';
import { TrendingWidgets } from './TrendingWidgets';

export const TrendingView: React.FC = () => {
  const { setActiveSnippet, setIsEditorModalOpen, showToast, toggleFavorite } = usePastes();

  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>('week');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [sortBy, setSortBy] = useState('Most Viewed');

  // Sample trending dataset
  const trendingSnippets: (Snippet & { rank: number; stars: number; likes: number; copies: number })[] = [
    {
      rank: 1,
      id: 'tr-01',
      title: 'FastAPI Clean Architecture Template',
      description: 'Production-ready FastAPI boilerplate with Dependency Injection, Alembic migrations, and JWT auth',
      code: `from fastapi import FastAPI, Depends, HTTPException\nfrom pydantic import BaseModel\n\napp = FastAPI(title="Production API", version="1.0.0")\n\n@app.get("/health")\nasync def health_check():\n    return {"status": "healthy", "database": "connected"}`,
      language: 'Python',
      visibility: 'Public',
      views: 18420,
      stars: 1240,
      likes: 890,
      copies: 3420,
      lines: 48,
      fileSize: '3.8 KB',
      author: 'dev_master',
      isVerifiedAuthor: true,
      createdAt: '2 days ago',
      tags: ['fastapi', 'python', 'clean-architecture', 'jwt']
    },
    {
      rank: 2,
      id: 'tr-02',
      title: 'React Custom Hooks Collection 2026',
      description: 'Handcrafted production hooks: useDebounce, useLocalStorage, useIntersectionObserver, useAsync',
      code: `import { useState, useEffect } from 'react';\n\nexport function useDebounce<T>(value: T, delay: number): T {\n  const [debouncedValue, setDebouncedValue] = useState<T>(value);\n  useEffect(() => {\n    const handler = setTimeout(() => setDebouncedValue(value), delay);\n    return () => clearTimeout(handler);\n  }, [value, delay]);\n  return debouncedValue;\n}`,
      language: 'TypeScript',
      visibility: 'Public',
      views: 14200,
      stars: 980,
      likes: 720,
      copies: 2850,
      lines: 62,
      fileSize: '4.2 KB',
      author: 'ui_developer',
      isVerifiedAuthor: true,
      createdAt: '3 days ago',
      tags: ['react', 'typescript', 'hooks', 'frontend']
    },
    {
      rank: 3,
      id: 'tr-03',
      title: 'PostgreSQL Query Performance Tuning Kit',
      description: 'Advanced EXPLAIN ANALYZE queries, index optimization scripts, and deadlock detector triggers',
      code: `SELECT schemaname, relname, seq_scan, seq_tup_read,\n       idx_scan, idx_tup_fetch\nFROM pg_stat_user_tables\nWHERE seq_scan > 0\nORDER BY seq_tup_read DESC LIMIT 10;`,
      language: 'SQL',
      visibility: 'Public',
      views: 11800,
      stars: 840,
      likes: 610,
      copies: 1940,
      lines: 34,
      fileSize: '2.6 KB',
      author: 'data_guy',
      isVerifiedAuthor: true,
      createdAt: '4 days ago',
      tags: ['sql', 'postgres', 'performance', 'indexing']
    },
    {
      rank: 4,
      id: 'tr-04',
      title: 'Docker Multi-Stage Build for Next.js App Router',
      description: 'Minimal Alpine-based standalone Dockerfile reducing image size from 1.2GB down to 85MB',
      code: `FROM node:20-alpine AS base\nFROM base AS deps\nRUN apk add --no-cache libc6-compat\nWORKDIR /app\nCOPY package.json package-lock.json ./\nRUN npm ci\n\nFROM base AS builder\nWORKDIR /app\nCOPY --from=deps /app/node_modules ./node_modules\nCOPY . .\nRUN npm run build`,
      language: 'Docker',
      visibility: 'Public',
      views: 9400,
      stars: 710,
      likes: 540,
      copies: 1620,
      lines: 40,
      fileSize: '1.9 KB',
      author: 'devops_lead',
      isVerifiedAuthor: true,
      createdAt: '5 days ago',
      tags: ['docker', 'nextjs', 'devops', 'alpine']
    },
    {
      rank: 5,
      id: 'tr-05',
      title: 'Go High-Concurrency Worker Pool Engine',
      description: 'Thread-safe goroutine worker pool with channel buffering, context timeout, and graceful shutdown',
      code: `package main\n\nimport (\n\t"context"\n\t"fmt"\n\t"sync"\n\t"time"\n)\n\ntype Job struct { ID int }\n\nfunc worker(ctx context.Context, id int, jobs <-chan Job, wg *sync.WaitGroup) {\n\tdefer wg.Done()\n\tfor j := range jobs {\n\t\tfmt.Printf("Worker %d processing job %d\\n", id, j.ID)\n\t}\n}`,
      language: 'Go',
      visibility: 'Public',
      views: 8100,
      stars: 620,
      likes: 480,
      copies: 1290,
      lines: 45,
      fileSize: '2.8 KB',
      author: 'algo_expert',
      isVerifiedAuthor: true,
      createdAt: '6 days ago',
      tags: ['go', 'golang', 'concurrency', 'workerpool']
    }
  ];

  // Filtering
  const filtered = trendingSnippets.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesLang = selectedLanguage === 'All' || p.language.toLowerCase() === selectedLanguage.toLowerCase();
    return matchesSearch && matchesLang;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'Most Starred') return b.stars - a.stars;
    if (sortBy === 'Most Copied') return b.copies - a.copies;
    return b.views - a.views; // Default Most Viewed
  });

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 ring-1 ring-amber-400/30';
      case 2:
        return 'bg-slate-400/20 text-slate-200 border-slate-400/40';
      case 3:
        return 'bg-orange-600/20 text-orange-300 border-orange-600/40';
      default:
        return 'bg-surface-container-high text-outline border-outline-variant/60';
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Main Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 space-y-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/40 pb-5">
            <div className="space-y-1">
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-on-surface flex items-center gap-3">
                <span className="material-symbols-outlined text-amber-400 text-3xl">local_fire_department</span>
                Trending Snippets
              </h1>
              <p className="text-sm text-on-surface-variant">
                Discover the most popular code snippets across the developer community.
              </p>
            </div>

            {/* Timeframe Chips */}
            <div className="flex items-center gap-1.5 bg-surface-container-low p-1.5 rounded-xl border border-outline-variant/60">
              {(['today', 'week', 'month'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all ${
                    timeframe === tf
                      ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                      : 'text-outline hover:text-on-surface'
                  }`}
                >
                  {tf === 'today' ? 'Trending Today' : tf === 'week' ? 'This Week' : 'This Month'}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Toolbar */}
          <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center shadow-sm">
            {/* Search Input */}
            <div className="sm:col-span-6 relative group">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg group-focus-within:text-primary transition-colors">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search trending snippets..."
                className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg py-2.5 pl-10 pr-4 text-xs font-mono text-on-surface focus:outline-none focus:border-primary-container transition-all"
              />
            </div>

            {/* Language Selector */}
            <div className="sm:col-span-3 relative">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg py-2.5 px-3 text-xs font-mono text-on-surface focus:outline-none focus:border-primary appearance-none cursor-pointer"
              >
                <option value="All">All Languages</option>
                <option value="Python">Python</option>
                <option value="TypeScript">TypeScript</option>
                <option value="SQL">SQL</option>
                <option value="Docker">Docker</option>
                <option value="Go">Go</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-base pointer-events-none">
                unfold_more
              </span>
            </div>

            {/* Sort Selector */}
            <div className="sm:col-span-3 relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg py-2.5 px-3 text-xs font-mono text-on-surface focus:outline-none focus:border-primary appearance-none cursor-pointer"
              >
                <option value="Most Viewed">Sort: Most Viewed</option>
                <option value="Most Starred">Sort: Most Starred</option>
                <option value="Most Copied">Sort: Most Copied</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-base pointer-events-none">
                unfold_more
              </span>
            </div>
          </div>

          {/* Snippets List */}
          <div className="space-y-4">
            {sorted.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  setActiveSnippet(p);
                  setIsEditorModalOpen(true);
                }}
                className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-5 hover:border-l-4 hover:border-l-primary hover:bg-surface-container-high/50 transition-all duration-200 cursor-pointer group shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    {/* Rank Badge */}
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs border ${getRankBadge(p.rank)}`}>
                      #{p.rank}
                    </span>

                    <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors">
                      {p.title}
                    </h3>

                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-surface-container-highest text-outline border border-outline-variant/40">
                      {p.language}
                    </span>
                  </div>

                  <p className="text-xs text-on-surface-variant/80 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>

                  {/* Metadata & Metrics */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-outline pt-1">
                    <div className="flex items-center gap-1.5 text-on-surface font-medium">
                      <span>by {p.author}</span>
                      {p.isVerifiedAuthor && <span className="material-symbols-outlined text-blue-400 text-xs">verified</span>}
                    </div>

                    <span>•</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">visibility</span> {(p.views / 1000).toFixed(1)}K views</span>
                    <span className="flex items-center gap-1 text-amber-400"><span className="material-symbols-outlined text-sm">star</span> {p.stars}</span>
                    <span className="flex items-center gap-1 text-red-400"><span className="material-symbols-outlined text-sm">favorite</span> {p.likes}</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">content_copy</span> {p.copies}</span>

                    <span>•</span>
                    <span>{p.fileSize}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(p.id);
                    }}
                    className="p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/60 text-outline hover:text-amber-400 transition-colors"
                    title="Save snippet"
                  >
                    <span className="material-symbols-outlined text-base">star</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(`https://pastebin.dev/p/${p.id}`);
                      showToast(`Copied share link for "${p.title}"!`);
                    }}
                    className="p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/60 text-outline hover:text-on-surface transition-colors"
                    title="Copy Link"
                  >
                    <span className="material-symbols-outlined text-base">link</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSnippet(p);
                      setIsEditorModalOpen(true);
                    }}
                    className="px-3 py-2 bg-primary-container text-on-primary-container rounded-lg text-xs font-semibold hover:brightness-110 transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-base">open_in_new</span>
                    Open
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Right Sidebar Widgets */}
      <aside className="w-80 border-l border-outline-variant/60 shrink-0 overflow-y-auto custom-scrollbar bg-surface-container-lowest p-5 space-y-6">
        <TrendingWidgets />
      </aside>
    </div>
  );
};
