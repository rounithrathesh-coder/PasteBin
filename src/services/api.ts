/**
 * PasteBin Enterprise API Client Service
 * Front-end API utility functions with error handling, loading states, and type safety.
 * Communicates with backend integrations: OpenRouter, Hugging Face, Supabase, Cloudflare Turnstile, and Cloudflare R2.
 */

export interface AIExplanationResult {
  explanation: string;
}

export interface AIOptimizationResult {
  optimization: string;
}

export interface AISummaryResult {
  summary: string;
}

export interface AITagsResult {
  tags: string[];
}

export interface LanguageDetectionResult {
  detectedLanguage: string;
  category: string;
}

export interface TurnstileResult {
  success: boolean;
  message?: string;
}

export interface R2BackupResult {
  message: string;
  archive: {
    success: boolean;
    fileUrl: string;
  };
}

class APIClient {
  private baseUrl = '/api';

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Request Failed (HTTP ${response.status})`);
      }

      return await response.json();
    } catch (err: any) {
      console.error(`[API Client Error] ${endpoint}:`, err.message);
      throw err;
    }
  }

  /* ─── 1. OpenRouter AI Services ─── */

  async explainCode(code: string, language?: string): Promise<string> {
    const data = await this.request<AIExplanationResult>('/ai/explain', {
      method: 'POST',
      body: JSON.stringify({ code, language })
    });
    return data.explanation;
  }

  async optimizeCode(code: string, language?: string): Promise<string> {
    const data = await this.request<AIOptimizationResult>('/ai/optimize', {
      method: 'POST',
      body: JSON.stringify({ code, language })
    });
    return data.optimization;
  }

  async summarizeCode(code: string, language?: string): Promise<string> {
    const data = await this.request<AISummaryResult>('/ai/summarize', {
      method: 'POST',
      body: JSON.stringify({ code, language })
    });
    return data.summary;
  }

  async generateTags(code: string, language?: string): Promise<string[]> {
    const data = await this.request<AITagsResult>('/ai/tags', {
      method: 'POST',
      body: JSON.stringify({ code, language })
    });
    return data.tags;
  }

  /* ─── 2. Hugging Face AI Services ─── */

  async detectLanguage(code: string): Promise<LanguageDetectionResult> {
    return this.request<LanguageDetectionResult>('/ai/detect-language', {
      method: 'POST',
      body: JSON.stringify({ code })
    });
  }

  /* ─── 3. Turnstile Captcha Verification ─── */

  async verifyTurnstileToken(token: string): Promise<TurnstileResult> {
    return this.request<TurnstileResult>('/auth/turnstile-verify', {
      method: 'POST',
      body: JSON.stringify({ token })
    });
  }

  /* ─── 4. Cloudflare R2 Export Storage ─── */

  async exportBackupArchive(): Promise<R2BackupResult> {
    return this.request<R2BackupResult>('/storage/export-backup', {
      method: 'POST'
    });
  }

  /* ─── 5. Pastes & Health REST API ─── */

  async fetchHealthStatus(): Promise<any> {
    return this.request('/health');
  }

  async fetchStats(): Promise<any> {
    return this.request('/stats');
  }

  async fetchPastes(query?: string, language?: string): Promise<any[]> {
    const params = new URLSearchParams();
    if (query) params.append('search', query);
    if (language) params.append('lang', language);
    return this.request(`/pastes?${params.toString()}`);
  }

  async createPaste(pasteData: {
    title: string;
    language: string;
    visibility: string;
    code?: string;
    folder?: string;
    description?: string;
  }): Promise<any> {
    return this.request('/pastes', {
      method: 'POST',
      body: JSON.stringify(pasteData)
    });
  }

  async deletePaste(id: string): Promise<any> {
    return this.request(`/pastes/${id}`, {
      method: 'DELETE'
    });
  }

  async restorePaste(id: string): Promise<any> {
    return this.request(`/trash/restore/${id}`, {
      method: 'POST'
    });
  }

  async emptyTrash(): Promise<any> {
    return this.request('/trash', {
      method: 'DELETE'
    });
  }
}

export const api = new APIClient();
