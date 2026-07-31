import React, { createContext, useContext, useState } from 'react';
import { Snippet, VisibilityType, FolderItem, ViewType } from '../types/paste';

const INITIAL_PASTES: Snippet[] = [
  {
    id: 'pst-01',
    title: 'Quick sort in Python',
    description: 'Implementation of quick sort algorithm with comments',
    code: `def quick_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quick_sort(left) + middle + quick_sort(right)\n\nprint(quick_sort([3,6,8,10,1,2,1]))`,
    language: 'Python',
    visibility: 'Public',
    views: 128,
    lines: 28,
    fileSize: '1.2 KB',
    author: 'coder_07',
    createdAt: '2 hours ago',
    lastOpened: '10m ago',
    folder: 'DSA',
    tags: ['sorting', 'algorithm', 'python3'],
    isFavorite: true,
    isPinned: true
  },
  {
    id: 'pst-02',
    title: 'Responsive Navbar HTML CSS',
    description: 'Modern responsive navbar with hamburger menu',
    code: `<nav className="flex justify-between items-center px-6 py-4 bg-slate-900 text-white">\n  <div className="font-bold text-xl">AppLogo</div>\n  <ul className="flex gap-6">\n    <li><a href="#" className="hover:text-purple-400">Home</a></li>\n    <li><a href="#" className="hover:text-purple-400">Features</a></li>\n  </ul>\n</nav>`,
    language: 'HTML',
    visibility: 'Public',
    views: 96,
    lines: 42,
    fileSize: '2.4 KB',
    author: 'ui_developer',
    createdAt: '5 hours ago',
    lastOpened: '1h ago',
    folder: 'Web Development',
    tags: ['navbar', 'flexbox', 'css3'],
    isFavorite: true
  },
  {
    id: 'pst-03',
    title: 'JavaScript Array Methods',
    description: 'Commonly used array methods with examples',
    code: `const numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(n => n * 2);\nconst sum = numbers.reduce((acc, curr) => acc + curr, 0);\nconsole.log({ doubled, sum });`,
    language: 'JavaScript',
    visibility: 'Unlisted',
    views: 78,
    lines: 36,
    fileSize: '1.8 KB',
    author: 'script_kid',
    createdAt: '1 day ago',
    lastOpened: '3h ago',
    folder: 'Utils',
    tags: ['js', 'es6', 'arrays'],
    isFavorite: true
  },
  {
    id: 'pst-04',
    title: 'SQL Join Examples',
    description: 'Inner join, left join, right join with practical examples',
    code: `SELECT u.id, u.name, o.total_amount, o.created_at\nFROM users u\nINNER JOIN orders o ON u.id = o.user_id\nWHERE o.status = 'COMPLETED'\nORDER BY o.created_at DESC;`,
    language: 'SQL',
    visibility: 'Private',
    views: 64,
    lines: 24,
    fileSize: '1.1 KB',
    author: 'data_guy',
    createdAt: '1 day ago',
    lastOpened: '2d ago',
    folder: 'Database',
    tags: ['sql', 'queries', 'postgres'],
    isFavorite: false
  },
  {
    id: 'pst-05',
    title: 'Binary Search in C++',
    description: 'Efficient binary search implementation',
    code: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint binarySearch(const vector<int>& arr, int target) {\n    int low = 0, high = arr.size() - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}`,
    language: 'C++',
    visibility: 'Public',
    views: 53,
    lines: 31,
    fileSize: '1.5 KB',
    author: 'dev_c++',
    createdAt: '2 days ago',
    lastOpened: '1d ago',
    folder: 'DSA',
    tags: ['binarysearch', 'cpp', 'algorithms'],
    isFavorite: true
  },
  {
    id: 'pst-06',
    title: 'Linux Command Cheatsheet',
    description: 'Useful Linux commands for daily development',
    code: `sudo systemctl status docker\nps aux | grep node\nfind . -name "*.log" -type f -delete\nchmod +x deploy.sh`,
    language: 'Bash',
    visibility: 'Public',
    views: 42,
    lines: 18,
    fileSize: '0.8 KB',
    author: 'sysadmin',
    createdAt: '2 days ago',
    lastOpened: '12h ago',
    folder: 'DevOps',
    tags: ['bash', 'linux', 'cli'],
    isFavorite: false
  },
  {
    id: 'pst-07',
    title: 'JWT Authentication Middleware',
    description: 'Express JS middleware for verifying Bearer JWT tokens',
    code: `const jwt = require('jsonwebtoken');\n\nmodule.exports = (req, res, next) => {\n  const token = req.headers.authorization?.split(' ')[1];\n  if (!token) return res.status(401).json({ error: 'Unauthorized' });\n  try {\n    req.user = jwt.verify(token, process.env.JWT_SECRET);\n    next();\n  } catch (err) {\n    res.status(403).json({ error: 'Invalid Token' });\n  }\n};`,
    language: 'JavaScript',
    visibility: 'Public',
    views: 185,
    lines: 34,
    fileSize: '2.1 KB',
    author: 'backend_dev',
    createdAt: '3 days ago',
    folder: 'Web Development',
    tags: ['express', 'auth', 'jwt'],
    isFavorite: true
  },
  {
    id: 'pst-08',
    title: 'Docker Compose for Postgres & Redis',
    description: 'Production-ready docker compose environment setup',
    code: `version: '3.8'\nservices:\n  db:\n    image: postgres:15-alpine\n    environment:\n      POSTGRES_PASSWORD: secretpassword\n    ports:\n      - "5432:5432"\n  redis:\n    image: redis:alpine\n    ports:\n      - "6379:6379"`,
    language: 'Bash',
    visibility: 'Public',
    views: 210,
    lines: 29,
    fileSize: '1.7 KB',
    author: 'devops_lead',
    createdAt: '4 days ago',
    folder: 'DevOps',
    tags: ['docker', 'postgres', 'redis'],
    isFavorite: true
  },
  {
    id: 'pst-09',
    title: 'PostgreSQL User Schema Creation',
    description: 'DDL scripts for user tables, triggers, and indices',
    code: `CREATE TABLE users (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  email VARCHAR(255) UNIQUE NOT NULL,\n  password_hash TEXT NOT NULL,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n);\nCREATE INDEX idx_users_email ON users(email);`,
    language: 'SQL',
    visibility: 'Private',
    views: 74,
    lines: 22,
    fileSize: '1.4 KB',
    author: 'db_admin',
    createdAt: '5 days ago',
    folder: 'Database',
    tags: ['postgres', 'schema', 'ddl'],
    isFavorite: false
  },
  {
    id: 'pst-10',
    title: 'Merge Sort Implementation in Python',
    description: 'Divide and conquer merge sort algorithm',
    code: `def merge_sort(arr):\n    if len(arr) > 1:\n        mid = len(arr) // 2;\n        L, R = arr[:mid], arr[mid:]\n        merge_sort(L); merge_sort(R)\n        i = j = k = 0\n        while i < len(L) and j < len(R):\n            if L[i] < R[j]: arr[k] = L[i]; i += 1\n            else: arr[k] = R[j]; j += 1\n            k += 1\n        while i < len(L): arr[k] = L[i]; i += 1; k += 1\n        while j < len(R): arr[k] = R[j]; j += 1; k += 1`,
    language: 'Python',
    visibility: 'Public',
    views: 112,
    lines: 38,
    fileSize: '1.9 KB',
    author: 'algo_expert',
    createdAt: '6 days ago',
    folder: 'DSA',
    tags: ['python', 'dsa', 'mergesort'],
    isFavorite: false
  }
];

