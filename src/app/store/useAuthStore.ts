import { create } from "zustand";
import { api } from "../services/api";

interface AuthState {
  user: any | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  login: async (email, password) => {
    try {
      const data = await api.loginUser({ email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);

      set({ token: data.token, user: data.user });

      // Buscar dados do usuário após login
      const userData = await api.getUserData(data.user.id, data.token);
      set({ user: userData });
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    set({ user: null, token: null });
  },
}));
