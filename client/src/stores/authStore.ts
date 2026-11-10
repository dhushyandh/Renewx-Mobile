import { create } from "zustand";
import { Platform } from "react-native";
import { AuthUser, authApi } from "../services/api/auth";
import { loadAccessToken, setAccessToken } from "../services/api/client";
import { queryClient } from "../services/query/queryClient";

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

let initialization: Promise<void> | null = null;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  ready: false,
  busy: false,

  initialize: async () => {
    if (get().ready) return;
    if (initialization) return initialization;

    initialization = (async () => {
      try {
        const token = await loadAccessToken();
        if (token || Platform.OS === "web") {
          try {
            const user = await authApi.me();
            set({ user });
          } catch {
            await setAccessToken(null);
            set({ user: null });
            queryClient.clear();
          }
        }
      } catch {
        await setAccessToken(null).catch(() => undefined);
        set({ user: null });
        queryClient.clear();
      } finally {
        set({ ready: true });
        initialization = null;
      }
    })();

    return initialization;
  },

  login: async (email, password) => {
    set({ busy: true });
    try {
      const user = await authApi.login(email, password);
      queryClient.clear();
      set({ user });
    } finally {
      set({ busy: false });
    }
  },

  register: async (name, email, password) => {
    set({ busy: true });
    try {
      const user = await authApi.register(name, email, password);
      queryClient.clear();
      set({ user });
    } finally {
      set({ busy: false });
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      queryClient.clear();
      await setAccessToken(null).catch(() => undefined);
      set({ user: null, busy: false });
    }
  },

  refreshProfile: async () => {
    const user = await authApi.me();
    set({ user });
    return;
  },
}));