// Add dummy records to reach 28 total active snippets
for (let i = 11; i <= 28; i++) {
  const languages = ['Python', 'JavaScript', 'HTML', 'SQL', 'C++', 'Bash'];
  const visibilities: VisibilityType[] = ['Public', 'Private', 'Unlisted', 'Public'];
  const folders = ['DSA', 'Web Development', 'Database', 'Utils', 'DevOps'];
  const lang = languages[i % languages.length];
  const vis = visibilities[i % visibilities.length];
  const fold = folders[i % folders.length];

  INITIAL_PASTES.push({
    id: `pst-${i}`,
    title: `${lang} Developer Snippet #${i}`,
    description: `Production code helper for ${lang} in module ${fold}`,
    code: `// ${lang} Snippet #${i}\n// Auto-generated helper snippet\nconsole.log("Snippet #${i} loaded successfully");`,
    language: lang,
    visibility: vis,
    views: 30 + i * 4,
    lines: 15 + (i % 20),
    fileSize: `${(0.5 + (i % 3) * 0.4).toFixed(1)} KB`,
    author: `dev_user_${i}`,
    createdAt: `${i} days ago`,
    folder: fold,
    tags: [lang.toLowerCase(), fold.toLowerCase().replace(/\s+/g, '')],
    isFavorite: i % 4 === 0
  });
}

