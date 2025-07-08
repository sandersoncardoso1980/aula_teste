import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getCurrentUser, getSupabaseStatus } from '../lib/supabase';
import { User, Profile } from '../types';

interface AuthContextType {
  user: User | null;
  userProfile: Profile | null;
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
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading user profile:', error);
        return null;
      }

      return profile;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Check if Supabase is configured
    const supabaseStatus = getSupabaseStatus();
    
    if (!supabaseStatus.isConfigured) {
      setLoading(false);
      return;
    }

    // Get initial user
    getCurrentUser().then(async (user) => {
      setUser(user as User);
      if (user) {
        const profile = await loadUserProfile(user.id);
        setUserProfile(profile);
      }
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
          const profile = await loadUserProfile(session.user.id);
          setUserProfile(profile);
        } else {
          setUser(null);
          setUserProfile(null);
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
      setUserProfile(null);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const value = {
    user,
    userProfile,
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