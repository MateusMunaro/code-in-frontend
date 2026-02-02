import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@shared/lib/supabase';
import type { User, AuthState } from '@shared/types';

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
            return { error: error.message };
          }

          return {};
        } catch (err) {
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
        set({ user: null, isAuthenticated: false });
      },

      checkSession: async () => {
        set({ isLoading: true });
        try {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            const user: User = {
              id: session.user.id,
              email: session.user.email!,
              created_at: session.user.created_at,
              user_metadata: session.user.user_metadata,
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
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    useAuthStore.getState().setUser({
      id: session.user.id,
      email: session.user.email!,
      created_at: session.user.created_at,
      user_metadata: session.user.user_metadata,
    });
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.getState().setUser(null);
  }
});
