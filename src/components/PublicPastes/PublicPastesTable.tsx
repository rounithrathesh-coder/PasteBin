import React, { useState } from 'react';
import { usePastes } from '../../context/PasteContext';
import { Snippet } from '../../types/paste';

interface PublicPastesTableProps {
  searchQuery: string;
  selectedLanguage: string;
  sortBy: string;
}

export const PublicPastesTable: React.FC<PublicPastesTableProps> = ({
  searchQuery,
  selectedLanguage,
  sortBy
}) => {
  const { pastes, setActiveSnippet, setIsEditorModalOpen, showToast, toggleFavorite } = usePastes();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [jumpPageInput, setJumpPageInput] = useState('');

  // Sample public snippet data with engagement metrics & verified authors
  const publicSnippets: Snippet[] = [
    {
      id: 'pub-01',
      title: 'Quick sort in Python',
      description: 'Implementation of quick sort algorithm with comments',
      code: `def quick_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quick_sort(left) + middle + quick_sort(right)\n\nprint(quick_sort([3,6,8,10,1,2,1]))`,
      language: 'Python',
      visibility: 'Public',
      views: 2400,
      lines: 28,
      fileSize: '1.2 KB',
      author: 'dev_master',
      isVerifiedAuthor: true,
      authorAvatar: 'DM',
      createdAt: '2 hours ago',
      tags: ['sorting', 'algorithm', 'python3'],
      isFavorite: true,
      stars: 42,
      likes: 89,
      copies: 128
    },
    {
      id: 'pub-02',
      title: 'Responsive Navbar HTML CSS',
      description: 'Modern responsive navbar with hamburger menu and mobile layout drawer',
      code: `<nav className="flex justify-between items-center px-6 py-4 bg-slate-900 text-white">\n  <div className="font-bold text-xl">AppLogo</div>\n  <ul className="flex gap-6">\n    <li><a href="#" className="hover:text-purple-400">Home</a></li>\n    <li><a href="#" className="hover:text-purple-400">Features</a></li>\n  </ul>\n</nav>`,
      language: 'HTML',
      visibility: 'Public',
      views: 1800,
      lines: 42,
      fileSize: '2.4 KB',
      author: 'ui_developer',
      isVerifiedAuthor: true,
      authorAvatar: 'UI',
      createdAt: '5 hours ago',
      tags: ['navbar', 'html', 'css', 'responsive', 'flexbox'],
      isFavorite: true,
      stars: 67,
      likes: 134,
      copies: 210
    },
    {
      id: 'pub-03',
      title: 'JavaScript Array Methods',
      description: 'Commonly used array methods with practical high-performance examples',
      code: `const numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(n => n * 2);\nconst sum = numbers.reduce((acc, curr) => acc + curr, 0);\nconsole.log({ doubled, sum });`,
      language: 'JavaScript',
      visibility: 'Public',
      views: 1600,
      lines: 36,
      fileSize: '3.1 KB',
      author: 'script_kid',
      isVerifiedAuthor: true,
      authorAvatar: 'SK',
      createdAt: '1 day ago',
      tags: ['javascript', 'array', 'methods', 'es6', 'functional'],
      isFavorite: false,
      stars: 29,
      likes: 74,
      copies: 95
    },
    {
      id: 'pub-04',
      title: 'SQL Join Examples',
      description: 'Inner join, left join, right join queries with practical database benchmarks',
      code: `SELECT u.id, u.name, o.total_amount, o.created_at\nFROM users u\nINNER JOIN orders o ON u.id = o.user_id\nWHERE o.status = 'COMPLETED'\nORDER BY o.created_at DESC;`,
      language: 'SQL',
      visibility: 'Public',
      views: 1200,
      lines: 24,
      fileSize: '1.6 KB',
      author: 'data_guy',
      isVerifiedAuthor: true,
      authorAvatar: 'DG',
      createdAt: '1 day ago',
      tags: ['sql', 'database', 'join', 'queries', 'postgresql'],
      isFavorite: false,
      stars: 55,
      likes: 112,
      copies: 148
    },
    {
      id: 'pub-05',
      title: 'Binary Search in C++',
      description: 'Efficient binary search implementation with boundary condition checks',
      code: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint binarySearch(const vector<int>& arr, int target) {\n    int low = 0, high = arr.size() - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}`,
      language: 'C++',
      visibility: 'Public',
      views: 987,
      lines: 31,
      fileSize: '1.5 KB',
      author: 'dev_coder',
      isVerifiedAuthor: true,
      authorAvatar: 'DC',
      createdAt: '2 days ago',
      tags: ['cpp', 'binarysearch', 'algorithm', 'dsa'],
      isFavorite: false,
      stars: 38,
      likes: 62,
      copies: 88
    }
  ];

  // Combine state pastes and static public snippets
  const allPublic = [...publicSnippets, ...pastes.filter((p) => p.visibility === 'Public')];

  // Filter logic
  const filtered = allPublic.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesLang = selectedLanguage === 'All' || p.language.toLowerCase() === selectedLanguage.toLowerCase();

    return matchesSearch && matchesLang;
  });

  // Sort logic
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'Most Liked') return (b.likes || 0) - (a.likes || 0);
    if (sortBy === 'Recently Added') return a.id.localeCompare(b.id);
    return b.views - a.views; // Default Most Viewed
  });

  // Total simulation count to match screenshot: 1,248
  const totalCount = 1248;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const handleOpenSnippet = (p: Snippet) => {
    setActiveSnippet(p);
    setIsEditorModalOpen(true);
  };

  const handleCopyLink = (e: React.MouseEvent, p: Snippet) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`https://pastebin.dev/p/${p.id}`);
    showToast(`Copied public link for "${p.title}"!`);
  };

  const handleReport = (e: React.MouseEvent, p: Snippet) => {
    e.stopPropagation();
    showToast(`Reported snippet "${p.title}" to moderators.`);
  };

  const handleJumpPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(jumpPageInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setJumpPageInput('');
    }
  };

  const getLangBadgeStyle = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'python':
        return { badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30', dot: 'bg-blue-400' };
      case 'html':
        return { badge: 'bg-orange-500/15 text-orange-300 border-orange-500/30', dot: 'bg-orange-400' };
      case 'javascript':
      case 'js':
        return { badge: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30', dot: 'bg-yellow-400' };
      case 'sql':
        return { badge: 'bg-sky-500/15 text-sky-300 border-sky-500/30', dot: 'bg-sky-400' };
      case 'c++':
      case 'cpp':
        return { badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30', dot: 'bg-indigo-400' };
      default:
        return { badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30', dot: 'bg-purple-400' };
    }
  };

  return (
    <div className="space-y-4">
      {/* Table Container */}
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl overflow-hidden shadow-sm">
        {sorted.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-surface-container-high mx-auto flex items-center justify-center text-outline">
              <span className="material-symbols-outlined text-2xl">public_off</span>
            </div>
            <h3 className="text-base font-bold text-on-surface">No public pastes found</h3>
            <p className="text-xs text-outline font-mono max-w-sm mx-auto">
              No community code snippets match your search criteria. Try adjusting your search term or language filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/50 bg-surface-container-lowest/50 text-[10px] font-mono uppercase tracking-wider text-outline select-none">
                  <th className="py-3 px-4 font-semibold">Title &amp; Description</th>
                  <th className="py-3 px-4 font-semibold">Language</th>
                  <th className="py-3 px-4 font-semibold">Author</th>
                  <th className="py-3 px-4 font-semibold">Views</th>
                  <th className="py-3 px-4 font-semibold">Created</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40 text-xs">
                {sorted.map((p) => {
                  const style = getLangBadgeStyle(p.language);

                  return (
                    <tr
                      key={p.id}
                      onClick={() => handleOpenSnippet(p)}
                      className="group hover:border-l-4 hover:border-l-primary hover:bg-surface-container-high/50 transition-all duration-200 cursor-pointer"
                    >
                      {/* Title, Description & Tags */}
                      <td className="py-4 px-4 max-w-md">
                        <div className="flex items-start gap-3">
                          {/* Code Icon Container */}
                          <div className="w-9 h-9 rounded-lg bg-surface-container-high border border-outline-variant/50 flex items-center justify-center shrink-0 text-primary group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
                            <span className="material-symbols-outlined text-base">code</span>
                          </div>

                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="font-bold text-base text-on-surface group-hover:text-primary transition-colors flex items-center gap-2">
                              <span>{p.title}</span>
                              {p.isVerifiedAuthor && (
                                <span className="material-symbols-outlined text-blue-400 text-sm" title="Verified Author">
                                  verified
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-on-surface-variant/80 line-clamp-2 leading-relaxed">
                              {p.description || 'Public code snippet shared with the community.'}
                            </p>

                            {/* Size & Line Count Meta */}
                            <div className="text-[10px] font-mono text-outline flex items-center gap-2 pt-0.5">
                              <span>{p.fileSize || '1.2 KB'}</span>
                              <span>•</span>
                              <span>{p.lines || '28'} lines</span>
                            </div>

                            {/* Engagement Metrics (Stars, Likes, Copies) */}
                            <div className="flex items-center gap-4 text-[11px] font-mono text-outline pt-1">
                              <span className="flex items-center gap-1 hover:text-amber-400 transition-colors">
                                <span className="material-symbols-outlined text-xs text-amber-400">star</span>
                                <span>{p.stars || 42}</span>
                              </span>
                              <span className="flex items-center gap-1 hover:text-red-400 transition-colors">
                                <span className="material-symbols-outlined text-xs text-red-400">favorite</span>
                                <span>{p.likes || 89}</span>
                              </span>
                              <span className="flex items-center gap-1 hover:text-purple-400 transition-colors">
                                <span className="material-symbols-outlined text-xs">content_copy</span>
                                <span>{p.copies || 128}</span>
                              </span>
                            </div>

                            {/* Tag Chips */}
                            {p.tags && p.tags.length > 0 && (
                              <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-1 pt-1.5">
                                {p.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-0.5 rounded bg-surface-container-highest/80 text-outline text-[10px] font-mono hover:text-on-surface border border-outline-variant/40 shrink-0"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Language Badge */}
                      <td className="py-4 px-4 whitespace-nowrap align-top">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold border ${style.badge}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
                          {p.language}
                        </span>
                      </td>

                      {/* Author Info & Verified Badge */}
                      <td className="py-4 px-4 whitespace-nowrap align-top">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs shrink-0 ring-1 ring-primary/20">
                            {p.authorAvatar || p.author.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-on-surface flex items-center gap-1">
                              {p.author}
                              {p.isVerifiedAuthor && (
                                <span className="material-symbols-outlined text-blue-400 text-xs" title="Verified Author">
                                  verified
                                </span>
                              )}
                            </div>
                            {p.isVerifiedAuthor && (
                              <span className="text-[9px] font-mono text-emerald-400 font-semibold px-1 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20">
                                Verified Author
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Views Count */}
                      <td className="py-4 px-4 font-mono text-outline whitespace-nowrap align-top">
                        <div className="flex items-center gap-1 text-on-surface-variant">
                          <span className="material-symbols-outlined text-sm text-outline">visibility</span>
                          <span className="font-semibold">{p.views > 999 ? `${(p.views / 1000).toFixed(1)}K` : p.views}</span>
                        </div>
                      </td>

                      {/* Created Timestamp */}
                      <td className="py-4 px-4 font-mono text-outline whitespace-nowrap align-top">
                        {p.createdAt}
                      </td>

                      {/* Action Icons on Hover */}
                      <td className="py-4 px-4 whitespace-nowrap text-right align-top">
                        <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          {/* Save to Favorites */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(p.id);
                            }}
                            className={`p-1.5 rounded-md transition-colors ${
                              p.isFavorite
                                ? 'text-amber-400 bg-amber-400/10'
                                : 'text-outline hover:text-amber-400 hover:bg-surface-variant/80'
                            }`}
                            title={p.isFavorite ? 'Remove from Favorites' : 'Save to Favorites'}
                          >
                            <span className="material-symbols-outlined text-base">star</span>
                          </button>

                          {/* Copy Link */}
                          <button
                            onClick={(e) => handleCopyLink(e, p)}
                            className="p-1.5 hover:bg-surface-variant/80 rounded-md text-outline hover:text-on-surface transition-colors"
                            title="Copy Share Link"
                          >
                            <span className="material-symbols-outlined text-base">link</span>
                          </button>

                          {/* Preview / Open in Editor */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenSnippet(p);
                            }}
                            className="p-1.5 hover:bg-surface-variant/80 rounded-md text-outline hover:text-on-surface transition-colors"
                            title="Preview in Editor"
                          >
                            <span className="material-symbols-outlined text-base">open_in_new</span>
                          </button>

                          {/* Report */}
                          <button
                            onClick={(e) => handleReport(e, p)}
                            className="p-1.5 hover:bg-red-500/20 rounded-md text-outline hover:text-red-400 transition-colors"
                            title="Report Snippet"
                          >
                            <span className="material-symbols-outlined text-base">flag</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2 text-xs font-mono text-outline pt-1">
        <div>
          Showing <span className="text-on-surface font-semibold">{startIndex + 1}–{startIndex + sorted.length}</span> of{' '}
          <span className="text-on-surface font-semibold">{totalCount.toLocaleString()}</span> public snippets
        </div>

        <div className="flex items-center gap-1.5 self-center">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg border border-outline-variant/60 disabled:opacity-40 hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-base">chevron_left</span>
          </button>

          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                currentPage === page
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'hover:bg-surface-container-high text-outline'
              }`}
            >
              {page}
            </button>
          ))}

          <span className="px-1 text-outline">...</span>

          <button
            onClick={() => setCurrentPage(totalPages)}
            className={`px-2 h-7 rounded-lg text-xs font-bold transition-all ${
              currentPage === totalPages
                ? 'bg-primary-container text-on-primary-container shadow-sm'
                : 'hover:bg-surface-container-high text-outline'
            }`}
          >
            {totalPages}
          </button>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-lg border border-outline-variant/60 disabled:opacity-40 hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-base">chevron_right</span>
          </button>
        </div>

        {/* Jump To Page & Rows Per Page */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <form onSubmit={handleJumpPage} className="flex items-center gap-1">
            <span className="text-[11px]">Go to:</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={jumpPageInput}
              onChange={(e) => setJumpPageInput(e.target.value)}
              placeholder="Page..."
              className="w-14 bg-surface-container-lowest border border-outline-variant/60 rounded px-1.5 py-0.5 text-xs font-mono text-on-surface focus:outline-none focus:border-primary text-center"
            />
          </form>

          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-surface-container-lowest border border-outline-variant/60 rounded px-2 py-1 text-xs font-mono text-on-surface focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
      </div>
    </div>
  );
};
