import { createClient } from '@supabase/supabase-js';
import { config, isServiceConfigured } from '../config/env.js';

/**
 * Supabase Backend Service
 * Integration for: PostgreSQL Database, User Authentication, and Service Role Authorization
 * IMPORTANT: Service Role Key is used strictly on the backend and NEVER exposed to frontend.
 */
let supabaseBackendClient = null;

if (isServiceConfigured('supabase')) {
  try {
    // Initialize Supabase Admin client with Service Role Key for backend administration
    supabaseBackendClient = createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    console.log('⚡ Supabase Backend Admin Client initialized successfully');
  } catch (err) {
    console.error('Supabase initialization error:', err.message);
  }
}

export class SupabaseService {
  /**
   * Verify JWT bearer token from user request using Supabase Auth
   */
  static async verifyUserToken(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    const token = authHeader.split(' ')[1];

    if (!supabaseBackendClient) {
      // Mock authenticated user object for local dev testing
      return { id: 'usr-dev-01', email: 'rounith.rathesh@example.com', role: 'developer' };
    }

    try {
      const { data: { user }, error } = await supabaseBackendClient.auth.getUser(token);
      if (error || !user) return null;
      return user;
    } catch (err) {
      console.error('[Supabase Auth Error]:', err.message);
      return null;
    }
  }

  /**
   * Fetch user pastes from Supabase PostgreSQL table
   */
  static async fetchPastes(userId) {
    if (!supabaseBackendClient) return null;

    try {
      const { data, error } = await supabaseBackendClient
        .from('pastes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('[Supabase DB Query Error]:', err.message);
      return null;
    }
  }

  /**
   * Insert new paste into Supabase PostgreSQL table
   */
  static async createPaste(pasteData) {
    if (!supabaseBackendClient) return null;

    try {
      const { data, error } = await supabaseBackendClient
        .from('pastes')
        .insert([pasteData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('[Supabase Insert Error]:', err.message);
      return null;
    }
  }
}
