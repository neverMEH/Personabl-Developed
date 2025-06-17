import { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { PostgrestError } from '@supabase/supabase-js';
import { supabase, supabaseAdmin } from '../lib/supabase';
import type { Profile } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (provider: 'github' | 'google') => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | PostgrestError | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Debug flag to track auth flows
    const DEBUG_AUTH = true;
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (DEBUG_AUTH) console.log('Initial session check:', !!session, session?.user?.email);
      setUser(session?.user ?? null);
      if (session?.user) {
        if (DEBUG_AUTH) console.log('Fetching profile for session user:', session.user.id);
        fetchProfile(session.user.id);
      } else {
        if (DEBUG_AUTH) console.log('No session user, setting isLoading to false');
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (DEBUG_AUTH) console.log('Auth state changed:', event, !!session, session?.user?.email);
      setUser(session?.user ?? null);
      if (session?.user) {
        if (DEBUG_AUTH) console.log('Auth change - fetching profile for:', session.user.id);
        await fetchProfile(session.user.id);
      } else {
        if (DEBUG_AUTH) console.log('Auth change - no user, setting profile to null');
        setProfile(null);
        setIsLoading(false); // Ensure loading state is updated when logged out
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchProfile(userId: string) {
    // Add a safety timeout to ensure loading state is always updated
    const timeoutId = setTimeout(() => {
      console.log('🚨 Profile fetch timeout - forcing loading state to false');
      setIsLoading(false);
    }, 5000); // 5 second timeout
    
    try {
      console.log('Fetching profile for user ID:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        console.log('Setting isLoading to false due to profile fetch error');
        setIsLoading(false);
        return; // Return early on error
      }

      console.log('Profile fetched successfully:', data?.id);
      setProfile(data);
      
      // Manually trigger state update to ensure redirect happens
      setUser(currentUser => {
        console.log('Manually refreshing user state to trigger navigation');
        return currentUser; // Return same user to trigger state update
      });
    } catch (error) {
      console.error('Error handling profile fetch:', error);
      setIsLoading(false);
    } finally {
      clearTimeout(timeoutId); // Clear the timeout
      console.log('Setting isLoading to false after profile fetch');
      setIsLoading(false);
    }
  }

  async function signIn(provider: 'github' | 'google') {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      throw error;
    }
  }

  async function signInWithEmail(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  }

  async function signUp(email: string, password: string, fullName: string) {
    try {
      console.log('🔐 Starting signup process for:', email);
      
      // First sign up the user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName,
          }
        },
      });

      if (signUpError || !signUpData.user) {
        console.error('❌ Signup failed:', signUpError);
        return { error: signUpError };
      }

      console.log('✅ User signup successful, user ID:', signUpData.user.id);
      console.log('📧 Email confirmation required:', signUpData.user.email_confirmed_at === null);

      // Wait for auth state to be established
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Get current session to ensure we're authenticated
      const { data: { session } } = await supabase.auth.getSession();
      console.log('🔍 Current session after signup:', {
        user_id: session?.user?.id,
        role: session?.user?.role,
        email_confirmed: session?.user?.email_confirmed_at !== null,
        session_exists: !!session
      });

      // Create profile using service role to bypass RLS policies
      const profileData = {
        id: signUpData.user.id,
        email,
        full_name: fullName,
      };
      console.log('📝 Attempting to insert profile:', profileData);

      let profileError = null;

      if (supabaseAdmin) {
        console.log('🔄 Creating profile with service role client');
        const { error } = await supabaseAdmin.from('profiles').insert([profileData]);
        profileError = error;
        
        if (!error) {
          console.log('✅ Profile created successfully with service role');
          return { error: null };
        }
        
        console.error('❌ Profile creation failed with service role:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
      } else {
        console.warn('⚠️ Service role not configured, falling back to regular client with retries');
        
        // Fallback to regular client with multiple retries
        for (let i = 0; i < 3; i++) {
          console.log(`🔄 Profile creation attempt ${i + 1}/3 with regular client`);
          
          const { error } = await supabase.from('profiles').insert([profileData]);

          if (!error) {
            console.log('✅ Profile created successfully with regular client');
            return { error: null };
          }

          console.error(`❌ Profile creation attempt ${i + 1} failed:`, {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          });

          profileError = error;
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      if (profileError) {
        console.error('💥 All profile creation attempts failed:', profileError);
        // If all retries fail, clean up by signing out
        await supabase.auth.signOut();
      }

      return { error: profileError };
    } catch (err) {
      console.error('🚨 Unexpected signup error:', err);
      return { error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred', details: '' } as PostgrestError };
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function refreshProfile() {
    if (user) {
      await fetchProfile(user.id);
    }
  }

  const value = {
    user,
    profile,
    isLoading,
    signIn,
    signInWithEmail,
    signUp,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}