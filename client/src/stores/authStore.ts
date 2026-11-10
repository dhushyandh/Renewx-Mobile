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

// Prevent an older in-flight request from restoring a session after logout
// or overwriting a newer login.
let authRevision = 0;
let initialization: Promise<void> | null = null;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  ready: false,
  busy: false,

  initialize: async () => {
    if (get().ready) return;
    if (initialization) return initialization;

    const revision = authRevision;
    initialization = (async () => {
      try {
        const token = await loadAccessToken();
        if (token || Platform.OS === "web") {
          const user = await authApi.me();
          if (revision === authRevision) set({ user });
        }
      } catch {
        if (revision === authRevision) {
          await setAccessToken(null).catch(() => undefined);
          set({ user: null });
          queryClient.clear();
        }
      } finally {
        set({ ready: true });
        initialization = null;
      }
    })();

    return initialization;
  },

  login: async (email, password) => {
    const revision = ++authRevision;
    set({ busy: true });
    try {
      const user = await authApi.login(email, password);
      if (revision !== authRevision) return;
      queryClient.clear();
      set({ user });
    } finally {
      if (revision === authRevision) set({ busy: false });
    }
  },

  register: async (name, email, password) => {
    const revision = ++authRevision;
    set({ busy: true });
    try {
      const user = await authApi.register(name, email, password);
      if (revision !== authRevision) return;
      queryClient.clear();
      set({ user });
    } finally {
      if (revision === authRevision) set({ busy: false });
    }
  },

  logout: async () => {
    ++authRevision;
    set({ busy: true });
    try {
      await authApi.logout();
    } finally {
      queryClient.clear();
      await setAccessToken(null).catch(() => undefined);
      set({ user: null, busy: false });
    }
  },

  refreshProfile: async () => {
    const revision = authRevision;
    const user = await authApi.me();
    if (revision === authRevision) set({ user });
  },
}));
