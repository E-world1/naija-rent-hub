
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userType: string | null;
  loading: boolean;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch user profile when user logs in
        if (session?.user) {
          setTimeout(async () => {
            try {
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('user_type')
                .eq('id', session.user.id)
                .single();
                
              if (error) {
                console.error('Error fetching user profile:', error);
                setUserType('renter'); // Default fallback
              } else {
                setUserType(profile?.user_type || 'renter');
              }
            } catch (error) {
              console.error('Error in profile fetch:', error);
              setUserType('renter');
            }
          }, 0);
        } else {
          setUserType(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Fetch user profile for existing session
        setTimeout(async () => {
          try {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('user_type')
              .eq('id', session.user.id)
              .single();
              
            if (error) {
              console.error('Error fetching user profile:', error);
              setUserType('renter');
            } else {
              setUserType(profile?.user_type || 'renter');
            }
          } catch (error) {
            console.error('Error in profile fetch:', error);
            setUserType('renter');
          }
          setLoading(false);
        }, 0);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: userData
        }
      });
      
      if (error) {
        toast.error('Sign up failed', {
          description: error.message
        });
      } else {
        toast.success('Account created successfully!', {
          description: 'Please check your email to verify your account.'
        });
      }
      
      return { error };
    } catch (error: any) {
      toast.error('Sign up failed', {
        description: error.message
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast.error('Sign in failed', {
          description: error.message
        });
      } else {
        toast.success('Welcome back!');
      }
      
      return { error };
    } catch (error: any) {
      toast.error('Sign in failed', {
        description: error.message
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setUserType(null);
      toast.success('Signed out successfully');
    } catch (error: any) {
      toast.error('Sign out failed', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    userType,
    loading,
    signUp,
    signIn,
    signOut,
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
