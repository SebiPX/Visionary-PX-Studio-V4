import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { Profile } from '../lib/database.types';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    profile: Profile | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
    signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
    updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
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
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch user profile from database
    const fetchProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);
                return null;
            }

            return data as Profile;
        } catch (error) {
            console.error('Error in fetchProfile:', error);
            return null;
        }
    };

    // Refresh profile data
    const refreshProfile = async () => {
        if (user) {
            const profileData = await fetchProfile(user.id);
            setProfile(profileData);
        }
    };

    // Initialize auth state
    useEffect(() => {
        let mounted = true;

        console.log('🔐 Starting auth initialization...');

        // Shorter timeout since we know connection works
        const timeout = setTimeout(() => {
            if (mounted && loading) {
                console.warn('⚠️ Auth taking longer than expected, proceeding anyway...');
                setLoading(false);
            }
        }, 3000); // 3 second timeout

        // Get initial session
        supabase.auth.getSession()
            .then(({ data: { session }, error }) => {
                if (!mounted) return;

                if (error) {
                    console.error('Error getting session:', error);
                    setLoading(false);
                    return;
                }

                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    fetchProfile(session.user.id)
                        .then(profileData => {
                            if (mounted) {
                                setProfile(profileData);
                                setLoading(false);
                            }
                        })
                        .catch(err => {
                            console.error('Error fetching profile:', err);
                            if (mounted) setLoading(false);
                        });
                } else {
                    setLoading(false);
                }
            })
            .catch(err => {
                console.error('Error in getSession:', err);
                if (mounted) setLoading(false);
            });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!mounted) return;

            console.log('Auth event:', event);

            // Detect password recovery
            if (event === 'PASSWORD_RECOVERY') {
                sessionStorage.setItem('password_recovery', 'true');
            }

            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                const profileData = await fetchProfile(session.user.id);
                setProfile(profileData);
            } else {
                setProfile(null);
            }

            setLoading(false);
        });

        return () => {
            mounted = false;
            clearTimeout(timeout);
            subscription.unsubscribe();
        };
    }, []);

    // Sign in with email and password
    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { error };
    };

    // Sign up with email, password, and full name
    const signUp = async (email: string, password: string, fullName: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });
        return { error };
    };

    const signOut = async () => {
        // Step 1: Nuke all Supabase tokens from storage immediately (synchronous)
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('sb-')) localStorage.removeItem(key);
        });
        Object.keys(sessionStorage).forEach(key => {
            if (key.startsWith('sb-')) sessionStorage.removeItem(key);
        });

        // Step 2: Clear React state immediately
        setUser(null);
        setSession(null);
        setProfile(null);

        // Step 3: Fire API call in background (best-effort, we don't await)
        supabase.auth.signOut().catch(err => {
            console.warn("Background signOut API call failed (already cleared locally):", err);
        });

        // Step 4: Hard reload to reset all in-memory JS state
        window.location.replace('/');
    };

    // Reset password - sends email with reset link
    const resetPassword = async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: import.meta.env.VITE_APP_URL || 'http://localhost:3000',
        });
        return { error };
    };

    // Update password for authenticated user
    const updatePassword = async (newPassword: string) => {
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });
        return { error };
    };

    const value = {
        user,
        session,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
        resetPassword,
        updatePassword,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
