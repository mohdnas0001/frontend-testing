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
      name: 'auth-storage', // Unique name for the localStorage key
      storage: createJSONStorage(() => localStorage), // Wrap localStorage using createJSONStorage
    },
  ),
);

export default useAuthStore;
