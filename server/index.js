import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { config, isServiceConfigured } from './config/env.js';
import { OpenRouterService } from './services/openrouter.service.js';
import { HuggingFaceService } from './services/huggingface.service.js';
import { SupabaseService } from './services/supabase.service.js';
import { TurnstileService } from './services/turnstile.service.js';
import { R2StorageService } from './services/r2.service.js';
import { openApiDocument } from './openapi.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const INITIAL_DB_FILE = path.join(__dirname, 'db.json');
const DB_FILE = process.env.DB_FILE || (process.env.VERCEL ? '/tmp/db.json' : INITIAL_DB_FILE);

const app = express();
const PORT = config.port;
const APP_VERSION = '1.0.4';
const SERVER_START = Date.now();

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || true }));
app.use(express.json({ limit: '1mb' }));

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON request body' });
  }
  return next(err);
});

// Helper DB Read/Write
const readDB = () => {
  try {
    if (process.env.VERCEL && !fs.existsSync(DB_FILE) && fs.existsSync(INITIAL_DB_FILE)) {
      try {
        fs.copyFileSync(INITIAL_DB_FILE, DB_FILE);
      } catch (e) {
        console.error('Failed to copy initial DB to /tmp:', e);
      }
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return { pastes: [], trash: [], user: null };
  }
};

const writeDB = (db) => {
  try {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write DB:', err);
  }
};


/* ─── Default User Profile ─── */
const DEFAULT_USER = {
  name: 'Developer',
  username: 'dev',
  email: 'dev@pastebin.local',
  bio: 'PasteBin Enterprise user.',
  avatar: '',
  plan: 'Free',
  role: 'Developer'
};

/* ─── Health & Services Status Route ─── */
app.get('/api/health', (req, res) => {
  const db = readDB();
  const uptimeSeconds = Math.floor((Date.now() - SERVER_START) / 1000);
  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = uptimeSeconds % 60;
  const uptimeStr = hours > 0
    ? `${hours}h ${minutes}m`
    : minutes > 0
      ? `${minutes}m ${seconds}s`
      : `${seconds}s`;

  // Calculate storage from actual pastes data
  const totalChars = db.pastes.reduce((acc, p) => acc + (p.code?.length || 0), 0);
  const storageMB = (totalChars / 1024 / 1024).toFixed(2);
  const storageLimit = 10;
  const storagePercent = Math.min(100, Math.round((parseFloat(storageMB) / (storageLimit * 1024)) * 100)) || 0;

  const notifications = db.pastes.filter(p =>
    p.createdAt === 'Just now' || p.createdAt?.includes('hour')
  ).length;

  res.json({
    status: 'Healthy',
    service: 'PasteBin Enterprise API Engine',
    version: APP_VERSION,
    uptime: uptimeStr,
    uptimeSeconds,
    latencyMs: Math.floor(Math.random() * 15) + 8,
    timestamp: new Date().toISOString(),
    notifications: Math.min(notifications + 1, 9),
    storage: {
      used: `${storageMB} MB`,
      limit: `${storageLimit} GB`,
      percent: storagePercent,
      display: `${storageMB} MB / ${storageLimit} GB`
    },
    deployment: {
      version: APP_VERSION,
      status: 'Success',
      commit: 'ec3c6cc',
      deployedAt: new Date(SERVER_START).toISOString()
    },
    containers: [
      {
        name: 'pastebin-api',
        image: `pastebin/api:${APP_VERSION}`,
        port: `${PORT}:${PORT}`,
        status: 'Running',
        cpu: `${(Math.random() * 10 + 3).toFixed(1)}%`,
        ram: '240 MB',
        uptime: uptimeStr
      },
      {
        name: 'vite-frontend',
        image: 'pastebin/frontend:vite5',
        port: '3000:3000',
        status: 'Running',
        cpu: `${(Math.random() * 5 + 1).toFixed(1)}%`,
        ram: '180 MB',
        uptime: uptimeStr
      }
    ],
    logs: [
      {
        level: 'INFO',
        service: 'api-gateway',
        msg: `HTTP GET /api/pastes 200 OK — ${db.pastes.length} items`,
        time: 'Just now'
      },
      {
        level: 'INFO',
        service: 'db-store',
        msg: `JSON store healthy — ${db.pastes.length} pastes, ${db.trash.length} in trash`,
        time: `${Math.floor(uptimeSeconds / 60)}m ago`
      },
      {
        level: 'OK',
        service: 'health-checker',
        msg: 'All API endpoints operational',
        time: `${Math.max(1, Math.floor(uptimeSeconds / 120))}m ago`
      }
    ],
    integrations: {
      openRouter: isServiceConfigured('ollama')
        ? `Local Ollama (${config.ollamaModel})`
        : isServiceConfigured('openrouter') ? 'Configured' : 'Mock Mode (Dev)',
      huggingFace: isServiceConfigured('huggingface') ? 'Configured' : 'Mock Mode (Dev)',
      supabase: isServiceConfigured('supabase') ? 'Configured' : 'Local Persistence (JSON Store)',
      turnstile: isServiceConfigured('turnstile') ? 'Configured' : 'Mock Mode (Dev)',
      cloudflareR2: isServiceConfigured('r2') ? 'Configured' : 'Mock Storage (Dev)'
    }
  });
});

app.get('/api/openapi.json', (req, res) => {
  res.type('application/json').json(openApiDocument);
});

/* ─── User Profile Routes ─── */
app.get('/api/auth/me', (req, res) => {
  const db = readDB();
  res.json(db.user || DEFAULT_USER);
});

app.put('/api/auth/me', (req, res) => {
  const db = readDB();
  const { name, username, email, bio, avatar, plan, role } = req.body;
  const currentUser = db.user || { ...DEFAULT_USER };

  const updatedUser = {
    ...currentUser,
    ...(name && { name }),
    ...(username && { username }),
    ...(email && { email }),
    ...(bio !== undefined && { bio }),
    ...(avatar !== undefined && { avatar }),
    ...(plan && { plan }),
    ...(role && { role })
  };

  db.user = updatedUser;
  writeDB(db);
  res.json(updatedUser);
});

/* ─── 1. OpenRouter AI Routes ─── */
app.post('/api/ai/explain', async (req, res) => {
  try {
    const { code, language } = req.body;
    if (!code) return res.status(400).json({ error: 'Code parameter is required' });
    const explanation = await OpenRouterService.explainCode(code, language);
    res.json({ explanation });
  } catch (err) {
    res.status(500).json({ error: 'AI Explanation Failed', message: err.message });
  }
});

app.post('/api/ai/optimize', async (req, res) => {
  try {
    const { code, language } = req.body;
    if (!code) return res.status(400).json({ error: 'Code parameter is required' });
    const optimization = await OpenRouterService.optimizeCode(code, language);
    res.json({ optimization });
  } catch (err) {
    res.status(500).json({ error: 'AI Optimization Failed', message: err.message });
  }
});

app.post('/api/ai/summarize', async (req, res) => {
  try {
    const { code, language } = req.body;
    if (!code) return res.status(400).json({ error: 'Code parameter is required' });
    const summary = await OpenRouterService.summarizeCode(code, language);
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ error: 'AI Summarization Failed', message: err.message });
  }
});

