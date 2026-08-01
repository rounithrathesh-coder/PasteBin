import React, { useState } from 'react';
import { usePastes } from '../context/PasteContext';

interface ImportUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportUrlModal: React.FC<ImportUrlModalProps> = ({ isOpen, onClose }) => {
  const { setActiveSnippet, setIsEditorModalOpen, showToast, createPaste } = usePastes();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      showToast('Please enter a valid code URL.');
      return;
    }

    setLoading(true);
    try {
      // Clean up URL for CORS or GitHub raw links if applicable
      let fetchUrl = url.trim();
      if (fetchUrl.includes('github.com') && fetchUrl.includes('/blob/')) {
        fetchUrl = fetchUrl.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
      }

      const res = await fetch(fetchUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      const codeText = await res.text();

      const rawFileName = fetchUrl.split('/').pop()?.split('?')[0] || 'imported_code';
      const ext = rawFileName.split('.').pop()?.toLowerCase() || '';

      const extMap: Record<string, string> = {
        py: 'Python', js: 'JavaScript', ts: 'TypeScript', html: 'HTML',
        css: 'CSS', sql: 'SQL', sh: 'Bash', cpp: 'C++', go: 'Go', rs: 'Rust', json: 'YAML'
      };

      const lang = extMap[ext] || 'JavaScript';

      // Open in Monaco Editor Modal
      setActiveSnippet(null);
      createPaste(rawFileName, lang, 'Public', codeText, 'Utils', `Imported from ${url}`);
      setIsEditorModalOpen(true);
      showToast(`Imported ${rawFileName} (${lang}) from URL!`);
      onClose();
      setUrl('');
    } catch (err: any) {
      showToast(`Import failed: ${err.message || 'Could not fetch URL'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm view-transition">
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <span className="material-symbols-outlined text-xl">link</span>
            <h3 className="text-sm font-bold text-on-surface font-mono">Import Code From URL</h3>
          </div>
          <button onClick={onClose} className="text-outline hover:text-on-surface p-1 rounded-md">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <form onSubmit={handleImport} className="space-y-4 font-mono text-xs">
          <p className="text-on-surface-variant text-[11px]">
            Enter a raw file URL (e.g. GitHub Raw, Gist, or raw code endpoint) to import directly into your workspace.
          </p>

          <div className="space-y-1.5">
            <label className="text-outline text-[10px]">Code File / Endpoint URL</label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://raw.githubusercontent.com/user/repo/main/app.js"
              className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-2.5 text-xs text-on-surface focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-outline-variant/60 text-outline hover:text-on-surface"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold hover:bg-emerald-500/30 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">download</span>
              {loading ? 'Fetching...' : 'Import Snippet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
