import { config, isServiceConfigured } from '../config/env.js';

/**
 * Hugging Face AI Service
 * Integration for: AI Code Classification, Language Detection, and Snippet Categorization
 */
export class HuggingFaceService {
  /**
   * Detect programming language of raw code snippet
   */
  static async detectLanguage(code) {
    if (!isServiceConfigured('huggingface')) {
      return this.detectLanguageFallback(code);
    }

    try {
      const response = await fetch(
        'https://api-inference.huggingface.co/models/Philomath/code-language-detection',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.huggingFaceKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ inputs: code.slice(0, 500) })
        }
      );

      if (!response.ok) {
        throw new Error(`HuggingFace API error HTTP ${response.status}`);
      }

      const data = await response.json();
      if (Array.isArray(data) && data[0]?.label) {
        return data[0].label;
      }
      return this.detectLanguageFallback(code);
    } catch (err) {
      console.error('[HuggingFace Error]:', err.message);
      return this.detectLanguageFallback(code);
    }
  }

  /**
   * Classify snippet category (e.g., Web Development, DSA, Database, DevOps, Utils)
   */
  static async classifyCategory(code, language) {
    const langLower = (language || '').toLowerCase();
    if (langLower.includes('sql') || code.toLowerCase().includes('select ') || code.toLowerCase().includes('create table')) {
      return 'Database';
    }
    if (langLower.includes('docker') || langLower.includes('bash') || code.toLowerCase().includes('sudo ') || code.toLowerCase().includes('systemctl')) {
      return 'DevOps';
    }
    if (code.toLowerCase().includes('def ') || code.toLowerCase().includes('function ') || code.toLowerCase().includes('class ')) {
      return 'DSA';
    }
    if (langLower.includes('html') || langLower.includes('css') || code.toLowerCase().includes('<div') || code.toLowerCase().includes('react')) {
      return 'Web Development';
    }
    return 'Utils';
  }

  /**
   * Fallback heuristic language detection
   */
  static detectLanguageFallback(code) {
    const c = code.toLowerCase();
    if (c.includes('def ') || c.includes('import numpy') || c.includes('print(')) return 'Python';
    if (c.includes('const ') || c.includes('let ') || c.includes('console.log')) return 'JavaScript';
    if (c.includes('select ') && c.includes('from ')) return 'SQL';
    if (c.includes('<html') || c.includes('<div') || c.includes('className=')) return 'HTML';
    if (c.includes('#include') || c.includes('std::cout')) return 'C++';
    if (c.includes('package main') || c.includes('func main()')) return 'Go';
    if (c.includes('sudo ') || c.includes('docker ')) return 'Bash';
    return 'JavaScript';
  }
}
