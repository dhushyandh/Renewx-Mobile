import { request, setAccessToken } from "./client";

export type AuthUser = {
  id: string;
  email: string;
  role: "customer" | "admin";
  full_name: string;
  avatar_url?: string | null;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  bio?: string;
  profile_completed?: boolean;
  saved_addresses?: unknown[];
};
type AuthEnvelope = { success: boolean; data: { token?: string; authenticatedByCookie?: boolean; user: AuthUser } };

async function acceptSession(result: AuthEnvelope): Promise<AuthUser> {
  if (!result?.success || !result.data?.user) throw new Error("The server returned an invalid sign-in response.");
  if (result.data.token) await setAccessToken(result.data.token);
  return result.data.user;
}

export const authApi = {
  async login(email: string, password: string) {
    const result = await request<AuthEnvelope>("/auth/login", { method: "POST", body: { email, password } });
    return acceptSession(result);
  },
  async register(name: string, email: string, password: string) {
    const result = await request<AuthEnvelope>("/auth/register", { method: "POST", body: { full_name: name, email, password } });
    return acceptSession(result);
  },
  async me() {
    const result = await request<{ success: boolean; data: AuthUser }>("/auth/me");
    if (!result.success || !result.data) throw new Error("Your session has expired. Please sign in again.");
    return result.data;
  },
  async logout() {
    await setAccessToken(null);
  },
};
