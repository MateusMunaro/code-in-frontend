import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@shared/lib/supabase';
import type { User, AuthState } from '@shared/types';

// Constants for localStorage keys
const GITHUB_TOKEN_KEY = 'code-in-github-token';

// Helper to get/set github token from localStorage
const saveGitHubToken = (token: string | undefined) => {
  if (token) {
    localStorage.setItem(GITHUB_TOKEN_KEY, token);
    console.log('[Auth] Saved GitHub token to localStorage');
  }
};

const getStoredGitHubToken = (): string | undefined => {
  const token = localStorage.getItem(GITHUB_TOKEN_KEY);
  return token || undefined;
};

const clearGitHubToken = () => {
  localStorage.removeItem(GITHUB_TOKEN_KEY);
  console.log('[Auth] Cleared GitHub token from localStorage');
};

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<{ error?: string }>;
  loginWithGitHub: () => Promise<{ error?: string }>;
  signup: (email: string, password: string, fullName?: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        });
      },

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            set({ isLoading: false });
            return { error: error.message };
          }

          if (data.user) {
            const user: User = {
              id: data.user.id,
              email: data.user.email!,
              created_at: data.user.created_at,
              user_metadata: data.user.user_metadata,
            };
            set({ user, isAuthenticated: true, isLoading: false });
          }

          return {};
        } catch (err) {
          set({ isLoading: false });
          return { error: 'Erro ao fazer login. Tente novamente.' };
        }
      },

      loginWithGitHub: async () => {
        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
              redirectTo: `${window.location.origin}/app`,
              scopes: 'read:user user:email repo',
            },
          });

          if (error) {
            console.error('GitHub OAuth error:', error);
            return { error: error.message };
          }

          // OAuth will redirect automatically, no need to return anything
          return {};
        } catch (err) {
          console.error('GitHub OAuth exception:', err);
          return { error: 'Erro ao conectar com GitHub. Tente novamente.' };
        }
      },

      signup: async (email, password, fullName) => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
              },
            },
          });

          if (error) {
            set({ isLoading: false });
            return { error: error.message };
          }

          if (data.user) {
            const user: User = {
              id: data.user.id,
              email: data.user.email!,
              created_at: data.user.created_at,
              user_metadata: data.user.user_metadata,
            };
            set({ user, isAuthenticated: true, isLoading: false });
          }

          return {};
        } catch (err) {
          set({ isLoading: false });
          return { error: 'Erro ao criar conta. Tente novamente.' };
        }
      },

      logout: async () => {
        await supabase.auth.signOut();
        clearGitHubToken(); // Clear stored GitHub token on logout
        set({ user: null, isAuthenticated: false });
      },

      checkSession: async () => {
        set({ isLoading: true });
        try {
          const { data: { session } } = await supabase.auth.getSession();
          const storedToken = getStoredGitHubToken();
          
          console.log('[Auth] checkSession - provider_token:', session?.provider_token ? '✓ present' : '✗ missing');
          console.log('[Auth] checkSession - stored github_token:', storedToken ? '✓ present' : '✗ missing');
          
          if (session?.user) {
            // Use provider_token from session (available only on OAuth callback) OR stored token from localStorage
            const github_token = session.provider_token ?? storedToken;
            console.log('[Auth] checkSession - final github_token:', github_token ? '✓ present' : '✗ missing');
            
            // Save token to localStorage if we got it from the session
            if (session.provider_token) {
              saveGitHubToken(session.provider_token);
            }
            
            const user: User = {
              id: session.user.id,
              email: session.user.email!,
              created_at: session.user.created_at,
              user_metadata: session.user.user_metadata,
              github_token,
            };
            set({ user, isAuthenticated: true, isLoading: false });
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false });
          }
        } catch {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

// Auth state change listener
supabase.auth.onAuthStateChange(async (event, session) => {
  console.log('[Auth] State change:', event, 'provider_token:', !!session?.provider_token);
  
  if (event === 'SIGNED_IN' && session?.user) {
    const existingUser = useAuthStore.getState().user;
    // Preserve existing github_token if new session doesn't have one
    const github_token = session.provider_token ?? existingUser?.github_token ?? undefined;
    
    console.log('[Auth] Setting user with github_token:', !!github_token);
    
    // Save provider_token to localStorage when available (OAuth callback)
    if (session.provider_token) {
      saveGitHubToken(session.provider_token);
    }
    
    useAuthStore.getState().setUser({
      id: session.user.id,
      email: session.user.email!,
      created_at: session.user.created_at,
      user_metadata: session.user.user_metadata,
      github_token: github_token,
    });
  } else if (event === 'SIGNED_OUT') {
    clearGitHubToken(); // Clear stored GitHub token on logout
    useAuthStore.getState().setUser(null);
  }
});
