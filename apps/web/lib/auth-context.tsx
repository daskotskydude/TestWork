'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { type User } from '@supabase/supabase-js';
import { useSupabase } from '@/../../packages/lib/useSupabase';
import type { Profile } from '@/../../packages/lib/supabaseClient';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, profileData: Partial<Profile>) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Ensure a newly registered user gets a profile row once a session exists
  const bootstrapProfileFromMetadata = async (supabaseUser: User) => {
    const metadata = supabaseUser.user_metadata ?? {};

    if (!metadata.role || !metadata.org_name) {
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: supabaseUser.id,
        email: supabaseUser.email!,
        role: metadata.role,
        org_name: metadata.org_name,
        phone: metadata.phone ?? null,
        address: metadata.address ?? null,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        const { data: existing } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', supabaseUser.id)
          .single();

        return (existing ?? null) as Profile | null;
      }

      throw error;
    }

    return data as Profile;
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!data) {
        const { data: authData } = await supabase.auth.getUser();
        const supabaseUser = authData.user ?? null;

        if (!supabaseUser) {
          setProfile(null);
          return;
        }

        try {
          const created = await bootstrapProfileFromMetadata(supabaseUser);
          setProfile(created);
        } catch (bootstrapError) {
          console.error('Error bootstrapping profile:', bootstrapError);
          setProfile(null);
        }
        return;
      }

      setProfile(data as Profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (
    email: string,
    password: string,
    profileData: Partial<Profile>
  ) => {
    // Sign up user
    if (!profileData.role || !profileData.org_name) {
      throw new Error('Missing required profile details');
    }

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: profileData.role,
          org_name: profileData.org_name,
          phone: profileData.phone ?? null,
          address: profileData.address ?? null,
        },
      },
    });

    if (signUpError) throw signUpError;
    if (!authData.user) throw new Error('No user returned from signup');

    // If Supabase auto-signs in the user, ensure the profile exists
    if (authData.session) {
      await fetchProfile(authData.user.id);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
