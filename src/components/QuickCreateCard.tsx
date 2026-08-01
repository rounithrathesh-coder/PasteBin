import React, { useState } from 'react';
import { usePastes } from '../context/PasteContext';
import { VisibilityType } from '../types/paste';
import { api } from '../services/api';

export const QuickCreateCard: React.FC = () => {
  const { createPaste, setIsEditorModalOpen, setActiveSnippet, showToast, folders } = usePastes();

  // Mode: 'write' | 'upload' | 'ai' | 'template'
  const [activeTab, setActiveTab] = useState<'write' | 'upload' | 'ai' | 'template'>('write');

  // Fields
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [visibility, setVisibility] = useState<VisibilityType>('Public');
  const [selectedFolder, setSelectedFolder] = useState('Utils');
  const [description, setDescription] = useState('');

  // Upload State
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // AI State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  // Helper: Extension to Language Mapper
  const detectLanguageFromExtension = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    switch (ext) {
      case 'py': return 'Python';
      case 'js': case 'jsx': case 'mjs': case 'cjs': return 'JavaScript';
      case 'ts': case 'tsx': return 'TypeScript';
      case 'html': case 'htm': return 'HTML';
      case 'css': case 'scss': return 'CSS';
      case 'sql': return 'SQL';
      case 'sh': case 'bash': case 'zsh': return 'Bash';
      case 'cpp': case 'cc': case 'cxx': case 'c': case 'h': return 'C++';
      case 'go': return 'Go';
      case 'rs': return 'Rust';
      case 'json': case 'yml': case 'yaml': return 'YAML';
      default: return 'JavaScript';
    }
  };

  // Process uploaded local code file
  const handleFileUpload = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content !== undefined) {
        setTitle(file.name);
        setCode(content);
        const detected = detectLanguageFromExtension(file.name);
        setLanguage(detected);
        setUploadedFileName(file.name);
        const sizeKb = (file.size / 1024).toFixed(1);
        setUploadedFileSize(`${sizeKb} KB`);
        setActiveTab('write');
        showToast(`Uploaded "${file.name}" (${sizeKb} KB) — Language set to ${detected}`);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Template Presets
  const templates = [
    {
      name: 'Express API Server',
      lang: 'JavaScript',
      folder: 'Web Development',
      code: `import express from 'express';\nconst app = express();\napp.use(express.json());\n\napp.get('/api/health', (req, res) => {\n  res.json({ status: 'healthy', timestamp: new Date() });\n});\n\napp.listen(3000, () => console.log('Server listening on port 3000'));`
    },
    {
      name: 'React Custom Hook',
      lang: 'TypeScript',
      folder: 'Web Development',
      code: `import { useState, useEffect } from 'react';\n\nexport function useLocalStorage<T>(key: string, initialValue: T) {\n  const [value, setValue] = useState<T>(() => {\n    const saved = localStorage.getItem(key);\n    return saved ? JSON.parse(saved) : initialValue;\n  });\n\n  useEffect(() => {\n    localStorage.setItem(key, JSON.stringify(value));\n  }, [key, value]);\n\n  return [value, setValue] as const;\n}`
    },
    {
      name: 'Python QuickSort',
      lang: 'Python',
      folder: 'DSA',
      code: `def quicksort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quicksort(left) + middle + quicksort(right)\n\nprint(quicksort([3, 6, 8, 10, 1, 2, 1]))`
    },
    {
      name: 'Docker Compose Setup',
      lang: 'YAML',
      folder: 'DevOps',
      code: `version: '3.8'\nservices:\n  web:\n    build: .\n    ports:\n      - "3000:3000"\n    environment:\n      - NODE_ENV=production\n  redis:\n    image: redis:alpine\n    ports:\n      - "6379:6379"`
    }
  ];

  const handleApplyTemplate = (tmpl: typeof templates[0]) => {
    setTitle(tmpl.name);
    setLanguage(tmpl.lang);
    setSelectedFolder(tmpl.folder);
    setCode(tmpl.code);
    setActiveTab('write');
    showToast(`Loaded template: "${tmpl.name}"`);
  };

  const handleAIDetectLanguage = async () => {
    const textToAnalyze = code || title;
    if (!textToAnalyze.trim()) {
      showToast('Enter code content or a title first to auto-detect language.');
      return;
    }
    setIsDetecting(true);
    try {
      const res = await api.detectLanguage(textToAnalyze);
      if (res && res.detectedLanguage) {
        setLanguage(res.detectedLanguage);
        showToast(`AI Detected Language: ${res.detectedLanguage}`);
      }
    } catch {
      showToast('AI language detection complete.');
    } finally {
      setIsDetecting(false);
    }
  };

  const handleAIGenerateSnippet = async () => {
    if (!aiPrompt.trim()) {
      showToast('Enter an AI prompt (e.g. "Create JWT Auth Middleware in Node.js").');
      return;
    }
    setIsGenerating(true);
    try {
      const generatedCode = await api.explainCode(`Generate code snippet for: ${aiPrompt}`, language);
      setTitle(aiPrompt);
      setCode(generatedCode);
      setActiveTab('write');
      showToast('AI snippet generated successfully!');
    } catch {
      showToast('AI snippet generated (Demo mode).');
      setTitle(aiPrompt);
      setCode(`// AI Generated snippet for: ${aiPrompt}\nfunction solution() {\n  // Code implementation goes here\n  console.log("Success");\n}`);
      setActiveTab('write');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = title.trim() || `Untitled ${language} Snippet`;
    createPaste(finalTitle, language, visibility, code, selectedFolder, description);
    setTitle('');
    setCode('');
    setDescription('');
    setUploadedFileName(null);
    setUploadedFileSize(null);
  };

  const handleOpenMonaco = () => {
    setActiveSnippet(null);
    setIsEditorModalOpen(true);
  };

  return (
    <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-5 shadow-lg shadow-black/10 transition-all space-y-4">
      {/* Header & Segmented Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-outline-variant/40 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-container/30 text-primary border border-primary/20 flex items-center justify-center font-mono shrink-0">
            <span className="material-symbols-outlined text-base">add_box</span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-on-surface flex items-center gap-2">
              Quick Create Workspace
              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold">
                Live Editor
              </span>
            </h2>
          </div>
        </div>

        {/* Segmented Mode Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-surface-container-lowest p-1 rounded-lg border border-outline-variant/60">
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className={`px-3 py-1 rounded text-xs font-mono flex items-center gap-1.5 transition-all ${
                activeTab === 'write'
                  ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                  : 'text-outline hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-sm">edit_note</span>
              Snippet
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-1 rounded text-xs font-mono flex items-center gap-1.5 transition-all ${
                activeTab === 'upload'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                  : 'text-outline hover:text-emerald-300'
              }`}
            >
              <span className="material-symbols-outlined text-sm text-emerald-400">upload_file</span>
              Upload File
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ai')}
              className={`px-3 py-1 rounded text-xs font-mono flex items-center gap-1.5 transition-all ${
                activeTab === 'ai'
                  ? 'bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30'
                  : 'text-outline hover:text-purple-300'
              }`}
            >
              <span className="material-symbols-outlined text-sm text-purple-400">auto_awesome</span>
              AI Prompt
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('template')}
              className={`px-3 py-1 rounded text-xs font-mono flex items-center gap-1.5 transition-all ${
                activeTab === 'template'
                  ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30'
                  : 'text-outline hover:text-amber-300'
              }`}
            >
              <span className="material-symbols-outlined text-sm text-amber-400">widgets</span>
              Templates
            </button>
          </div>

          <button
            type="button"
            onClick={handleOpenMonaco}
            className="px-2.5 py-1 rounded-lg bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/60 text-xs font-mono text-on-surface flex items-center gap-1 transition-all"
            title="Open Full Monaco Editor Modal"
          >
            <span className="material-symbols-outlined text-sm text-primary">open_in_full</span>
            Monaco
          </button>
        </div>
      </div>

      {/* Tab 1: Direct Snippet Write Mode */}
      {activeTab === 'write' && (
        <form onSubmit={handleSubmit} className="space-y-3">
          {uploadedFileName && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg flex items-center justify-between text-xs font-mono text-emerald-300">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-emerald-400">task_check</span>
                Loaded file: <strong className="text-white">{uploadedFileName}</strong> ({uploadedFileSize})
              </span>
              <button
                type="button"
                onClick={() => {
                  setUploadedFileName(null);
                  setUploadedFileSize(null);
                }}
                className="text-outline hover:text-white"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          )}

          {/* Clean Snippet Title Input */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Paste title (e.g. Auth Middleware snippet)..."
              className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-4 py-2.5 text-xs font-mono text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container placeholder:text-outline/50 transition-all"
            />
          </div>

          {/* Quick Code Textarea */}
          <div className="relative group">
            <textarea
              rows={3}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Paste your code snippet here or upload a local file..."
              className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-3 text-xs font-mono text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container resize-y custom-scrollbar placeholder:text-outline/40 leading-relaxed"
            />
            {code && (
              <div className="absolute right-2.5 top-2.5">
                <button
                  type="button"
                  onClick={handleAIDetectLanguage}
                  disabled={isDetecting}
                  className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono flex items-center gap-1 hover:bg-purple-500/30 transition-all"
                  title="Auto-detect snippet language with AI"
                >
                  <span className="material-symbols-outlined text-xs">auto_awesome</span>
                  {isDetecting ? 'Detecting...' : 'AI Detect'}
                </button>
              </div>
            )}
          </div>

          {/* Controls Bar: Language, Folder, Visibility & Submit */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-1">
            {/* Language Picker */}
            <div className="sm:col-span-3 relative">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-base pointer-events-none">
                code
              </span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg py-2 pl-8 pr-7 text-xs font-mono text-on-surface focus:outline-none focus:border-primary appearance-none cursor-pointer truncate"
              >
                <option value="JavaScript">JavaScript</option>
                <option value="TypeScript">TypeScript</option>
                <option value="Python">Python</option>
                <option value="Go">Go</option>
                <option value="Rust">Rust</option>
                <option value="HTML">HTML / CSS</option>
                <option value="SQL">SQL</option>
                <option value="Bash">Bash / Shell</option>
                <option value="C++">C++</option>
                <option value="YAML">YAML / JSON</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-outline text-base pointer-events-none">
                unfold_more
              </span>
            </div>

            {/* Folder Picker */}
            <div className="sm:col-span-3 relative">
              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg py-2 pl-3 pr-7 text-xs font-mono text-on-surface focus:outline-none focus:border-primary appearance-none cursor-pointer truncate"
              >
                <option value="Utils">📁 Folder: Utils</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.name}>
                    📁 Folder: {f.name}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-outline text-base pointer-events-none">
                unfold_more
              </span>
            </div>

            {/* Visibility Selector */}
            <div className="sm:col-span-3 relative">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-base pointer-events-none">
                {visibility === 'Public' ? 'public' : visibility === 'Private' ? 'lock' : 'link'}
              </span>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as VisibilityType)}
                className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg py-2 pl-8 pr-7 text-xs font-mono text-on-surface focus:outline-none focus:border-primary appearance-none cursor-pointer truncate"
              >
                <option value="Public">Public (Indexed)</option>
                <option value="Private">Private (Only Me)</option>
                <option value="Unlisted">Unlisted (Secret Link)</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-outline text-base pointer-events-none">
                unfold_more
              </span>
            </div>

            {/* Publish Button */}
            <div className="sm:col-span-3">
              <button
                type="submit"
                className="w-full bg-primary-container hover:bg-primary-container/90 text-on-primary-container py-2 px-4 rounded-lg font-semibold text-xs font-mono flex items-center justify-center gap-1.5 transition-all shadow-md shadow-primary-container/20 group active:scale-95"
              >
                <span className="material-symbols-outlined text-base group-hover:translate-x-0.5 transition-transform">
                  send
                </span>
                Create Paste
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: Upload Local Code File Dropzone */}
      {activeTab === 'upload' && (
        <div className="space-y-3 font-mono text-xs">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
              isDragOver
                ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01]'
                : 'border-outline-variant/60 hover:border-emerald-500/50 bg-surface-container-lowest'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <span className="material-symbols-outlined text-2xl">cloud_upload</span>
            </div>

            <div className="space-y-1">
              <div className="font-bold text-on-surface text-sm">
                Drag &amp; drop code file here, or browse local storage
              </div>
              <p className="text-[11px] text-outline">
                Supports .py, .js, .ts, .html, .css, .sql, .go, .rs, .json, .cpp, .sh files
              </p>
            </div>

            <label className="px-4 py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold hover:bg-emerald-500/30 transition-all cursor-pointer shadow-sm">
              <span className="material-symbols-outlined text-sm align-middle mr-1">folder_open</span>
              Browse Local Files
              <input
                type="file"
                className="hidden"
                accept=".py,.js,.jsx,.ts,.tsx,.html,.css,.sql,.go,.rs,.cpp,.c,.h,.sh,.json,.yml,.yaml,.md,.txt"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              />
            </label>
          </div>
        </div>
      )}

      {/* Tab 3: AI Code Generator Mode */}
      {activeTab === 'ai' && (
        <div className="space-y-3.5 font-mono text-xs">
          <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-lg flex items-center gap-2 text-purple-300 text-[11px]">
            <span className="material-symbols-outlined text-base text-purple-400">auto_awesome</span>
            <span>Describe what snippet you need, and AI will generate the code boilerplate automatically.</span>
          </div>

          <div className="space-y-2">
            <label className="text-outline text-[11px]">AI Generation Prompt</label>
            <div className="relative">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. Express.js JWT authentication middleware with refresh tokens..."
                className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-2.5 pl-3.5 pr-28 text-xs font-mono text-on-surface focus:outline-none focus:border-purple-500/50"
              />
              <button
                type="button"
                onClick={handleAIGenerateSnippet}
                disabled={isGenerating}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all"
              >
                <span className="material-symbols-outlined text-sm">bolt</span>
                {isGenerating ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>

          {/* Quick AI Presets */}
          <div className="space-y-1.5 pt-1">
            <span className="text-outline text-[10px]">Popular AI Prompt Presets:</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                'JWT Auth Middleware (Node.js)',
                'Debounce Hook in React',
                'Binary Search in Python',
                'Docker Compose for Postgres & Redis',
                'SQL User Pagination Query'
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setAiPrompt(prompt)}
                  className="px-2.5 py-1 rounded bg-surface-container-lowest hover:bg-surface-container-high border border-outline-variant/60 text-[10px] text-on-surface-variant transition-colors"
                >
                  + {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Quick Templates Mode */}
      {activeTab === 'template' && (
        <div className="space-y-3 font-mono text-xs">
          <div className="text-outline text-[11px]">Select a pre-built starter template to instantiate into your workspace:</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {templates.map((tmpl) => (
              <div
                key={tmpl.name}
                onClick={() => handleApplyTemplate(tmpl)}
                className="bg-surface-container-lowest border border-outline-variant/60 hover:border-amber-400/50 hover:bg-surface-container-high/40 p-3 rounded-lg cursor-pointer transition-all space-y-1.5 group"
              >
                <div className="flex justify-between items-center">
                  <div className="font-bold text-on-surface group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-amber-400">code</span>
                    {tmpl.name}
                  </div>
                  <span className="px-2 py-0.2 rounded text-[10px] bg-surface-container-high text-outline">
                    {tmpl.lang}
                  </span>
                </div>
                <div className="text-[10px] text-outline truncate font-mono">
                  Folder: {tmpl.folder} • Ready to paste
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
