import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export type ApiRequestOptions = Omit<RequestInit, "body"> & { body?: unknown };
export class ApiError extends Error {
  constructor(message: string, public readonly status: number, public readonly payload: unknown) {
    super(message); this.name = "ApiError";
  }
}
const RAW_API_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");
const API_URL = RAW_API_URL?.replace(/\/api$/i, "");
const API_PREFIX = "/api";
const TOKEN_KEY = "renewx_access_token";
let accessToken: string | null = null;

export const setAccessToken = async (token: string | null) => {
  accessToken = token;
  if (Platform.OS !== "web") {
    if (token) await SecureStore.setItemAsync(TOKEN_KEY, token);
    else await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
};
export const loadAccessToken = async () => {
  if (Platform.OS !== "web") accessToken = await SecureStore.getItemAsync(TOKEN_KEY);
  return accessToken;
};

export async function request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  if (!API_URL) throw new Error("EXPO_PUBLIC_API_URL is not configured. Add your deployed API URL to client/.env.");
  const normalizedPath = path.startsWith("/") ? path : "/" + path;
  const apiPath = normalizedPath.startsWith("/api/") ? normalizedPath : API_PREFIX + normalizedPath;
  const response = await fetch(API_URL + apiPath, {
    ...options,
    credentials: "include",
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    headers: {
      Accept: "application/json",
      ...(options.body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(Platform.OS !== "web" ? { "X-Client-Platform": "native" } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
  });
  const contentType = response.headers.get("content-type") || "";
  const payload: any = contentType.includes("application/json") ? await response.json() : await response.text();
  if (!response.ok) {
    const message = payload?.error?.message || payload?.message || payload?.error || "Request failed (" + response.status + ")";
    throw new ApiError(typeof message === "string" ? message : "Request failed (" + response.status + ")", response.status, payload);
  }
  return payload as T;
}
export const getApiBaseUrl = (): string | null => API_URL ? API_URL + API_PREFIX : null;
