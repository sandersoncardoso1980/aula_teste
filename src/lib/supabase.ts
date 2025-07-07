import { createClient } from '@supabase/supabase-js';

// Supabase configuration with fallback values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://placeholder.supabase.co' && 
         supabaseKey !== 'placeholder-key' &&
         supabaseUrl.includes('supabase.co');
};

export const supabase = createClient(supabaseUrl, supabaseKey);

// Authentication helpers with better error handling
export const signUp = async (email: string, password: string, name: string) => {
  if (!isSupabaseConfigured()) {
    return {
      data: null,
      error: { message: 'Supabase não está configurado. Clique em "Connect to Supabase" no canto superior direito.' }
    };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: 'student'
        }
      }
    });
    return { data, error };
  } catch (err: any) {
    return {
      data: null,
      error: { message: err.message || 'Erro ao criar conta' }
    };
  }
};

export const signIn = async (email: string, password: string) => {
  if (!isSupabaseConfigured()) {
    return {
      data: null,
      error: { message: 'Supabase não está configurado. Clique em "Connect to Supabase" no canto superior direito.' }
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  } catch (err: any) {
    return {
      data: null,
      error: { message: err.message || 'Erro ao fazer login' }
    };
  }
};

export const signOut = async () => {
  if (!isSupabaseConfigured()) {
    return { error: null }; // Allow sign out even if not configured
  }

  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (err: any) {
    return { error: { message: err.message || 'Erro ao sair' } };
  }
};

export const getCurrentUser = async () => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (err) {
    console.error('Error getting current user:', err);
    return null;
  }
};

// Export configuration status for UI feedback
export const getSupabaseStatus = () => ({
  isConfigured: isSupabaseConfigured(),
  url: supabaseUrl,
  hasValidKey: supabaseKey !== 'placeholder-key'
});