// Initial Trash Data (18 items to match mockup exactly)
const INITIAL_TRASH: Snippet[] = [
  {
    id: 'tr-01',
    title: 'Quick sort in Python',
    description: 'Implementation of quick sort algorithm with comments',
    code: `def quick_sort(arr):\n    if len(arr) <= 1: return arr\n    pivot = arr[len(arr) // 2]\n    return quick_sort([x for x in arr if x < pivot]) + [x for x in arr if x == pivot] + quick_sort([x for x in arr if x > pivot])`,
    language: 'Python',
    visibility: 'Public',
    views: 128,
    lines: 28,
    fileSize: '1.2 KB',
    author: 'coder_07',
    createdAt: '2 hours ago',
    deletedAt: '2 hours ago',
    isTrashed: true
  },
  {
    id: 'tr-02',
    title: 'Responsive Navbar HTML CSS',
    description: 'Modern responsive navbar with hamburger menu',
    code: `<nav className="flex justify-between items-center px-6 py-4 bg-slate-900 text-white">\n  <div className="font-bold text-xl">AppLogo</div>\n</nav>`,
    language: 'HTML',
    visibility: 'Public',
    views: 96,
    lines: 42,
    fileSize: '2.4 KB',
    author: 'ui_developer',
    createdAt: '5 hours ago',
    deletedAt: '5 hours ago',
    isTrashed: true
  },
  {
    id: 'tr-03',
    title: 'JWT Authentication Middleware',
    description: 'Express JS middleware for verifying Bearer JWT tokens',
    code: `const jwt = require("jsonwebtoken");\nmodule.exports = (req, res, next) => { ... }`,
    language: 'JavaScript',
    visibility: 'Public',
    views: 78,
    lines: 36,
    fileSize: '3.1 KB',
    author: 'backend_dev',
    createdAt: '1 day ago',
    deletedAt: '1 day ago',
    isTrashed: true
  },
  {
    id: 'tr-04',
    title: 'Docker Compose for Postgres',
    description: 'Production-ready docker compose setup for postgres database',
    code: `version: "3.8"\nservices:\n  db:\n    image: postgres:15-alpine`,
    language: 'Bash',
    visibility: 'Public',
    views: 64,
    lines: 24,
    fileSize: '1.8 KB',
    author: 'devops_lead',
    createdAt: '2 days ago',
    deletedAt: '2 days ago',
    isTrashed: true
  },
  {
    id: 'tr-05',
    title: 'SQL Join Examples',
    description: 'Common SQL join queries with practical examples',
    code: `SELECT u.id, u.name, o.total_amount FROM users u INNER JOIN orders o ON u.id = o.user_id`,
    language: 'SQL',
    visibility: 'Private',
    views: 53,
    lines: 31,
    fileSize: '1.6 KB',
    author: 'data_guy',
    createdAt: '3 days ago',
    deletedAt: '3 days ago',
    isTrashed: true
  }
];

