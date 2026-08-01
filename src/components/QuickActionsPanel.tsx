import React from 'react';
import { usePastes } from '../context/PasteContext';

export const QuickActionsPanel: React.FC = () => {
  const { setIsImportModalOpen } = usePastes();

  const handleUploadFile = () => {
    const picker = document.getElementById('global-shortcut-file-input') as HTMLInputElement;
    if (picker) picker.click();
  };

  const handleImportUrl = () => {
    setIsImportModalOpen(true);
  };

  return (
    <div className="bg-surface-container-low rounded-xl border border-outline-variant/60 overflow-hidden shadow-sm">
      <div className="p-3.5 flex items-center gap-2 border-b border-outline-variant/60 bg-surface-container-high/30">
        <span className="material-symbols-outlined text-amber-400 text-lg">bolt</span>
        <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">Quick Actions</h3>
      </div>
      <div className="p-2 space-y-1">
        <button
          onClick={handleUploadFile}
          className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-variant/60 transition-colors group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <span className="material-symbols-outlined text-lg">upload</span>
            </div>
            <span className="text-xs font-medium text-on-surface">Upload File</span>
          </div>
          <span className="text-[10px] font-mono text-outline bg-surface-container px-1.5 py-0.5 rounded border border-outline-variant/60">
            Ctrl + U
          </span>
        </button>

        <button
          onClick={handleImportUrl}
          className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-variant/60 transition-colors group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <span className="material-symbols-outlined text-lg">link</span>
            </div>
            <span className="text-xs font-medium text-on-surface">Import From URL</span>
          </div>
          <span className="text-[10px] font-mono text-outline bg-surface-container px-1.5 py-0.5 rounded border border-outline-variant/60">
            Ctrl + I
          </span>
        </button>
      </div>
    </div>
  );
};
