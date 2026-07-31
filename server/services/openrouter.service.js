import { config, isServiceConfigured } from '../config/env.js';

/**
 * OpenRouter AI Service
 * Integration for: Code Explanation, Code Optimization, Summarization, and Tag Generation
 */
export class OpenRouterService {
  /**
   * Helper to call OpenRouter Chat Completions API
   */
  static async queryAI(prompt, systemInstruction = 'You are a senior staff software engineer AI assistant for PasteBin.') {
    if (!isServiceConfigured('openrouter')) {
      // Mock AI response fallback when API key is not configured
      return this.getMockResponse(prompt);
    }

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.openRouterKey}`,
          'HTTP-Referer': 'https://pastebin.dev',
          'X-Title': 'PasteBin Enterprise Workspace',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3-70b-instruct',
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: prompt }
          ],
          temperature: 0.2,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || 'No AI response generated.';
    } catch (err) {
      console.error('[OpenRouter Error]:', err.message);
      return this.getMockResponse(prompt);
    }
  }

  /**
   * Explain Code snippet in detail
   */
  static async explainCode(code, language) {
    const prompt = `Analyze and explain the following ${language || 'code'} snippet cleanly with bullet points:\n\n\`\`\`${language}\n${code}\n\`\`\``;
    return this.queryAI(prompt, 'You provide concise, professional code explanations for developers.');
  }

  /**
   * Optimize Code snippet for performance & readability
   */
  static async optimizeCode(code, language) {
    const prompt = `Refactor and optimize the following ${language || 'code'} for optimal execution time, memory usage, and clean code best practices. Return the refactored code and a brief explanation:\n\n\`\`\`${language}\n${code}\n\`\`\``;
    return this.queryAI(prompt, 'You are an expert performance optimization engineer.');
  }

  /**
   * Summarize Code snippet in 1-2 sentences
   */
  static async summarizeCode(code, language) {
    const prompt = `Provide a 1-sentence summary of what this ${language || 'code'} does:\n\n\`\`\`${language}\n${code}\n\`\`\``;
    return this.queryAI(prompt, 'Summarize code concisely.');
  }

  /**
   * Generate relevant tags for code snippet
   */
  static async generateTags(code, language) {
    const prompt = `Generate 3 to 5 lowercase relevant tech tags for this ${language || 'code'} snippet as a comma-separated list (e.g. sorting, algorithm, python3):\n\n\`\`\`${language}\n${code}\n\`\`\``;
    const res = await this.queryAI(prompt, 'Output only comma-separated tags.');
    return res.split(',').map(t => t.trim().toLowerCase().replace(/[^a-z0-9-]/g, '')).filter(Boolean);
  }

  /**
   * Fallback mock generator when API key is unconfigured
   */
  static getMockResponse(prompt) {
    if (prompt.includes('explain')) {
      return `### Code Explanation\n- **Core Logic**: Implements an efficient algorithm with optimal time complexity.\n- **Data Structures**: Utilizes standard in-memory structures.\n- **Edge Cases**: Handles empty inputs and single-element edge cases gracefully.`;
    }
    if (prompt.includes('optimize')) {
      return `### Optimized Refactoring\n- **Improvements**: Replaced nested loops with hash map lookup (O(N) time complexity).\n- **Memory**: Reduced memory overhead by avoiding auxiliary array allocation.`;
    }
    if (prompt.includes('tag')) {
      return ['algorithm', 'performance', 'utils', 'clean-code'];
    }
    return 'Snippet performs data processing and input validation cleanly.';
  }
}
