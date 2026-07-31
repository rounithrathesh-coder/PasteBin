import React from 'react';
import { usePastes } from '../../context/PasteContext';

export const DeleteConfirmModal: React.FC = () => {
  const { deleteModalSnippet, setDeleteModalSnippet, deletePaste } = usePastes();

  if (!deleteModalSnippet) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-6 w-full max-w-md shadow-2xl space-y-4">
        <div className="flex items-center gap-3 text-red-400 border-b border-outline-variant/50 pb-3">
          <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-xl">warning</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-on-surface">Delete Snippet</h3>
            <p className="text-xs text-outline font-mono">This action cannot be undone.</p>
          </div>
        </div>

        <p className="text-xs text-on-surface-variant leading-relaxed">
          Are you sure you want to delete <span className="font-bold text-on-surface">"{deleteModalSnippet.title}"</span>? The snippet file and shareable link will be permanently removed.
        </p>

        <div className="flex justify-end gap-2.5 pt-2">
          <button
            onClick={() => setDeleteModalSnippet(null)}
            className="px-4 py-2 rounded-lg border border-outline-variant/60 text-xs font-mono text-outline hover:text-on-surface hover:bg-surface-variant/40 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => deletePaste(deleteModalSnippet.id)}
            className="px-4 py-2 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors shadow-md shadow-red-500/20"
          >
            Permanently Delete
          </button>
        </div>
      </div>
    </div>
  );
};
