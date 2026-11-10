import { create } from "zustand";
import { AuthUser, authApi } from "../services/api/auth";
import { loadAccessToken, setAccessToken } from "../services/api/client";
type AuthState = {
  user: AuthUser | null; ready: boolean; busy: boolean;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};
export const useAuthStore = create<AuthState>((set) => ({
  user: null, ready: false, busy: false,
  initialize: async () => {
    try {
      const token = await loadAccessToken();
      if (token) {
        try { set({ user: await authApi.me() }); return; }
        catch { await setAccessToken(null); }
      }
      // Web restores via its httpOnly cookie; native restores from SecureStore.
      try { set({ user: await authApi.refresh() }); }
      catch { await setAccessToken(null); set({ user: null }); }
    } finally { set({ ready: true }); }
  },
  login: async (email, password) => { set({ busy: true }); try { set({ user: await authApi.login(email, password) }); } finally { set({ busy: false }); } },
  register: async (name, email, password) => { set({ busy: true }); try { set({ user: await authApi.register(name, email, password) }); } finally { set({ busy: false }); } },
  logout: async () => { await authApi.logout(); set({ user: null }); },
}));
