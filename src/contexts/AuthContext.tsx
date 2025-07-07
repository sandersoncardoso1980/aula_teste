import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getCurrentUser, getSupabaseStatus } from '../lib/supabase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, name: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if Supabase is configured
    const supabaseStatus = getSupabaseStatus();
    
    if (!supabaseStatus.isConfigured) {
      setLoading(false);
      return;
    }

    // Get initial user
    getCurrentUser().then((user) => {
      setUser(user as User);
      setLoading(false);
    }).catch((error) => {
      console.error('Error getting initial user:', error);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          setUser(session.user as User);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const supabaseStatus = getSupabaseStatus();
    
    if (!supabaseStatus.isConfigured) {
      return {
        data: null,
        error: { message: 'Supabase não está configurado. Configure primeiro para fazer login.' }
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Sign in error:', error);
      }
      
      return { data, error };
    } catch (err: any) {
      console.error('Sign in exception:', err);
      return {
        data: null,
        error: { message: err.message || 'Erro ao fazer login' }
      };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    const supabaseStatus = getSupabaseStatus();
    
    if (!supabaseStatus.isConfigured) {
      return {
        data: null,
        error: { message: 'Supabase não está configurado. Configure primeiro para criar conta.' }
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
      
      if (error) {
        console.error('Sign up error:', error);
      }
      
      return { data, error };
    } catch (err: any) {
      console.error('Sign up exception:', err);
      return {
        data: null,
        error: { message: err.message || 'Erro ao criar conta' }
      };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};