import React, { useState } from 'react';
import { usePastes } from '../../context/PasteContext';
import { ApiDocsWidgets } from './ApiDocsWidgets';

export const ApiDocsView: React.FC = () => {
  const { showToast } = usePastes();

  const [apiKey, setApiKey] = useState('pb_live_9f83a2b47c9d1e04a528f11c9');
  const [showKey, setShowKey] = useState(false);
  const [activeTab, setActiveTab] = useState<'curl' | 'js' | 'python' | 'node' | 'go'>('curl');
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('GET /v1/pastes');
  const [playgroundOutput, setPlaygroundOutput] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const endpoints = [
    { method: 'GET', path: '/v1/pastes', desc: 'List public & user code snippets', badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
    { method: 'POST', path: '/v1/pastes', desc: 'Create a new snippet', badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
    { method: 'GET', path: '/v1/pastes/{id}', desc: 'Retrieve snippet by ID', badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
    { method: 'PUT', path: '/v1/pastes/{id}', desc: 'Update existing snippet', badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
    { method: 'DELETE', path: '/v1/pastes/{id}', desc: 'Soft-delete snippet', badge: 'bg-red-500/15 text-red-300 border-red-500/30' }
  ];

  const codeExamples = {
    curl: `curl -X GET "https://api.pastebin.dev/v1/pastes" \\\n  -H "Authorization: Bearer ${apiKey}" \\\n  -H "Content-Type: application/json"`,
    js: `fetch("https://api.pastebin.dev/v1/pastes", {\n  headers: {\n    "Authorization": "Bearer ${apiKey}",\n    "Content-Type": "application/json"\n  }\n})\n.then(res => res.json())\n.then(data => console.log(data));`,
    python: `import requests\n\nheaders = {"Authorization": "Bearer ${apiKey}"}\nresponse = requests.get("https://api.pastebin.dev/v1/pastes", headers=headers)\nprint(response.json())`,
    node: `const axios = require('axios');\n\nconst response = await axios.get('https://api.pastebin.dev/v1/pastes', {\n  headers: { 'Authorization': 'Bearer ${apiKey}' }\n});\nconsole.log(response.data);`,
    go: `package main\nimport ("fmt"; "net/http"; "io")\nfunc main() {\n  req, _ := http.NewRequest("GET", "https://api.pastebin.dev/v1/pastes", nil)\n  req.Header.Set("Authorization", "Bearer ${apiKey}")\n  resp, _ := http.DefaultClient.Do(req)\n  body, _ := io.ReadAll(resp.Body)\n  fmt.Println(string(body))\n}`
  };

  const sampleResponse = `{\n  "status": "success",\n  "page": 1,\n  "limit": 10,\n  "total": 1248,\n  "data": [\n    {\n      "id": "pst-01",\n      "title": "Quick sort in Python",\n      "language": "Python",\n      "visibility": "Public",\n      "views": 128,\n      "lines": 28,\n      "author": "coder_07",\n      "created_at": "2026-07-31T05:30:00Z"\n    }\n  ]\n}`;

  const handleRegenerateKey = () => {
    const newKey = `pb_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 10)}`;
    setApiKey(newKey);
    showToast('Regenerated API Key successfully!');
  };

  const handleTryItOut = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setPlaygroundOutput(`HTTP/1.1 200 OK\nContent-Type: application/json\nX-RateLimit-Remaining: 998\n\n${sampleResponse}`);
      showToast('Executed API Playground Request!');
    }, 400);
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 space-y-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-1 border-b border-outline-variant/40 pb-5">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-on-surface flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-3xl">api</span>
              API Docs &amp; Keys
            </h1>
            <p className="text-sm text-on-surface-variant">
              Manage your API credentials, test endpoints in real-time, and integrate PasteBin REST API.
            </p>
          </div>

          {/* API Keys Management Card */}
          <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/50 pb-3">
              <div>
                <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-400 text-base">key</span>
                  Production API Key
                </h3>
                <p className="text-xs text-outline font-mono">Use this key to authenticate REST requests from server environments.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRegenerateKey}
                  className="px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-xs font-mono font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">refresh</span> Regenerate
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(apiKey);
                    showToast('Copied API Key to clipboard!');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container text-xs font-semibold hover:brightness-110 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">content_copy</span> Copy Key
                </button>
              </div>
            </div>

            {/* Masked Key Display */}
            <div className="flex items-center justify-between bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-3 font-mono text-xs">
              <span className="text-purple-300 font-bold tracking-wider">
                {showKey ? apiKey : `${apiKey.slice(0, 10)}••••••••••••••••••••${apiKey.slice(-5)}`}
              </span>
              <button
                onClick={() => setShowKey(!showKey)}
                className="text-outline hover:text-on-surface text-xs flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-base">{showKey ? 'visibility_off' : 'visibility'}</span>
                <span>{showKey ? 'Hide' : 'Reveal'}</span>
              </button>
            </div>

            {/* Usage Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-outline">Daily Usage Quota</span>
                <span className="text-on-surface font-semibold">4,820 / 10,000 requests (48%)</span>
              </div>
              <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[48%] rounded-full transition-all"></div>
              </div>
            </div>
          </div>

          {/* Interactive Endpoints & Code Examples */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Endpoints List */}
            <div className="lg:col-span-5 bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-3 shadow-sm">
              <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider border-b border-outline-variant/50 pb-2.5">
                Endpoints Directory
              </h3>

              <div className="space-y-2">
                {endpoints.map((ep) => {
                  const key = `${ep.method} ${ep.path}`;
                  const isSelected = selectedEndpoint === key;

                  return (
                    <div
                      key={key}
                      onClick={() => setSelectedEndpoint(key)}
                      className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-primary/10 border-primary/50 shadow-sm'
                          : 'bg-surface-container-lowest border-outline-variant/40 hover:border-outline'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-mono">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${ep.badge}`}>
                          {ep.method}
                        </span>
                        <span className="font-bold text-on-surface truncate">{ep.path}</span>
                      </div>
                      <p className="text-[11px] text-outline mt-1">{ep.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Code Snippets & Playground */}
            <div className="lg:col-span-7 bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2.5">
                  <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">
                    Code Generator — {selectedEndpoint}
                  </h3>

                  {/* Tabs */}
                  <div className="flex items-center gap-1 bg-surface-container-lowest p-1 rounded-lg border border-outline-variant/50 text-[11px] font-mono">
                    {(['curl', 'js', 'python', 'node', 'go'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-2 py-0.5 rounded capitalize transition-all ${
                          activeTab === tab
                            ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                            : 'text-outline hover:text-on-surface'
                        }`}
                      >
                        {tab === 'curl' ? 'cURL' : tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Snippet Block */}
                <div className="mt-3 relative group">
                  <pre className="bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-4 font-mono text-xs text-purple-200 overflow-x-auto custom-scrollbar">
                    {codeExamples[activeTab]}
                  </pre>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(codeExamples[activeTab]);
                      showToast('Copied code example!');
                    }}
                    className="absolute right-3 top-3 p-1.5 bg-surface-container-high border border-outline-variant/60 rounded text-outline hover:text-on-surface opacity-80 group-hover:opacity-100 transition-opacity"
                    title="Copy code"
                  >
                    <span className="material-symbols-outlined text-sm">content_copy</span>
                  </button>
                </div>
              </div>

              {/* API Playground Try It Out */}
              <div className="border-t border-outline-variant/50 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-emerald-400 text-sm">play_arrow</span>
                    API Playground
                  </h4>

                  <button
                    onClick={handleTryItOut}
                    disabled={isExecuting}
                    className="px-4 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-sm">send</span>
                    {isExecuting ? 'Sending...' : 'Send Request'}
                  </button>
                </div>

                {playgroundOutput && (
                  <pre className="bg-surface-container-lowest border border-emerald-500/30 rounded-lg p-3 font-mono text-[11px] text-emerald-300 overflow-x-auto custom-scrollbar max-h-48 animate-fade-in">
                    {playgroundOutput}
                  </pre>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Right Sidebar Widgets */}
      <aside className="w-80 border-l border-outline-variant/60 shrink-0 overflow-y-auto custom-scrollbar bg-surface-container-lowest p-5 space-y-6">
        <ApiDocsWidgets />
      </aside>
    </div>
  );
};