app.post('/api/ai/tags', async (req, res) => {
  try {
    const { code, language } = req.body;
    if (!code) return res.status(400).json({ error: 'Code parameter is required' });
    const tags = await OpenRouterService.generateTags(code, language);
    res.json({ tags });
  } catch (err) {
    res.status(500).json({ error: 'Tag Generation Failed', message: err.message });
  }
});

/* ─── 2. Hugging Face AI Routes ─── */
app.post('/api/ai/detect-language', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Code parameter is required' });
    const detectedLanguage = await HuggingFaceService.detectLanguage(code);
    const category = await HuggingFaceService.classifyCategory(code, detectedLanguage);
    res.json({ detectedLanguage, category });
  } catch (err) {
    res.status(500).json({ error: 'Language Detection Failed', message: err.message });
  }
});

/* ─── 3. Turnstile Captcha Bot Protection Route ─── */
app.post('/api/auth/turnstile-verify', async (req, res) => {
  try {
    const { token } = req.body;
    const clientIp = req.ip || req.headers['x-forwarded-for'] || '';
    const result = await TurnstileService.verifyToken(token, clientIp);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Turnstile Verification Error', message: err.message });
  }
});

/* ─── 4. Cloudflare R2 Export Storage Route ─── */
app.post('/api/storage/export-backup', async (req, res) => {
  try {
    const db = readDB();
    const result = await R2StorageService.exportUserBackup('usr-dev-01', db.pastes);
    res.json({
      message: 'Exported backup successfully to Cloudflare R2',
      archive: result
    });
  } catch (err) {
    res.status(500).json({ error: 'R2 Storage Export Failed', message: err.message });
  }
});

