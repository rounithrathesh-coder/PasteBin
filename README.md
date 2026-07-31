<div align="center">

# 🔗 PasteBin — Enterprise Developer Platform & Code Workspace

An enterprise-grade Full Stack & DevOps code snippet management platform built with **React 18**, **TypeScript**, **Tailwind CSS**, and **Monaco Editor**. Inspired by the UI polish and developer experience of **GitHub**, **Supabase**, **Linear**, **VS Code**, **Vercel**, and **Datadog**.

![PasteBin Workspace Preview](./preview.png)

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.3-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Monaco Editor](https://img.shields.io/badge/Monaco_Editor-VS_Code_Engine-007ACC?style=flat-square&logo=visualstudiocode&logoColor=white)](https://microsoft.github.io/monaco-editor/)
[![License](https://img.shields.io/badge/License-MIT-purple?style=flat-square)](LICENSE)

</div>

---

## 🌟 Overview

**PasteBin** is a modern SaaS developer workspace designed for software engineers, DevOps teams, and technical leaders. It combines code snippet organization, community discovery, API documentation, webhook integrations, system infrastructure monitoring, and account management into a single, cohesive platform.

Built with strict design standards:
- 🎨 **Dark Theme Architecture** (`#0B1120`) with vibrant purple accents (`#7C3AED`)
- 💎 **Glassmorphism UI** with smooth 200ms micro-animations
- 📐 **Consistent 8px Grid System** with high information density
- ⚡ **VS Code Monaco Editor Engine** with syntax highlighting for 10+ languages

---

## 🚀 Complete Platform Features & Modules

### 1. 📊 Dashboard
- Live Developer Overview with real-time statistics cards
- Quick Create Paste card with inline syntax selector & public/private visibility
- Recent Pastes data table with instant quick actions (Copy, Share, Download, Edit)
- Widgets: Quick Actions, Favorite Snippets, and System Status

### 2. 📁 My Snippets (Library)
- Complete snippet management with Grid and List display modes
- Filter by Folders (DSA, Web Dev, Database, Utils, DevOps), Tags, Date, and Visibility
- ⌘K Global Search bar across titles, descriptions, code, tags, and authors
- Bulk selection, bulk delete operations, and inline 2-line code previews

### 3. ⭐ Favorites
- Dedicated Bookmarked Snippets repository
- Favorite Snippets sidebar widget for quick workspace navigation

### 4. 🗑️ Trash
- Soft-deletion recovery system with 30-day retention countdown
- Bulk restore and permanent deletion operations with empty trash confirmation modal
- Widgets: Items in Trash auto-delete countdown & Trash Activity log

### 5. 🌐 Public Pastes (Community)
- Community discovery hub inspired by Stack Overflow and GitHub Gists
- Verified Author badges, Star count (⭐), Like count (❤️), and Copy count (📋)
- Language Filter Chips with counts (`Python 312`, `JavaScript 284`, `HTML 198`, `SQL 156`, `C++ 98`)
- Widgets: Community Overview (18.7K pastes, 1.2K daily, 542 devs), Popular Languages donut chart, Featured Snippet of the Week, Top Contributors, and Trending Collections

### 6. 🔥 Trending
- GitHub Trending-inspired discovery engine (Trending Today, This Week, This Month)
- Gold (#1), Silver (#2), and Bronze (#3) ranking badges
- Right Sidebar: Developer of the Week, Top Contributors, Trending Languages, and Trending Tags

### 7. 🔑 API Docs & Keys (Developer Portal)
- Postman & Swagger UI-inspired developer portal
- Live API Key generation, masked key view, key regeneration, and copy functionality
- Multi-language Client Code Generator Tabs (`cURL`, `JavaScript`, `Python`, `Node.js`, `Go`)
- Interactive "Try It Out" API Playground with real-time JSON response viewer
- Daily API Rate Limit progress bar (`4,820 / 10,000 requests`) & Recent API Activity logs

### 8. 🔌 Integrations & Webhooks
- External developer tool connectors: GitHub Gists, VS Code Extension, Slack, Discord, Docker Engine, PasteBin CLI, Zapier, and Custom Webhooks
- Status indicators (`Connected` vs `Not Connected`), OAuth 2.0 configuration, and Webhook secret manager
- Connection History activity log

### 9. 🛰️ System Health (DevOps Dashboard)
- Grafana, Railway, and Datadog-inspired infrastructure monitoring
- Real-time CPU Load (24%), RAM Usage (3.8/8 GB), Disk Storage (2.34 GB), and Network I/O (14ms latency)
- Running Docker Containers table (`pastebin-api-v1`, `postgres-db-main`, `redis-cache-cluster`, `monaco-worker-pool`)
- Live Infrastructure logs stream & automated daily backup status

### 10. ⚙️ Preferences
- Appearance settings (Dark/Light/System theme, Purple/Emerald/Blue/Amber/Rose accent pickers)
- Monaco Editor settings (Font Size slider, 2/4 Tab Size, Auto Save, Word Wrap, Line Numbers, Minimap)
- Accessibility & Notification preferences
- Interactive Keyboard Shortcuts cheatsheet (`⌘K`, `⌘N`, `⌘S`, `⌘/`)

### 11. 👤 Account & Security
- GitHub Settings-inspired profile manager
- Profile information editor (Full Name, Username, Verified Email, Bio)
- Password update form & Two-Factor Authentication (2FA) status
- Data Management: Export Snippets Archive (ZIP/JSON) & Danger Zone account deletion modal
- Account Statistics widget (Member since Jan 2024, 28 Snippets, 142 Followers)

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Core** | React 18 with TypeScript 5.5 |
| **Build Tool** | Vite 5.3 (Lightning HMR) |
| **Styling Engine** | Tailwind CSS 3.4 + Vanilla CSS Tokens |
| **Code Editor** | Monaco Editor (`@monaco-editor/react`) |
| **Design System** | Google Material Symbols & Lucide Icons |
| **State Management** | React Context API |

---

## 📁 Directory Structure

```
src/
├── App.tsx                        # Main application layout & view router
├── main.tsx                       # React DOM entrypoint
├── index.css                      # Global design system & theme tokens
├── context/
│   └── PasteContext.tsx            # Global state management & storage
├── types/
│   └── paste.ts                   # TypeScript interfaces & types
└── components/
    ├── Navbar.tsx                  # Top navigation & global search
    ├── Sidebar.tsx                 # Left navigation sidebar
    ├── FooterStatusBar.tsx         # Bottom status bar
    ├── QuickCreateCard.tsx         # Quick paste publisher
    ├── StatsGrid.tsx               # Analytics statistics cards
    ├── RecentPastesTable.tsx       # Recent pastes table
    ├── TrendingPastes.tsx          # Trending snippets grid
    ├── QuickActionsPanel.tsx       # Quick actions sidebar widget
    ├── SystemStatusPanel.tsx       # Infrastructure health summary widget
    ├── MonacoEditorModal.tsx       # Fullscreen Monaco code editor modal
    ├── Favorites/                  # Favorites view & widgets
    ├── MySnippets/                 # My Snippets library table & widgets
    ├── Trash/                      # Soft-deletion recovery & widgets
    ├── PublicPastes/               # Community discovery & widgets
    ├── Trending/                   # GitHub Trending-style view & widgets
    ├── ApiDocs/                    # API keys & interactive playground
    ├── Integrations/               # Tool connectors & webhooks
    ├── SystemHealth/               # DevOps Grafana-style monitoring
    ├── Preferences/                # User preferences & editor settings
    └── Account/                    # Profile settings & security manager
```

---

## ⚡ Getting Started

### Prerequisites
- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### Quick Installation

```bash
# 1. Clone the repository
git clone https://github.com/rounithrathesh-coder/PasteBin.git
cd PasteBin

# 2. Install dependencies
npm install

# 3. Launch local development server
npm run dev
```

The app will be running at `http://localhost:3000`.

### Production Build

```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

**Crafted with ❤️ by [Rounith Arrun Rathesh](https://github.com/rounithrathesh-coder)**

</div>
