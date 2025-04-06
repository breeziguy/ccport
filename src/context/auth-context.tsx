'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { getUser, updateProfile } from '@/lib/auth';
import { UserProfile, UserSession } from '@/lib/types';

interface AuthContextType extends UserSession {
  signIn: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>;
  signUp: (email: string, password: string, name: string, phone: string, client_type: string, company_name: string) => Promise<{ success: boolean; error: string | null }>;
  signOut: () => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<{ success: boolean; error: string | null }>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<UserSession>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });
  
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClientComponentClient();
  
  const fetchUser = async () => {
    try {
      setSession(prev => ({ ...prev, isLoading: true, error: null }));
      
      console.log('Fetching user profile...');
      const { user, error } = await getUser();
      
      if (error) {
        console.warn('Error fetching user:', error);
        setSession({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error,
        });
        return { user: null, error };
      }
      
      console.log('User profile fetched:', user ? 'success' : 'no user');
      
      setSession({
        user,
        isLoading: false,
        isAuthenticated: !!user,
        error: null,
      });
      
      return { user, error: null };
    } catch (err) {
      console.error('Unexpected error in fetchUser:', err);
      setSession({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: 'Failed to authenticate user',
      });
      return { user: null, error: 'Failed to authenticate user' };
    }
  };
  
  useEffect(() => {
    fetchUser();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === 'SIGNED_IN') {
          fetchUser();
        } else if (event === 'SIGNED_OUT') {
          setSession({
            user: null,
            isLoading: false,
            isAuthenticated: false,
            error: null,
          });
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Redirect if not authenticated and trying to access protected routes
  useEffect(() => {
    // Skip during server-side rendering
    if (typeof window === 'undefined') return;
    
    const protectedRoutes = ['/clients', '/profile'];
    const isProtectedRoute = protectedRoutes.some(route => pathname?.startsWith(route));
    const isAuthRoute = pathname?.startsWith('/auth');
    const isProfileCompletionRoute = pathname?.startsWith('/profile/complete');
    
    // Avoid redirects when loading
    if (session.isLoading) {
      return;
    }
    
    console.log('Auth redirect check:', { 
      isAuthenticated: session.isAuthenticated, 
      pathname, 
      isProtectedRoute,
      isAuthRoute,
      isProfileCompletionRoute,
      user: session.user ? {
        id: session.user.id,
        profile_completed: session.user.profile_completed
      } : null
    });

    // Handle unauthenticated users trying to access protected routes
    if (!session.isAuthenticated && isProtectedRoute) {
      console.log('Redirecting unauthenticated user to login');
      router.push(`/auth/login?redirectedFrom=${encodeURIComponent(pathname || '')}`);
      return;
    }
    
    // Handle authenticated users on auth routes
    if (session.isAuthenticated && isAuthRoute) {
      console.log('Redirecting authenticated user from auth page to dashboard');
      router.push('/clients/dashboard');
      return;
    }
    
    // Handle authenticated users on home page
    if (session.isAuthenticated && pathname === '/') {
      console.log('Redirecting authenticated user from home to dashboard');
      router.push('/clients/dashboard');
      return;
    }
    
    // Handle profile completion check - only redirect if:
    // 1. User is authenticated
    // 2. Profile is explicitly marked as not completed
    // 3. User is not already on the profile completion page
    // 4. User is not on auth pages (to avoid redirect loops)
    if (
      session.isAuthenticated && 
      session.user && 
      session.user.profile_completed === false &&
      !isProfileCompletionRoute && 
      !isAuthRoute
    ) {
      console.log('Redirecting to profile completion');
      router.push('/profile/complete');
      return;
    }
  }, [session.isAuthenticated, session.isLoading, pathname, session.user, router]);
  
  const signIn = async (email: string, password: string) => {
    try {
      setSession(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        setSession(prev => ({ ...prev, isLoading: false, error: error.message }));
        return { success: false, error: error.message };
      }
      
      await fetchUser();
      return { success: true, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      setSession(prev => ({ ...prev, isLoading: false, error: 'An unexpected error occurred' }));
      return { success: false, error: 'An unexpected error occurred' };
    }
  };
  
  const signUp = async (email: string, password: string, name: string, phone: string, client_type: string = 'individual', company_name: string = '') => {
    try {
      setSession(prev => ({ ...prev, isLoading: true, error: null }));
      
      // First create the auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            name,
            phone
          }
        },
      });
      
      if (error) {
        setSession(prev => ({ ...prev, isLoading: false, error: error.message }));
        return { success: false, error: error.message };
      }
      
      // Then create the client profile record if user was created
      if (data.user) {
        const { error: profileError } = await supabase
          .from('client')
          .insert({
            id: data.user.id,
            name: client_type === 'company' ? company_name : name,
            contact_person_name: name,
            contact_person_email: email,
            contact_person_phone: phone,
            contact_person_address: '',
            entity_type: client_type,
            status: 'active'
          });
          
        if (profileError) {
          setSession(prev => ({ ...prev, isLoading: false, error: profileError.message }));
          return { success: false, error: profileError.message };
        }
      }
      
      await fetchUser();
      return { success: true, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      setSession(prev => ({ ...prev, isLoading: false, error: 'An unexpected error occurred' }));
      return { success: false, error: 'An unexpected error occurred' };
    }
  };
  
  const signOut = async () => {
    setSession(prev => ({ ...prev, isLoading: true }));
    await supabase.auth.signOut();
    setSession({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,
    });
    router.push('/auth/login');
  };
  
  const refreshUserProfile = async () => {
    await fetchUser();
  };
  
  const updateUserProfile = async (profile: Partial<UserProfile>) => {
    try {
      setSession(prev => ({ ...prev, isLoading: true }));
      
      const result = await updateProfile(profile);
      
      if (result.success) {
        // Refresh user data
        await fetchUser();
      } else {
        setSession(prev => ({ ...prev, isLoading: false, error: result.error }));
      }
      
      return result;
    } catch (error) {
      console.error('Error updating profile:', error);
      setSession(prev => ({ ...prev, isLoading: false, error: 'Failed to update profile' }));
      return { success: false, error: 'Failed to update profile' };
    }
  };
  
  const value = {
    ...session,
    signIn,
    signUp,
    signOut,
    updateUserProfile,
    refreshUserProfile,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}; 