import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  username: string;
  setUsername: (username: string) => void;
  clearUser: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      username: '',
      setUsername: (username: string) => set({ username }),
      clearUser: () => set({ username: '' }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Ensure that the store is available on the `window` object for Cypress testing
if (typeof window !== 'undefined') {
  window.__store__ = useAuthStore;  // This makes it available for Cypress
}

export default useAuthStore;