for (let i = 6; i <= 18; i++) {
  const languages = ['Python', 'JavaScript', 'HTML', 'Bash', 'SQL', 'C++'];
  const lang = languages[i % languages.length];
  INITIAL_TRASH.push({
    id: `tr-${i}`,
    title: `Deprecated ${lang} Snippet #${i}`,
    description: `Archived boilerplate utility script for ${lang}`,
    code: `// Archived code snippet #${i}\nconsole.log("Archived ${lang} snippet");`,
    language: lang,
    visibility: 'Public',
    views: 10 + i * 2,
    lines: 12 + i,
    fileSize: `${(0.9 + (i % 4) * 0.4).toFixed(1)} KB`,
    author: `dev_user_${i}`,
    createdAt: `${i} days ago`,
    deletedAt: `${i} days ago`,
    isTrashed: true
  });
}

const INITIAL_FOLDERS: FolderItem[] = [
  { id: 'f-1', name: 'DSA', color: 'amber', count: 8 },
  { id: 'f-2', name: 'Web Development', color: 'orange', count: 7 },
  { id: 'f-3', name: 'Database', color: 'blue', count: 5 },
  { id: 'f-4', name: 'Utils', color: 'purple', count: 4 },
  { id: 'f-5', name: 'DevOps', color: 'emerald', count: 4 }
];

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
}

const PasteContext = createContext<PasteContextType | undefined>(undefined);

