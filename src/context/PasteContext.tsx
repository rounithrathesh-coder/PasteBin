import React, { createContext, useContext, useState, useEffect } from 'react';
import { Snippet, VisibilityType, FolderItem, ViewType } from '../types/paste';
import { api } from '../services/api';

/* ─── User Profile Type ─── */
export interface UserProfile {
  name: string;
  username: string;
  email: string;
  bio: string;
  avatar: string;
  plan: string;
  role: string;
}

/* ─── Context Type ─── */
interface PasteContextType {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  pastes: Snippet[];
  trashedPastes: Snippet[];
  folders: FolderItem[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  filterVisibility: string;
  setFilterVisibility: (vis: string) => void;
  filterFolder: string;
  setFilterFolder: (folder: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  selectedSnippetIds: string[];
  setSelectedSnippetIds: React.Dispatch<React.SetStateAction<string[]>>;
  activeSnippet: Snippet | null;
  setActiveSnippet: (s: Snippet | null) => void;
  isEditorModalOpen: boolean;
  setIsEditorModalOpen: (open: boolean) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  logout: () => void;
  deleteModalSnippet: Snippet | null;
  setDeleteModalSnippet: (s: Snippet | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => Promise<void>;
  isLoadingPastes: boolean;
  createPaste: (title: string, language: string, visibility: VisibilityType, code?: string, folder?: string, description?: string) => void;
  deletePaste: (id: string) => void;
  bulkDeletePastes: () => void;
  restorePaste: (id: string) => void;
  permanentlyDeletePaste: (id: string) => void;
  emptyTrash: () => void;
  bulkRestorePastes: (ids: string[]) => void;
  bulkPermanentlyDeletePastes: (ids: string[]) => void;
  toggleFavorite: (id: string) => void;
  addFolder: (name: string, color?: string) => void;
  sharePaste: (snippet: Snippet) => void;
  isImportModalOpen: boolean;
  setIsImportModalOpen: (open: boolean) => void;
}

const DEFAULT_USER: UserProfile = {
  name: 'Developer',
  username: 'dev',
  email: 'dev@pastebin.local',
  bio: 'PasteBin Enterprise user.',
  avatar: '',
  plan: 'Free',
  role: 'Developer'
};

const PasteContext = createContext<PasteContextType | undefined>(undefined);

export const PasteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [pastes, setPastes] = useState<Snippet[]>([]);
  const [trashedPastes, setTrashedPastes] = useState<Snippet[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [isLoadingPastes, setIsLoadingPastes] = useState(true);
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [filterVisibility, setFilterVisibility] = useState('All');
  const [filterFolder, setFilterFolder] = useState('All');
  const [sortBy, setSortBy] = useState('Latest');
  const [selectedSnippetIds, setSelectedSnippetIds] = useState<string[]>([]);
  const [activeSnippet, setActiveSnippet] = useState<Snippet | null>(null);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticatedState] = useState<boolean>(() => {
    return localStorage.getItem('pastebin_auth') === 'true';
  });

  const setIsAuthenticated = (auth: boolean) => {
    setIsAuthenticatedState(auth);
    if (auth) {
      localStorage.setItem('pastebin_auth', 'true');
    } else {
      localStorage.removeItem('pastebin_auth');
    }
  };

  const [deleteModalSnippet, setDeleteModalSnippet] = useState<Snippet | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);



  /* ─── Bootstrap: Fetch pastes, trash & user from API ─── */
  useEffect(() => {
    const load = async () => {
      setIsLoadingPastes(true);
      try {
        const [pastesData, trashData, userData] = await Promise.all([
          fetch('/api/pastes').then(r => r.json()),
          fetch('/api/trash').then(r => r.json()),
          fetch('/api/auth/me').then(r => r.json())
        ]);

        if (Array.isArray(pastesData)) setPastes(pastesData);
        if (Array.isArray(trashData)) setTrashedPastes(trashData);
        if (userData && userData.name) setUser(userData);

        // Derive folders dynamically from pastes
        if (Array.isArray(pastesData)) {
          const folderMap: Record<string, number> = {};
          pastesData.forEach((p: Snippet) => {
            if (p.folder) folderMap[p.folder] = (folderMap[p.folder] || 0) + 1;
          });
          const colors: Record<string, string> = {
            DSA: 'amber', 'Web Development': 'orange', Database: 'blue',
            Utils: 'purple', DevOps: 'emerald'
          };
          const derivedFolders: FolderItem[] = Object.entries(folderMap).map(([name, count], i) => ({
            id: `f-${i + 1}`,
            name,
            color: colors[name] || 'purple',
            count
          }));
          setFolders(derivedFolders);
        }
      } catch (err) {
        console.warn('[API Bootstrap] Could not load from server:', err);
      } finally {
        setIsLoadingPastes(false);
      }
    };
    load();
  }, []);

  // Deep-link handler: Auto-open snippet if URL contains ?paste=id
  useEffect(() => {
    if (pastes.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const pasteId = params.get('paste') || params.get('snippet');
    if (pasteId) {
      const found = pastes.find((p) => p.id === pasteId);
      if (found) {
        setActiveSnippet(found);
        setIsEditorModalOpen(true);
      }
    }
  }, [pastes]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const logout = () => {
    setIsAuthenticated(false);
    showToast('Logged out successfully');
  };

  /* ─── Global Keyboard Shortcuts Listener ─── */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      if (!isCmdOrCtrl) return;

      const key = e.key.toLowerCase();
      if (key === 'n') {
        e.preventDefault();
        setActiveSnippet(null);
        setIsEditorModalOpen(true);
        showToast('Shortcut: Created New Paste (Ctrl+N)');
      } else if (key === 'u') {
        e.preventDefault();
        const picker = document.getElementById('global-shortcut-file-input') as HTMLInputElement;
        if (picker) picker.click();
        showToast('Shortcut: Select File to Upload (Ctrl+U)');
      } else if (key === 't') {
        e.preventDefault();
        setActiveSnippet(null);
        setIsEditorModalOpen(true);
        showToast('Shortcut: Opened Template Workspace (Ctrl+T)');
      } else if (key === 'i') {
        e.preventDefault();
        setIsImportModalOpen(true);
        showToast('Shortcut: Import From URL (Ctrl+I)');
      } else if (key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('navbar-search-input');
        if (searchInput) searchInput.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  /* ─── Share Snippet URL ─── */
  const sharePaste = (snippet: Snippet) => {
    try {
      const payload = btoa(encodeURIComponent(JSON.stringify(snippet)));
      const url = `${window.location.origin}/p/${snippet.id}?data=${payload}`;
      try {
        navigator.clipboard.writeText(url);
      } catch (e) {}
      window.open(url, '_blank', 'noopener,noreferrer');
      showToast(`Share link copied & opened in new tab!`);
    } catch (err) {
      const fallbackUrl = `${window.location.origin}/p/${snippet.id}`;
      try { navigator.clipboard.writeText(fallbackUrl); } catch (e) {}
      window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
      showToast(`Share link copied & opened in new tab!`);
    }
  };



  /* ─── User Profile Update ─── */
  const updateUser = async (updates: Partial<UserProfile>) => {
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const updated = await res.json();
      setUser(updated);
      showToast('Profile updated successfully!');
    } catch (err) {
      console.warn('[API] Profile update failed:', err);
      setUser(prev => ({ ...prev, ...updates }));
      showToast('Profile updated locally.');
    }
  };

  /* ─── Paste CRUD ─── */
  const createPaste = async (
    title: string,
    language: string,
    visibility: VisibilityType,
    code?: string,
    folder?: string,
    description?: string
  ) => {
    const defaultCode = code || `// New ${language} paste\nconsole.log("Hello from ${title}");`;
    const lineCount = defaultCode.split('\n').length;

    try {
      const apiResult = await api.createPaste({
        title: title || `Untitled ${language} Paste`,
        language: language || 'JavaScript',
        visibility,
        code: defaultCode,
        folder: folder || 'Utils',
        description: description || `Snippet created in ${language}`
      });

      if (apiResult && apiResult.id) {
        setPastes(prev => [apiResult, ...prev]);
        if (folder) {
          setFolders(prev => {
            const exists = prev.find(f => f.name === folder);
            if (exists) return prev.map(f => f.name === folder ? { ...f, count: f.count + 1 } : f);
            return [...prev, { id: `f-${Date.now()}`, name: folder, color: 'purple', count: 1 }];
          });
        }
        showToast(`"${apiResult.title}" published!`);
        return;
      }
    } catch (err) {
      console.warn('[API Create Fail]:', err);
    }

    // Local fallback
    const newSnippet: Snippet = {
      id: `pst-${Date.now()}`,
      title: title || `Untitled ${language} Paste`,
      description: description || `Snippet created in ${language}`,
      code: defaultCode,
      language: language || 'JavaScript',
      visibility,
      views: 1,
      lines: lineCount,
      fileSize: `${(defaultCode.length / 1024).toFixed(1)} KB`,
      author: user.username,
      createdAt: 'Just now',
      lastOpened: 'Just now',
      folder: folder || 'Utils',
      tags: [language.toLowerCase()],
      isFavorite: false
    };
    setPastes(prev => [newSnippet, ...prev]);
    showToast(`"${newSnippet.title}" published locally!`);
  };

  const deletePaste = async (id: string) => {
    try { await api.deletePaste(id); } catch (err) { console.warn('[API Delete Fail]:', err); }
    const target = pastes.find(p => p.id === id);
    if (target) {
      setPastes(prev => prev.filter(p => p.id !== id));
      setTrashedPastes(prev => [{ ...target, isTrashed: true, deletedAt: 'Just now' }, ...prev]);
      setSelectedSnippetIds(prev => prev.filter(i => i !== id));
      setDeleteModalSnippet(null);
      showToast(`"${target.title}" moved to Trash.`);
    }
  };

  const bulkDeletePastes = async () => {
    const targets = pastes.filter(p => selectedSnippetIds.includes(p.id));
    for (const t of targets) { try { await api.deletePaste(t.id); } catch (e) {} }
    setPastes(prev => prev.filter(p => !selectedSnippetIds.includes(p.id)));
    setTrashedPastes(prev => [
      ...targets.map(t => ({ ...t, isTrashed: true, deletedAt: 'Just now' })),
      ...prev
    ]);
    setSelectedSnippetIds([]);
    showToast(`Moved ${targets.length} snippets to Trash.`);
  };

  const restorePaste = async (id: string) => {
    try { await api.restorePaste(id); } catch (err) { console.warn('[API Restore Fail]:', err); }
    const target = trashedPastes.find(p => p.id === id);
    if (target) {
      setTrashedPastes(prev => prev.filter(p => p.id !== id));
      setPastes(prev => [{ ...target, isTrashed: false }, ...prev]);
      showToast(`Restored "${target.title}" to My Snippets.`);
    }
  };

  const bulkRestorePastes = async (ids: string[]) => {
    for (const id of ids) { try { await api.restorePaste(id); } catch (e) {} }
    const targets = trashedPastes.filter(p => ids.includes(p.id));
    setTrashedPastes(prev => prev.filter(p => !ids.includes(p.id)));
    setPastes(prev => [...targets.map(t => ({ ...t, isTrashed: false })), ...prev]);
    showToast(`Restored ${targets.length} snippets.`);
  };

  const permanentlyDeletePaste = async (id: string) => {
    try { await api.deletePaste(id); } catch (e) {}
    const target = trashedPastes.find(p => p.id === id);
    setTrashedPastes(prev => prev.filter(p => p.id !== id));
    showToast(`Permanently deleted "${target?.title || 'snippet'}".`);
  };

  const bulkPermanentlyDeletePastes = async (ids: string[]) => {
    for (const id of ids) { try { await api.deletePaste(id); } catch (e) {} }
    setTrashedPastes(prev => prev.filter(p => !ids.includes(p.id)));
    showToast(`Permanently deleted ${ids.length} snippets.`);
  };

  const emptyTrash = async () => {
    try { await api.emptyTrash(); } catch (e) {}
    const count = trashedPastes.length;
    setTrashedPastes([]);
    showToast(`Emptied trash (${count} items deleted).`);
  };

  const toggleFavorite = (id: string) => {
    setPastes(prev => prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
  };

  const addFolder = (name: string, color = 'purple') => {
    const newFolder: FolderItem = { id: `f-${Date.now()}`, name, color, count: 0 };
    setFolders(prev => [...prev, newFolder]);
    showToast(`Folder "${name}" created.`);
  };

  return (
    <PasteContext.Provider
      value={{
        activeView, setActiveView,
        pastes, trashedPastes, folders,
        isLoadingPastes,
        searchQuery, setSearchQuery,
        selectedLanguage, setSelectedLanguage,
        filterVisibility, setFilterVisibility,
        filterFolder, setFilterFolder,
        sortBy, setSortBy,
        selectedSnippetIds, setSelectedSnippetIds,
        activeSnippet, setActiveSnippet,
        isEditorModalOpen, setIsEditorModalOpen,
        theme, toggleTheme,
        isAuthModalOpen, setIsAuthModalOpen,
        isAuthenticated, setIsAuthenticated,
        logout,
        deleteModalSnippet, setDeleteModalSnippet,
        toastMessage, showToast,
        user, updateUser,
        createPaste, deletePaste, bulkDeletePastes,
        restorePaste, permanentlyDeletePaste,
        emptyTrash, bulkRestorePastes, bulkPermanentlyDeletePastes,
        toggleFavorite, addFolder, sharePaste,
        isImportModalOpen, setIsImportModalOpen
      }}
    >
      <input
        type="file"
        id="global-shortcut-file-input"
        className="hidden"
        accept=".py,.js,.jsx,.ts,.tsx,.html,.css,.sql,.go,.rs,.cpp,.c,.h,.sh,.json,.yml,.yaml,.md,.txt"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (evt) => {
            const content = evt.target?.result as string;
            if (content !== undefined) {
              const ext = file.name.split('.').pop()?.toLowerCase() || '';
              const extMap: Record<string, string> = {
                py: 'Python', js: 'JavaScript', ts: 'TypeScript', html: 'HTML',
                css: 'CSS', sql: 'SQL', sh: 'Bash', cpp: 'C++', go: 'Go', rs: 'Rust', json: 'YAML'
              };
              const lang = extMap[ext] || 'JavaScript';
              setActiveSnippet(null);
              createPaste(file.name, lang, 'Public', content, 'Utils', `Uploaded via Ctrl+U`);
              setIsEditorModalOpen(true);
              showToast(`Uploaded & opened "${file.name}" in Monaco Editor!`);
            }
          };
          reader.readAsText(file);
        }}
      />
      {children}
    </PasteContext.Provider>
  );
};

export const usePastes = () => {
  const context = useContext(PasteContext);
  if (!context) throw new Error('usePastes must be used within PasteProvider');
  return context;
};
