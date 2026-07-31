import { config, isServiceConfigured } from '../config/env.js';

/**
 * Cloudflare Turnstile Service
 * Integration for: Protecting Authentication (Login/Registration) & Spam Prevention
 */
export class TurnstileService {
  /**
   * Verify Turnstile captcha token sent from client
   */
  static async verifyToken(token, clientIp = '') {
    if (!isServiceConfigured('turnstile')) {
      // Mock validation success when Turnstile keys are unconfigured in dev mode
      return { success: true, message: 'Turnstile unconfigured (Dev Mode Bypass)' };
    }

    if (!token) {
      return { success: false, message: 'Turnstile verification token is required' };
    }

    try {
      const formData = new URLSearchParams();
      formData.append('secret', config.turnstileSecretKey);
      formData.append('response', token);
      if (clientIp) formData.append('remoteip', clientIp);

      const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
      });

      const outcome = await response.json();

      if (outcome.success) {
        return { success: true, timestamp: outcome.challenge_ts };
      } else {
        return {
          success: false,
          message: 'Invalid captcha token or bot challenge failed',
          errorCodes: outcome['error-codes']
        };
      }
    } catch (err) {
      console.error('[Turnstile Verification Error]:', err.message);
      return { success: false, message: 'Turnstile service verification error' };
    }
  }
}
