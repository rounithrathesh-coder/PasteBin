import React from 'react';
import { usePastes } from '../../context/PasteContext';

export const LandingView: React.FC = () => {
  const { setIsAuthModalOpen, setIsEditorModalOpen, setActiveView } = usePastes();

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col overflow-y-auto custom-scrollbar">
      {/* Top Unauthenticated Navigation Bar */}
      <nav className="sticky top-0 z-40 border-b border-outline-variant/40 bg-surface-container-lowest/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center shadow-md shadow-primary/30">
              <span className="material-symbols-outlined text-on-primary-container text-xl">terminal</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-on-surface text-base tracking-tight leading-none">PasteBin</span>
              <span className="text-[10px] font-mono text-outline leading-tight">Enterprise Workspace</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6 text-xs font-mono text-on-surface-variant">
            <a href="#features" className="hover:text-on-surface transition-colors">Features</a>
            <button onClick={() => setActiveView('public-pastes')} className="hover:text-on-surface transition-colors">Public Pastes</button>
            <button onClick={() => setActiveView('api-docs')} className="hover:text-on-surface transition-colors">API Docs</button>
            <button onClick={() => setActiveView('system-health')} className="hover:text-on-surface transition-colors">System Health</button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-4 py-2 rounded-xl border border-outline-variant/60 text-xs font-mono text-on-surface hover:border-primary-container hover:bg-surface-container-high transition-all"
            >
              Sign In
            </button>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-primary-container text-on-primary-container text-xs font-mono font-bold hover:brightness-110 transition-all shadow-md shadow-primary/20 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">rocket_launch</span>
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* Guest Mode Info Banner */}
      <div className="bg-gradient-to-r from-purple-900/40 via-primary/20 to-indigo-900/40 border-b border-primary/20 py-2 px-4 text-center">
        <p className="text-xs font-mono text-purple-300 flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-sm text-yellow-400">info</span>
          You are currently viewing PasteBin in <strong>Guest Mode (No Account Linked)</strong>. Sign in to access your personal dashboard & save snippets.
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="underline hover:text-white font-bold ml-1"
          >
            Sign In Now →
          </button>
        </p>
      </div>

      {/* Hero Section */}
      <section className="relative px-6 py-16 md:py-24 max-w-7xl mx-auto text-center space-y-8">
        {/* Glow ambient background element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-purple-300 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>PasteBin Enterprise v1.0 · Next-Gen Code Sharing Platform</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-on-surface leading-tight max-w-4xl mx-auto">
          The Enterprise Developer Platform for <span className="bg-gradient-to-r from-purple-400 via-primary to-indigo-400 bg-clip-text text-transparent">Code Snippets</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-on-surface-variant max-w-2xl mx-auto font-normal">
          Create, organize, share, and monitor code snippets with VS Code Monaco editor, AI generation, and instant REST APIs.
        </p>

        {/* CTA Button Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-6 py-3.5 rounded-xl bg-primary-container text-on-primary-container font-mono font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-primary/30 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">login</span>
            Sign In to Workspace
          </button>

          <button
            onClick={() => setIsEditorModalOpen(true)}
            className="px-6 py-3.5 rounded-xl bg-surface-container-high border border-outline-variant/60 text-on-surface font-mono font-semibold text-sm hover:bg-surface-container-highest transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">code</span>
            Try Monaco Code Editor
          </button>
        </div>

        {/* Hero Preview Card */}
        <div className="pt-8 max-w-5xl mx-auto">
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl overflow-hidden shadow-2xl text-left">
            {/* Window Chrome Header */}
            <div className="bg-surface-container-low px-4 py-3 border-b border-outline-variant/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                <span className="text-xs font-mono text-outline ml-2">quick_sort.py — Python Snippet</span>
              </div>
              <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">Monaco Engine</span>
            </div>

            {/* Code Block */}
            <div className="p-6 font-mono text-xs md:text-sm text-on-surface/90 space-y-1 bg-surface-container-lowest overflow-x-auto">
              <p><span className="text-purple-400 font-bold">def</span> <span className="text-blue-400">quick_sort</span>(arr):</p>
              <p className="pl-4"><span className="text-purple-400 font-bold">if</span> len(arr) &lt;= <span className="text-orange-400">1</span>: <span className="text-purple-400 font-bold">return</span> arr</p>
              <p className="pl-4">pivot = arr[len(arr) // <span className="text-orange-400">2</span>]</p>
              <p className="pl-4">left = [x <span className="text-purple-400 font-bold">for</span> x <span className="text-purple-400 font-bold">in</span> arr <span className="text-purple-400 font-bold">if</span> x &lt; pivot]</p>
              <p className="pl-4">middle = [x <span className="text-purple-400 font-bold">for</span> x <span className="text-purple-400 font-bold">in</span> arr <span className="text-purple-400 font-bold">if</span> x == pivot]</p>
              <p className="pl-4">right = [x <span className="text-purple-400 font-bold">for</span> x <span className="text-purple-400 font-bold">in</span> arr <span className="text-purple-400 font-bold">if</span> x &gt; pivot]</p>
              <p className="pl-4"><span className="text-purple-400 font-bold">return</span> quick_sort(left) + middle + quick_sort(right)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="py-16 px-6 max-w-7xl mx-auto space-y-12 border-t border-outline-variant/30">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold text-on-surface">Everything Developers Need</h2>
          <p className="text-sm text-on-surface-variant font-mono">Designed for high-throughput code organization & discovery.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-low border border-outline-variant/60 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">code</span>
            </div>
            <h3 className="text-base font-bold text-on-surface">Monaco Editor Engine</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Full VS Code editor experience with syntax highlighting for Python, JavaScript, TypeScript, HTML, SQL, Go, Rust, and C++.
            </p>
          </div>

          <div className="bg-surface-container-low border border-outline-variant/60 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">psychology</span>
            </div>
            <h3 className="text-base font-bold text-on-surface">AI Code Generation</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Integrated OpenRouter and HuggingFace models for auto-generating boilerplate code and auto-detecting programming languages.
            </p>
          </div>

          <div className="bg-surface-container-low border border-outline-variant/60 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">share</span>
            </div>
            <h3 className="text-base font-bold text-on-surface">Dedicated Share URLs</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Every snippet gets a clean public share URL at <code className="text-purple-300">/p/:id</code> with line-numbered display and copy actions.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Bar */}
      <footer className="mt-auto border-t border-outline-variant/40 py-8 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-outline">
          <div className="flex items-center gap-2">
            <span className="font-bold text-on-surface">PasteBin Enterprise</span>
            <span>© 2026 Developer Workspace</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsAuthModalOpen(true)} className="hover:text-on-surface">Sign In</button>
            <button onClick={() => setIsAuthModalOpen(true)} className="hover:text-on-surface">Create Account</button>
            <a href="https://github.com/rounithrathesh-coder/PasteBin" target="_blank" rel="noreferrer" className="hover:text-on-surface">GitHub Repo</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
