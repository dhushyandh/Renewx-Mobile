import { create } from "zustand";
import { Platform } from "react-native";
import { AuthUser, authApi } from "../services/api/auth";
import { loadAccessToken, setAccessToken } from "../services/api/client";

type AuthState = {
  user: AuthUser | null;
  ready: boolean;
  busy: boolean;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  ready: false,
  busy: false,
  initialize: async () => {
    try {
      const token = await loadAccessToken();
      if (token || Platform.OS === "web") {
        try { set({ user: await authApi.me() }); }
        catch { await setAccessToken(null); set({ user: null }); }
      }
    } finally {
      set({ ready: true });
    }
  },
  login: async (email, password) => {
    set({ busy: true });
    try { set({ user: await authApi.login(email, password) }); }
    finally { set({ busy: false }); }
  },
  register: async (name, email, password) => {
    set({ busy: true });
    try { set({ user: await authApi.register(name, email, password) }); }
    finally { set({ busy: false }); }
  },
  logout: async () => {
    try { await authApi.logout(); }
    finally { set({ user: null }); }
  },
  refreshProfile: async () => set({ user: await authApi.me() }),
}));
