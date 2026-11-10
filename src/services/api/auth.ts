import { request, setAccessToken } from "./client";
export type AuthUser = { id: string; name: string; email: string; image?: string | null; role: "user" | "admin" };
type AuthResponse = { success: boolean; data: { accessToken: string; tokenType: "Bearer"; expiresIn: number; user: AuthUser } };
export const authApi = {
  async login(email: string, password: string) {
    const result = await request<AuthResponse>("/api/auth/login", { method: "POST", body: { email, password } });
    await setAccessToken(result.data.accessToken); return result.data.user;
  },
  async register(name: string, email: string, password: string) {
    const result = await request<AuthResponse>("/api/auth/register", { method: "POST", body: { name, email, password } });
    await setAccessToken(result.data.accessToken); return result.data.user;
  },
  async refresh() {
    const result = await request<AuthResponse>("/api/auth/refresh", { method: "POST" });
    await setAccessToken(result.data.accessToken); return result.data.user;
  },
  async me() { return (await request<{ success: boolean; data: AuthUser }>("/api/auth/me")).data; },
  async logout() { try { await request("/api/auth/logout", { method: "POST" }); } finally { await setAccessToken(null); } },
};
