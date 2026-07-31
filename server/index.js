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
import { requireAuth } from './middleware/auth.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

const app = express();
const PORT = config.port;

app.use(cors());
app.use(express.json());

// Helper DB Read/Write
const readDB = () => {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return { pastes: [], trash: [] };
  }
};

const writeDB = (db) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
};

/* ─── Health & Services Status Route ─── */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Healthy',
    service: 'PasteBin Enterprise API Engine',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    integrations: {
      openRouter: isServiceConfigured('openrouter') ? 'Configured' : 'Mock Mode (Dev)',
      huggingFace: isServiceConfigured('huggingface') ? 'Configured' : 'Mock Mode (Dev)',
      supabase: isServiceConfigured('supabase') ? 'Configured' : 'Local Persistence (JSON Store)',
      turnstile: isServiceConfigured('turnstile') ? 'Configured' : 'Mock Mode (Dev)',
      cloudflareR2: isServiceConfigured('r2') ? 'Configured' : 'Mock Storage (Dev)'
    }
  });
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
  res.json({
    totalPastes: db.pastes.length,
    totalViews: db.pastes.reduce((acc, p) => acc + (p.views || 0), 0),
    trashCount: db.trash.length,
    storageUsed: '2.34 GB / 10 GB',
    activeUsers: 542
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

  const defaultCode = code || `// New ${language || 'JavaScript'} snippet\nconsole.log("Hello from ${title}");`;
  const lineCount = defaultCode.split('\n').length;
  const finalLang = language || await HuggingFaceService.detectLanguage(defaultCode);

  const newSnippet = {
    id: `pst-${Date.now().toString().slice(-4)}`,
    title: title || `Untitled ${finalLang} Paste`,
    description: description || `Snippet created in ${finalLang}`,
    code: defaultCode,
    language: finalLang,
    visibility: visibility || 'Public',
    views: 1,
    lines: lineCount,
    fileSize: `${(defaultCode.length / 1024).toFixed(1)} KB`,
    author: 'you (RA)',
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

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 PasteBin Enterprise Backend running on http://localhost:${PORT}`);
  console.log(`⚡ Health check & Integrations status: http://localhost:${PORT}/api/health`);
});
