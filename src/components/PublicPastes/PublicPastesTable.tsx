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

  // Dynamic public snippets from live backend database / context state
  const publicSnippets: Snippet[] = pastes;

  // Filter logic
  const filtered = publicSnippets.filter((p) => {
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

  const totalCount = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSnippets = sorted.slice(startIndex, startIndex + itemsPerPage);

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
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'javascript':
      case 'js':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'typescript':
      case 'ts':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'html':
      case 'css':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'sql':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'c++':
      case 'cpp':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'bash':
      case 'shell':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default:
        return 'bg-primary-container/10 text-primary border-primary-container/20';
    }
  };

  return (
    <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl overflow-hidden shadow-lg shadow-black/10">
      {/* Snippets Container */}
      <div className="divide-y divide-outline-variant/40">
        {paginatedSnippets.map((snippet) => (
          <div
            key={snippet.id}
            onClick={() => handleOpenSnippet(snippet)}
            className="group relative p-4 lg:p-5 hover:bg-surface-container-high/60 transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none"
          >
            {/* Hover Purple Accent Line */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity rounded-r" />

            <div className="flex items-start gap-3.5 min-w-0 flex-1">
              <div className="w-9 h-9 rounded-full bg-primary-container/20 border border-primary-container/30 text-primary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                {snippet.authorAvatar || snippet.author.slice(0, 2).toUpperCase()}
              </div>

              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors truncate">
                    {snippet.title}
                  </h3>
                  {snippet.isVerifiedAuthor && (
                    <span className="material-symbols-outlined text-xs text-sky-400" title="Verified Author">
                      verified
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${getLangBadgeStyle(
                      snippet.language
                    )}`}
                  >
                    {snippet.language}
                  </span>
                </div>

                <p className="text-xs text-on-surface-variant line-clamp-1 leading-relaxed">
                  {snippet.description || 'Public code snippet on PasteBin Platform'}
                </p>

                <div className="flex items-center gap-4 text-[11px] font-mono text-outline pt-1 flex-wrap">
                  <span className="text-on-surface-variant font-medium">@{snippet.author}</span>
                  <span>•</span>
                  <span>{snippet.createdAt}</span>
                  <span>•</span>
                  <span>{snippet.lines} lines</span>
                  <span>•</span>
                  <span>{snippet.fileSize}</span>
                </div>
              </div>
            </div>

            {/* Engagement Metrics & Actions */}
            <div className="flex items-center gap-4 shrink-0 sm:self-center">
              <div className="flex items-center gap-3 text-xs font-mono text-outline">
                <span className="flex items-center gap-1" title="Views">
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  {snippet.views}
                </span>
                <span className="flex items-center gap-1" title="Stars">
                  <span className="material-symbols-outlined text-sm text-amber-400">star</span>
                  {snippet.stars || 42}
                </span>
                <span className="flex items-center gap-1" title="Copies">
                  <span className="material-symbols-outlined text-sm text-purple-400">content_copy</span>
                  {snippet.copies || 128}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(snippet.id);
                  }}
                  className={`p-1.5 rounded-lg transition-colors ${
                    snippet.isFavorite
                      ? 'text-amber-400 hover:bg-amber-500/10'
                      : 'text-outline hover:text-on-surface hover:bg-surface-variant/40'
                  }`}
                  title={snippet.isFavorite ? 'Starred' : 'Star Snippet'}
                >
                  <span className="material-symbols-outlined text-base">
                    {snippet.isFavorite ? 'star' : 'star_border'}
                  </span>
                </button>
                <button
                  onClick={(e) => handleCopyLink(e, snippet)}
                  className="p-1.5 text-outline hover:text-on-surface hover:bg-surface-variant/40 rounded-lg transition-colors"
                  title="Copy Public Link"
                >
                  <span className="material-symbols-outlined text-base">link</span>
                </button>
                <button
                  onClick={(e) => handleReport(e, snippet)}
                  className="p-1.5 text-outline hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Report Snippet"
                >
                  <span className="material-symbols-outlined text-base">flag</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {paginatedSnippets.length === 0 && (
          <div className="p-12 text-center space-y-3">
            <span className="material-symbols-outlined text-4xl text-outline">search_off</span>
            <h3 className="text-base font-semibold text-on-surface">No Public Snippets Found</h3>
            <p className="text-xs text-outline max-w-sm mx-auto">
              No snippets matched your search or language filter. Try clearing your filters or creating a public snippet.
            </p>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="bg-surface-container-lowest px-5 py-3.5 border-t border-outline-variant/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-outline">
        <div>
          Showing <span className="text-on-surface font-semibold">{paginatedSnippets.length > 0 ? startIndex + 1 : 0}</span> to{' '}
          <span className="text-on-surface font-semibold">{Math.min(startIndex + itemsPerPage, totalCount)}</span> of{' '}
          <span className="text-on-surface font-semibold">{totalCount}</span> public snippets
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-2.5 py-1 rounded bg-surface-container-low border border-outline-variant/60 hover:bg-surface-container-high disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-on-surface"
          >
            Prev
          </button>

          <span className="px-2">
            Page <span className="text-on-surface font-semibold">{currentPage}</span> of{' '}
            <span className="text-on-surface font-semibold">{totalPages}</span>
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-2.5 py-1 rounded bg-surface-container-low border border-outline-variant/60 hover:bg-surface-container-high disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-on-surface"
          >
            Next
          </button>

          <form onSubmit={handleJumpPage} className="flex items-center gap-1.5 ml-2">
            <span>Jump to:</span>
            <input
              type="text"
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
