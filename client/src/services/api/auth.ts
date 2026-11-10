import { request, setAccessToken, setRefreshToken, loadRefreshToken } from "./client";
export type AuthUser = { id: string; name: string; email: string; image?: string | null; role: "user" | "admin" };
type AuthResponse = { success: boolean; data: { accessToken: string; refreshToken?: string; tokenType: "Bearer"; expiresIn: number; user: AuthUser } };
const acceptSession = async (data: AuthResponse["data"]) => {
  await setAccessToken(data.accessToken);
  if (data.refreshToken) await setRefreshToken(data.refreshToken);
  return data.user;
};
export const authApi = {
  async login(email: string, password: string) {
    const result = await request<AuthResponse>("/api/auth/login", { method: "POST", body: { email, password } });
    return acceptSession(result.data);
  },
  async register(name: string, email: string, password: string) {
    const result = await request<AuthResponse>("/api/auth/register", { method: "POST", body: { name, email, password } });
    return acceptSession(result.data);
  },
  async refresh() {
    const refreshToken = await loadRefreshToken();
    const result = await request<AuthResponse>("/api/auth/refresh", { method: "POST", ...(refreshToken ? { body: { refreshToken } } : {}) });
    return acceptSession(result.data);
  },
  async me() { return (await request<{ success: boolean; data: AuthUser }>("/api/auth/me")).data; },
  async logout() {
    try { await request("/api/auth/logout", { method: "POST" }); }
    finally { await setAccessToken(null); await setRefreshToken(null); }
  },
};
