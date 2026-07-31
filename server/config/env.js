import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from root directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

/**
 * Validate environment variables and export clean config object.
 */
export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // 1. OpenRouter AI
  openRouterKey: process.env.OPENROUTER_API_KEY || '',

  // 2. Hugging Face AI
  huggingFaceKey: process.env.HUGGINGFACE_API_KEY || '',

  // 3. Supabase DB & Auth
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',

  // 4. Cloudflare Turnstile
  turnstileSiteKey: process.env.TURNSTILE_SITE_KEY || '',
  turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY || '',

  // 5. Cloudflare R2 Object Storage
  r2Endpoint: process.env.R2_ENDPOINT || '',
  r2AccessKeyId: process.env.R2_ACCESS_KEY_ID || '',
  r2SecretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  r2BucketName: process.env.R2_BUCKET_NAME || 'pastebin-attachments'
};

/**
 * Helper to check if a service is properly configured
 */
export const isServiceConfigured = (serviceName) => {
  switch (serviceName) {
    case 'openrouter':
      return Boolean(config.openRouterKey && config.openRouterKey !== 'your_openrouter_key');
    case 'huggingface':
      return Boolean(config.huggingFaceKey && config.huggingFaceKey !== 'your_huggingface_key');
    case 'supabase':
      return Boolean(config.supabaseUrl && config.supabaseUrl !== 'your_supabase_url');
    case 'turnstile':
      return Boolean(config.turnstileSecretKey && config.turnstileSecretKey !== 'your_turnstile_secret_key');
    case 'r2':
      return Boolean(config.r2Endpoint && config.r2Endpoint !== 'your_r2_endpoint');
    default:
      return false;
  }
};
