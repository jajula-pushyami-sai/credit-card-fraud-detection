import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  /**
   * True while the app is performing the initial /me validation on startup.
   * ProtectedRoute should show a loader (not redirect) during this window.
   */
  isInitializing: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  /**
   * Called once at app startup. Validates the persisted session by calling
   * /me with the access token. If the call fails (e.g., token expired/revoked),
   * auth state is cleared so protected routes correctly redirect to login.
   */
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isInitializing: true,
      accessToken: null,
      refreshToken: null,
      setUser: (user) => set({ user, isAuthenticated: true }),
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      logout: () =>
        set({ user: null, isAuthenticated: false, accessToken: null, refreshToken: null, isInitializing: false }),
      initializeAuth: async () => {
        const { accessToken, isAuthenticated } = get();

        // If there's no access token (e.g., first visit or cleared state),
        // clear any stale persisted auth state.
        if (!accessToken) {
          if (isAuthenticated) {
            set({ user: null, isAuthenticated: false, isInitializing: false });
          } else {
            set({ isInitializing: false });
          }
          return;
        }

        // Validate current token against backend /me endpoint
        try {
          const { apiClient } = await import('@/core/api/client');
          const res = await apiClient.get('/auth/me');
          const serverUser: User = res.data?.data?.user;
          if (serverUser) {
            set({ user: serverUser, isAuthenticated: true, isInitializing: false });
          } else {
            set({ user: null, isAuthenticated: false, accessToken: null, refreshToken: null, isInitializing: false });
          }
        } catch {
          // /me failed — token is expired or revoked.
          set({ user: null, isAuthenticated: false, accessToken: null, refreshToken: null, isInitializing: false });
        }
      },
    }),
    {
      name: 'fraudshield-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
