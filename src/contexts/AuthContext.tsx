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

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('🔄 Initializing authentication...');
        
        // Check if Supabase is configured
        const supabaseStatus = getSupabaseStatus();
        console.log('📊 Supabase status:', supabaseStatus);
        
        if (!supabaseStatus.isConfigured) {
          console.log('⚠️ Supabase not configured, setting loading to false');
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        // Get initial user
        console.log('👤 Getting current user...');
        const currentUser = await getCurrentUser();
        console.log('👤 Current user result:', currentUser ? 'User found' : 'No user');
        
        if (mounted) {
          setUser(currentUser as User);
          
          // For demo purposes, create a mock profile if user exists
          if (currentUser) {
            console.log('📝 Creating mock profile for user');
            const mockProfile: Profile = {
              id: currentUser.id,
              name: currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'Usuário',
              role: currentUser.email === 'admin@teste.com' ? 'admin' : 'student',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            setUserProfile(mockProfile);
          }
          
          console.log('✅ Auth initialization complete');
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Initialize immediately
    initializeAuth();

    // Listen for auth changes only if Supabase is configured
    const supabaseStatus = getSupabaseStatus();
    let subscription: any = null;

    if (supabaseStatus.isConfigured) {
      console.log('🔗 Setting up auth state listener...');
      const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('🔄 Auth state changed:', event, session?.user?.id);
          
          if (mounted) {
            if (session?.user) {
              setUser(session.user as User);
              // Create mock profile
              const mockProfile: Profile = {
                id: session.user.id,
                name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário',
                role: session.user.email === 'admin@teste.com' ? 'admin' : 'student',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              };
              setUserProfile(mockProfile);
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
      console.log('🧹 Cleaning up auth context...');
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
      console.log('🔐 Attempting sign in for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('❌ Sign in error:', error);
      } else {
        console.log('✅ Sign in successful');
      }
      
      return { data, error };
    } catch (err: any) {
      console.error('❌ Sign in exception:', err);
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
      console.log('📝 Attempting sign up for:', email);
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
        console.error('❌ Sign up error:', error);
      } else {
        console.log('✅ Sign up successful');
      }
      
      return { data, error };
    } catch (err: any) {
      console.error('❌ Sign up exception:', err);
      return {
        data: null,
        error: { message: err.message || 'Erro ao criar conta' }
      };
    }
  };

  const signOut = async () => {
    try {
      console.log('🚪 Signing out...');
      await supabase.auth.signOut();
      setUser(null);
      setUserProfile(null);
      console.log('✅ Sign out successful');
    } catch (err) {
      console.error('❌ Sign out error:', err);
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