import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  zip: string | null;
  country: string | null;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAdmin: boolean;
  loading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    isAdmin: false,
    loading: true,
  });

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    return data;
  }, []);

  const checkAdminRole = useCallback(async (userId: string): Promise<boolean> => {
    const { data, error } = await supabase
      .rpc('is_admin', { _user_id: userId });
    
    if (error) {
      console.error('Error checking admin role:', error);
      return false;
    }
    return data === true;
  }, []);

  useEffect(() => {
    // Set up auth state listener FIRST
    // CRITICAL: Never use async functions directly in onAuthStateChange callback
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Only synchronous state updates here
        const user = session?.user ?? null;
        
        setState(prev => ({
          ...prev,
          user,
          session,
          loading: !user, // Still loading if we need to fetch profile
        }));

        // Defer Supabase calls with setTimeout to prevent deadlock
        if (user) {
          setTimeout(async () => {
            const [profile, isAdmin] = await Promise.all([
              fetchProfile(user.id),
              checkAdminRole(user.id),
            ]);
            setState(prev => ({
              ...prev,
              profile,
              isAdmin,
              loading: false,
            }));
          }, 0);
        } else {
          setState(prev => ({
            ...prev,
            profile: null,
            isAdmin: false,
            loading: false,
          }));
        }
      }
    );

    // Then get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const user = session?.user ?? null;
      
      if (user) {
        const [profile, isAdmin] = await Promise.all([
          fetchProfile(user.id),
          checkAdminRole(user.id),
        ]);
        setState({
          user,
          session,
          profile,
          isAdmin,
          loading: false,
        });
      } else {
        setState({
          user: null,
          session: null,
          profile: null,
          isAdmin: false,
          loading: false,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile, checkAdminRole]);

  const signUp = async (email: string, password: string, metadata?: { firstName?: string; lastName?: string }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: metadata,
      },
    });
    
    if (error) throw error;
    return data;
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!state.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', state.user.id)
      .select()
      .single();

    if (error) throw error;
    
    setState(prev => ({ ...prev, profile: data }));
    return data;
  };

  const refreshProfile = async () => {
    if (!state.user) return;
    const profile = await fetchProfile(state.user.id);
    setState(prev => ({ ...prev, profile }));
  };

  return {
    ...state,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshProfile,
    isAuthenticated: !!state.user,
  };
}
