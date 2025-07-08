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

  const loadUserProfile = async (userId: string): Promise<Profile | null> => {
    try {
      // Check if Supabase is configured first
      const supabaseStatus = getSupabaseStatus();
      if (!supabaseStatus.isConfigured) {
        console.log('Supabase not configured, skipping profile load');
        return null;
      }

      console.log('Loading profile for user:', userId);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // If profile doesn't exist, that's okay - user might not have one yet
        if (error.code === 'PGRST116') {
          console.log('No profile found for user, this is normal for new users');
          return null;
        }
        console.error('Error loading user profile:', error);
        return null;
      }

      console.log('Profile loaded successfully:', profile);
      return profile;
    } catch (error) {
      console.error('Exception loading user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Check if Supabase is configured
        const supabaseStatus = getSupabaseStatus();
        
        if (!supabaseStatus.isConfigured) {
          console.log('Supabase not configured, setting loading to false');
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        // Get initial user
        console.log('Getting current user...');
        const currentUser = await getCurrentUser();
        
        if (mounted) {
          setUser(currentUser as User);
          
          if (currentUser) {
            console.log('User found, loading profile...');
            try {
              const profile = await loadUserProfile(currentUser.id);
              if (mounted) {
                setUserProfile(profile);
              }
            } catch (error) {
              console.error('Error loading profile:', error);
              // Continue without profile - don't block the app
              if (mounted) {
                setUserProfile(null);
              }
            }
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes only if Supabase is configured
    const supabaseStatus = getSupabaseStatus();
    let subscription: any = null;

    if (supabaseStatus.isConfigured) {
      const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.id);
          
          if (mounted) {
            if (session?.user) {
              setUser(session.user as User);
              try {
                const profile = await loadUserProfile(session.user.id);
                if (mounted) {
                  setUserProfile(profile);
                }
              } catch (error) {
                console.error('Error loading profile on auth change:', error);
                if (mounted) {
                  setUserProfile(null);
                }
              }
            } else {
              setUser(null);
              setUserProfile(null);
            }
            setLoading(false);
          }
        }
      );
      subscription = authSubscription;
    }

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
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