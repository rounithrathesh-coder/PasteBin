export type VisibilityType = 'Public' | 'Private' | 'Unlisted';
export type ViewType = 'dashboard' | 'my-snippets' | 'favorites' | 'trash' | 'public-pastes' | 'trending' | 'api-docs' | 'integrations' | 'system-health' | 'preferences' | 'account';

export interface Snippet {
  id: string;
  title: string;
  description?: string;
  code: string;
  language: string;
  visibility: VisibilityType;
  views: number;
  lines: number;
  fileSize?: string;
  author: string;
  createdAt: string;
  lastOpened?: string;
  folder?: string;
  tags?: string[];
  isFavorite?: boolean;
  isPinned?: boolean;
  isTrashed?: boolean;
  deletedAt?: string;
}

export interface FolderItem {
  id: string;
  name: string;
  color: string;
  count: number;
}

export interface SystemMetrics {
  apiStatus: 'Healthy' | 'Degraded' | 'Offline';
  dbStatus: 'Connected' | 'Disconnected';
  dockerContainers: string;
  storageUsed: string;
  storageTotal: string;
  storagePercent: number;
  recentCommit: string;
  lastBackup: string;
  latencyMs: number;
}
