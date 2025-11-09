import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider?: 'email' | 'google';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize authentication and listen for auth changes
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await setUserFromSupabase(session.user);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔐 Auth state change:', event, session ? 'Session exists' : 'No session');
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('✅ User signed in, setting user data');
        await setUserFromSupabase(session.user);
      } else if (event === 'SIGNED_OUT') {
        console.log('👋 User signed out');
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Helper function to set user from Supabase user object
  const setUserFromSupabase = async (supabaseUser: SupabaseUser) => {
    try {
      // Try to get or create user profile from database
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const newProfile = {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          full_name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || '',
          avatar_url: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || null,
        };

        const { data: createdProfile, error: insertError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (!insertError && createdProfile) {
          setUser({
            id: createdProfile.id,
            email: createdProfile.email,
            name: createdProfile.full_name || '',
            picture: createdProfile.avatar_url || undefined,
            provider: supabaseUser.app_metadata?.provider || 'email',
          });
          return;
        }
      } else if (profile) {
        // Profile exists, use it
        setUser({
          id: profile.id,
          email: profile.email,
          name: profile.full_name || '',
          picture: profile.avatar_url || undefined,
          provider: supabaseUser.app_metadata?.provider || 'email',
        });
        return;
      }
    } catch (dbError) {
      // Database operations failed, use fallback
    }

    // Fallback: Create user object directly from Supabase user data
    setUser({
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
      picture: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || undefined,
      provider: supabaseUser.app_metadata?.provider || 'email',
    });
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('🔐 AuthContext: Starting login for:', email);
    setIsLoading(true);

    try {
      console.log('🔐 AuthContext: Calling Supabase signInWithPassword...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('🔐 AuthContext: Supabase response:', {
        hasUser: !!data.user,
        hasSession: !!data.session,
        hasError: !!error,
        errorMessage: error?.message,
        userConfirmed: data.user?.email_confirmed_at ? 'Yes' : 'No',
        userEmail: data.user?.email,
        sessionAccessToken: data.session?.access_token ? 'Present' : 'Missing'
      });

      if (error) {
        console.log('❌ AuthContext: Login error detected:', error.message);
        
        // Store specific error messages for the AuthModal
        if (error.message.includes('Email not confirmed')) {
          if (import.meta.env.DEV) {
            (window as any).loginError = 'Email confirmation is still enabled in Supabase. Please go to Authentication → Settings in your Supabase dashboard and uncheck "Enable email confirmations", then delete this user and sign up again.';
          } else {
            (window as any).loginError = 'Your email address needs to be confirmed. Please check your email for a confirmation link, or contact support if you need help.';
          }
        } else if (error.message.includes('Invalid login credentials')) {
          (window as any).loginError = 'The email or password you entered is incorrect. Please double-check your credentials and try again.';
        } else if (error.message.includes('Too many requests')) {
          (window as any).loginError = 'Too many login attempts. Please wait a few minutes before trying again.';
        } else if (error.message.includes('signup_disabled')) {
          (window as any).loginError = 'New signups are currently disabled. Please contact support for assistance.';
        } else if (error.message.includes('Email rate limit exceeded')) {
          (window as any).loginError = 'Too many email requests. Please wait before trying again.';
        } else {
          (window as any).loginError = `Sign in failed: ${error.message}`;
        }
        
        console.log('❌ AuthContext: Set error message:', (window as any).loginError);
        setIsLoading(false);
        return false;
      }

      if (data.user && data.session) {
        console.log('✅ AuthContext: Login successful, setting user data...');
        await setUserFromSupabase(data.user);
        setIsLoading(false);
        
        // Trigger a custom event that components can listen to for post-login actions
        window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: { user: data.user } }));
        
        return true;
      } else if (data.user && !data.session) {
        console.log('⚠️ AuthContext: User exists but no session (email confirmation needed)');
        (window as any).loginError = 'Your account exists but your email needs to be confirmed. Please check your email for a confirmation link.';
        setIsLoading(false);
        return false;
      }

      console.log('❌ AuthContext: Login failed - no user or session returned');
      setIsLoading(false);
      (window as any).loginError = 'Sign in failed for an unknown reason. Please try again or contact support if the problem persists.';
      return false;
    } catch (error: any) {
      console.error('❌ AuthContext: Login exception:', error);
      setIsLoading(false);
      if (error.message?.includes('fetch')) {
        (window as any).loginError = 'Unable to connect to the authentication service. Please check your internet connection and try again.';
      } else {
        (window as any).loginError = 'An unexpected error occurred during sign in. Please try again.';
      }
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        }
      });

      if (error) {
        setIsLoading(false);
        
        // Handle specific Supabase errors
        if (error.message.includes('User already registered')) {
          (window as any).signupError = 'An account with this email address already exists. Please use the sign in form instead, or try a different email address.';
        } else if (error.message.includes('Password should be at least')) {
          (window as any).signupError = 'Your password must be at least 6 characters long. Please choose a longer password.';
        } else if (error.message.includes('Invalid email')) {
          (window as any).signupError = 'Please enter a valid email address (e.g., user@example.com).';
        } else if (error.message.includes('signup_disabled')) {
          (window as any).signupError = 'New account creation is currently disabled. Please contact support for assistance.';
        } else if (error.message.includes('Email rate limit exceeded')) {
          (window as any).signupError = 'Too many signup attempts. Please wait a few minutes before trying again.';
        } else if (error.message.includes('Password is too weak')) {
          (window as any).signupError = 'Please choose a stronger password with a mix of letters, numbers, and symbols.';
        } else {
          (window as any).signupError = `Account creation failed: ${error.message}`;
        }
        
        return false;
      }

      if (data.user) {
        // Set user data regardless of email confirmation status
        await setUserFromSupabase(data.user);
        setIsLoading(false);
        
        // Trigger a custom event that components can listen to for post-signup actions
        window.dispatchEvent(new CustomEvent('userSignedUp', { detail: { user: data.user } }));
        
        return true;
      }

      setIsLoading(false);
      (window as any).signupError = 'Account creation failed for an unknown reason. Please try again or contact support if the problem persists.';
      return false;
    } catch (error: any) {
      setIsLoading(false);
      if (error.message?.includes('fetch')) {
        (window as any).signupError = 'Unable to connect to the authentication service. Please check your internet connection and try again.';
      } else {
        (window as any).signupError = 'An unexpected error occurred during account creation. Please try again.';
      }
      return false;
    }
  };



  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error.message);
      }
      
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};