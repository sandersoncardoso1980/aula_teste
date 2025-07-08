import { createClient } from '@supabase/supabase-js';

// Supabase configuration with fallback values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  const isConfigured = supabaseUrl !== 'https://placeholder.supabase.co' && 
         supabaseKey !== 'placeholder-key' &&
         supabaseUrl.includes('supabase.co') &&
         supabaseUrl.length > 30 &&
         supabaseKey.length > 30;
  
  console.log('🔍 Supabase configuration check:', {
    url: supabaseUrl.substring(0, 30) + '...',
    keyLength: supabaseKey.length,
    isConfigured
  });
  
  return isConfigured;
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
    console.log('⚠️ Supabase not configured, returning null user');
    return null;
  }

  try {
    console.log('🔍 Getting current user from Supabase...');
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('❌ Error getting user:', error);
      return null;
    }
    
    console.log('👤 Current user result:', user ? `User found: ${user.email}` : 'No user');
    return user;
  } catch (err) {
    console.error('❌ Exception getting current user:', err);
    return null;
  }
};

// Export configuration status for UI feedback
export const getSupabaseStatus = () => {
  const isConfigured = isSupabaseConfigured();
  return {
    isConfigured,
    url: supabaseUrl,
    hasValidKey: supabaseKey !== 'placeholder-key',
    urlLength: supabaseUrl.length,
    keyLength: supabaseKey.length
  };
};