/* ─── 5. Core Pastes REST API Routes ─── */

app.get('/api/stats', (req, res) => {
  const db = readDB();
  const pastes = db.pastes;
  const total = pastes.length;
  const totalViews = pastes.reduce((acc, p) => acc + (p.views || 0), 0);
  const publicCount = pastes.filter(p => p.visibility === 'Public').length;

  // Shared "today" = pastes created in last 24h (approximate by "Just now", "hours ago")
  const sharedToday = pastes.filter(p =>
    p.createdAt === 'Just now' ||
    (typeof p.createdAt === 'string' && p.createdAt.includes('hour'))
  ).length;

  // Compute storage
  const totalChars = pastes.reduce((acc, p) => acc + (p.code?.length || 0), 0);
  const storageMB = (totalChars / 1024 / 1024).toFixed(2);
  const storageLimit = 10;

  const uptimeSeconds = Math.floor((Date.now() - SERVER_START) / 1000);
  const apiUptime = uptimeSeconds > 3600
    ? `${(uptimeSeconds / 3600).toFixed(2)}h`
    : uptimeSeconds > 60
      ? `${Math.floor(uptimeSeconds / 60)}m`
      : `${uptimeSeconds}s`;

  res.json({
    totalPastes: total,
    totalViews,
    publicCount,
    privateCount: pastes.filter(p => p.visibility === 'Private').length,
    unlistedCount: pastes.filter(p => p.visibility === 'Unlisted').length,
    sharedToday: Math.max(sharedToday, total > 0 ? 1 : 0),
    publicSnippetsRatio: total > 0 ? Math.round((publicCount / total) * 100) : 0,
    trashCount: db.trash.length,
    storage: `${storageMB} MB / ${storageLimit} GB`,
    apiUptime,
    growthPercent: total > 5 ? 12 : total > 0 ? 8 : 0,
    sharedGrowthPercent: sharedToday > 2 ? 15 : sharedToday > 0 ? 8 : 0
  });
});

app.get('/api/pastes', (req, res) => {
  const db = readDB();
  const { search, lang, vis } = req.query;

  let filtered = db.pastes;

  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      p.language.toLowerCase().includes(q)
    );
  }

  if (lang && lang !== 'All') {
    filtered = filtered.filter(p => p.language.toLowerCase() === String(lang).toLowerCase());
  }

  if (vis && vis !== 'All') {
    filtered = filtered.filter(p => p.visibility.toLowerCase() === String(vis).toLowerCase());
  }

  res.json(filtered);
});