export const PasteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [pastes, setPastes] = useState<Snippet[]>(INITIAL_PASTES);
  const [trashedPastes, setTrashedPastes] = useState<Snippet[]>(INITIAL_TRASH);
  const [folders, setFolders] = useState<FolderItem[]>(INITIAL_FOLDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [filterVisibility, setFilterVisibility] = useState('All');
  const [filterFolder, setFilterFolder] = useState('All');
  const [sortBy, setSortBy] = useState('Latest');
  const [selectedSnippetIds, setSelectedSnippetIds] = useState<string[]>([]);
  const [activeSnippet, setActiveSnippet] = useState<Snippet | null>(null);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  React.useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const logout = () => {
    setIsAuthenticated(false);
    showToast('Logged out successfully');
  };
  const [deleteModalSnippet, setDeleteModalSnippet] = useState<Snippet | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const createPaste = (
    title: string,
    language: string,
    visibility: VisibilityType,
    code?: string,
    folder?: string,
    description?: string
  ) => {
    const defaultCode = code || `// New ${language} paste created\n// Add your snippet logic here\n\nfunction main() {\n  console.log("Hello from ${title}");\n}\n\nmain();`;
    const lineCount = defaultCode.split('\n').length;

    const newSnippet: Snippet = {
      id: `pst-${Date.now().toString().slice(-4)}`,
      title: title || `Untitled ${language} Paste`,
      description: description || `Snippet created in ${language}`,
      code: defaultCode,
      language: language || 'JavaScript',
      visibility,
      views: 1,
      lines: lineCount,
      fileSize: `${(defaultCode.length / 1024).toFixed(1)} KB`,
      author: 'you (RA)',
      createdAt: 'Just now',
      lastOpened: 'Just now',
      folder: folder || 'Utils',
      tags: [language.toLowerCase()],
      isFavorite: false
    };

    setPastes(prev => [newSnippet, ...prev]);

    if (folder) {
      setFolders(prev => prev.map(f => f.name === folder ? { ...f, count: f.count + 1 } : f));
    }

    showToast(`Paste "${newSnippet.title}" published successfully!`);
  };

  // Move snippet to trash
  const deletePaste = (id: string) => {
    const target = pastes.find(p => p.id === id);
    if (target) {
      setPastes(prev => prev.filter(p => p.id !== id));
      setTrashedPastes(prev => [{ ...target, isTrashed: true, deletedAt: 'Just now' }, ...prev]);
      setSelectedSnippetIds(prev => prev.filter(i => i !== id));
      setDeleteModalSnippet(null);
      showToast(`Snippet "${target.title}" moved to Trash.`);
    }
  };

  const bulkDeletePastes = () => {
    const targets = pastes.filter(p => selectedSnippetIds.includes(p.id));
    setPastes(prev => prev.filter(p => !selectedSnippetIds.includes(p.id)));
    setTrashedPastes(prev => [
      ...targets.map(t => ({ ...t, isTrashed: true, deletedAt: 'Just now' })),
      ...prev
    ]);
    setSelectedSnippetIds([]);
    showToast(`Moved ${targets.length} snippets to Trash.`);
  };

  // Restore snippet from trash
  const restorePaste = (id: string) => {
    const target = trashedPastes.find(p => p.id === id);
    if (target) {
      setTrashedPastes(prev => prev.filter(p => p.id !== id));
      setPastes(prev => [{ ...target, isTrashed: false }, ...prev]);
      showToast(`Restored "${target.title}" to My Snippets.`);
    }
  };

  const bulkRestorePastes = (ids: string[]) => {
    const targets = trashedPastes.filter(p => ids.includes(p.id));
    setTrashedPastes(prev => prev.filter(p => !ids.includes(p.id)));
    setPastes(prev => [...targets.map(t => ({ ...t, isTrashed: false })), ...prev]);
    showToast(`Restored ${targets.length} snippets.`);
  };

  // Permanent Delete
  const permanentlyDeletePaste = (id: string) => {
    const target = trashedPastes.find(p => p.id === id);
    setTrashedPastes(prev => prev.filter(p => p.id !== id));
    showToast(`Permanently deleted "${target?.title || 'snippet'}".`);
  };

  const bulkPermanentlyDeletePastes = (ids: string[]) => {
    setTrashedPastes(prev => prev.filter(p => !ids.includes(p.id)));
    showToast(`Permanently deleted ${ids.length} snippets.`);
  };

  const emptyTrash = () => {
    const count = trashedPastes.length;
    setTrashedPastes([]);
    showToast(`Emptied trash (${count} items deleted).`);
  };

  const toggleFavorite = (id: string) => {
    setPastes(prev => prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
  };

  const addFolder = (name: string, color = 'purple') => {
    const newFolder: FolderItem = {
      id: `f-${Date.now()}`,
      name,
      color,
      count: 0
    };
    setFolders(prev => [...prev, newFolder]);
    showToast(`Folder "${name}" created.`);
  };

  return (
    <PasteContext.Provider
      value={{
        activeView,
        setActiveView,
        pastes,
        trashedPastes,
        folders,
        searchQuery,
        setSearchQuery,
        selectedLanguage,
        setSelectedLanguage,
        filterVisibility,
        setFilterVisibility,
        filterFolder,
        setFilterFolder,
        sortBy,
        setSortBy,
        selectedSnippetIds,
        setSelectedSnippetIds,
        activeSnippet,
        setActiveSnippet,
        isEditorModalOpen,
        setIsEditorModalOpen,
        theme,
        toggleTheme,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAuthenticated,
        setIsAuthenticated,
        logout,
        deleteModalSnippet,
        setDeleteModalSnippet,
        toastMessage,
        showToast,
        createPaste,
        deletePaste,
        bulkDeletePastes,
        restorePaste,
        permanentlyDeletePaste,
        emptyTrash,
        bulkRestorePastes,
        bulkPermanentlyDeletePastes,
        toggleFavorite,
        addFolder
      }}
    >
      {children}
    </PasteContext.Provider>
  );
};

export const usePastes = () => {
  const context = useContext(PasteContext);
  if (!context) throw new Error('usePastes must be used within PasteProvider');
  return context;
};
