import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  favoritos: string[];
  setToken: (token: string | null) => void;
  toggleFavorito: (codigo: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      favoritos: [],
      setToken: (token) => set({ token }),
      toggleFavorito: (codigo) => set((state) => ({
        favoritos: state.favoritos.includes(codigo)
          ? state.favoritos.filter((id) => id !== codigo)
          : [...state.favoritos, codigo]
      })),
      logout: () => set({ token: null, favoritos: [] }),
    }),
    { name: 'innova-auth-storage' }
  )
);