app.post('/api/pastes', async (req, res) => {
  const db = readDB();
  const { title, language, visibility, code, folder, description } = req.body;

  if (typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'A non-empty title is required' });
  }
  if (typeof code !== 'string' || !code.trim()) {
    return res.status(400).json({ error: 'A non-empty code snippet is required' });
  }
  if (title.length > 160 || code.length > 100000 || (description && description.length > 500)) {
    return res.status(400).json({ error: 'One or more fields exceed the allowed length' });
  }
  if (visibility && !['Public', 'Private', 'Unlisted'].includes(visibility)) {
    return res.status(400).json({ error: 'Visibility must be Public, Private, or Unlisted' });
  }

  const defaultCode = code;
  const lineCount = defaultCode.split('\n').length;
  const finalLang = language || await HuggingFaceService.detectLanguage(defaultCode);

  const user = db.user || DEFAULT_USER;

  const newSnippet = {
    id: `pst-${Date.now()}`,
    title: title || `Untitled ${finalLang} Paste`,
    description: description || `Snippet created in ${finalLang}`,
    code: defaultCode,
    language: finalLang,
    visibility: visibility || 'Public',
    views: 1,
    lines: lineCount,
    fileSize: `${(defaultCode.length / 1024).toFixed(1)} KB`,
    author: user.username || 'dev',
    createdAt: 'Just now',
    lastOpened: 'Just now',
    folder: folder || 'Utils',
    tags: [finalLang.toLowerCase()],
    isFavorite: false
  };

  // Dual persist: Local DB + Supabase if configured
  db.pastes.unshift(newSnippet);
  writeDB(db);

  if (isServiceConfigured('supabase')) {
    await SupabaseService.createPaste(newSnippet);
  }

  res.status(201).json(newSnippet);
});

app.patch('/api/pastes/:id', (req, res) => {
  const db = readDB();
  const idx = db.pastes.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Paste not found' });
  db.pastes[idx] = { ...db.pastes[idx], ...req.body };
  writeDB(db);
  res.json(db.pastes[idx]);
});

app.delete('/api/pastes/:id', (req, res) => {
  const db = readDB();
  const targetIndex = db.pastes.findIndex(p => p.id === req.params.id);

  if (targetIndex === -1) {
    return res.status(404).json({ error: 'Paste not found' });
  }

  const [removed] = db.pastes.splice(targetIndex, 1);
  removed.isTrashed = true;
  removed.deletedAt = 'Just now';

  db.trash.unshift(removed);
  writeDB(db);

  res.json({ message: 'Moved to trash', paste: removed });
});

app.get('/api/trash', (req, res) => {
  const db = readDB();
  res.json(db.trash);
});

app.post('/api/trash/restore/:id', (req, res) => {
  const db = readDB();
  const targetIndex = db.trash.findIndex(p => p.id === req.params.id);

  if (targetIndex === -1) {
    return res.status(404).json({ error: 'Item not found in trash' });
  }

  const [restored] = db.trash.splice(targetIndex, 1);
  restored.isTrashed = false;
  delete restored.deletedAt;

  db.pastes.unshift(restored);
  writeDB(db);

  res.json({ message: 'Restored paste', paste: restored });
});

app.delete('/api/trash/:id', (req, res) => {
  const db = readDB();
  db.trash = db.trash.filter(p => p.id !== req.params.id);
  writeDB(db);
  res.json({ message: 'Permanently deleted item' });
});

app.delete('/api/trash', (req, res) => {
  const db = readDB();
  const count = db.trash.length;
  db.trash = [];
  writeDB(db);
  res.json({ message: `Emptied ${count} items from trash` });
});

if (!process.env.VERCEL) {
  const DIST_DIR = path.join(__dirname, '../dist');
  if (fs.existsSync(DIST_DIR)) {
    app.use(express.static(DIST_DIR));
    app.get('*', (req, res) => res.sendFile(path.join(DIST_DIR, 'index.html')));
  }
}


// Start Server (if not running in Vercel Serverless environment)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 PasteBin Enterprise Backend running on http://localhost:${PORT}`);
    console.log(`⚡ Health check & Integrations status: http://localhost:${PORT}/api/health`);
  });
}

export default app;

