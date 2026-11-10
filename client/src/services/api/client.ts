import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export type ApiRequestOptions = Omit<RequestInit, "body"> & { body?: unknown };
export class ApiError extends Error {
  constructor(message: string, public readonly status: number, public readonly payload: unknown) { super(message); this.name = "ApiError"; }
}
const API_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");
const TOKEN_KEY = "renewx_access_token";
const REFRESH_KEY = "renewx_refresh_token";
let accessToken: string | null = null;

export const setAccessToken = async (token: string | null) => {
  accessToken = token;
  if (Platform.OS !== "web") {
    if (token) await SecureStore.setItemAsync(TOKEN_KEY, token);
    else await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
};
export const setRefreshToken = async (token: string | null) => {
  if (Platform.OS !== "web") {
    if (token) await SecureStore.setItemAsync(REFRESH_KEY, token);
    else await SecureStore.deleteItemAsync(REFRESH_KEY);
  }
};
export const loadRefreshToken = async () => Platform.OS === "web" ? null : SecureStore.getItemAsync(REFRESH_KEY);
export const loadAccessToken = async () => {
  if (Platform.OS !== "web") accessToken = await SecureStore.getItemAsync(TOKEN_KEY);
  return accessToken;
};
export async function request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  if (!API_URL) throw new Error("EXPO_PUBLIC_API_URL is not configured.");
  const token = accessToken;
  const response = await fetch(API_URL + (path.startsWith("/") ? path : "/" + path), {
    ...options,
    credentials: "include",
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    headers: {
      Accept: "application/json",
      ...(options.body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(Platform.OS !== "web" ? { "X-Client-Platform": "native" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const contentType = response.headers.get("content-type") || "";
  const payload: unknown = contentType.includes("application/json") ? await response.json() : await response.text();
  if (!response.ok) {
    const body = payload as { message?: string; error?: string } | null;
    throw new ApiError(body?.message || body?.error || "Request failed (" + response.status + ")", response.status, payload);
  }
  return payload as T;
}
export const getApiBaseUrl = (): string | null => API_URL || null;
