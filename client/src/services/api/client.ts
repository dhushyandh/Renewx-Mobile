import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  timeoutMs?: number;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly payload: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const RAW_API_URL = process.env.EXPO_PUBLIC_API_URL?.trim().replace(/\/+$/, "");
const API_URL = RAW_API_URL?.replace(/\/api$/i, "");
const API_PREFIX = "/api";
const DEFAULT_TIMEOUT_MS = 20_000;
const TOKEN_KEY = "renewx_access_token";
let accessToken: string | null = null;

export const setAccessToken = async (token: string | null): Promise<void> => {
  accessToken = token;
  if (Platform.OS === "web") return;
  if (token) await SecureStore.setItemAsync(TOKEN_KEY, token);
  else await SecureStore.deleteItemAsync(TOKEN_KEY);
};

export const loadAccessToken = async (): Promise<string | null> => {
  if (Platform.OS !== "web") accessToken = await SecureStore.getItemAsync(TOKEN_KEY);
  return accessToken;
};

function resolveApiPath(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === API_PREFIX || normalized.startsWith(`${API_PREFIX}/`)) return normalized;
  return `${API_PREFIX}${normalized}`;
}

async function readResponse(response: Response): Promise<unknown> {
  if (response.status === 204) return null;
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return { message: "The server returned an invalid JSON response." };
    }
  }
  const text = await response.text();
  return text || null;
}

function getErrorMessage(payload: any, status: number): string {
  const candidate = payload?.error?.message ?? payload?.message ?? payload?.error;
  return typeof candidate === "string" && candidate.trim()
    ? candidate
    : `Request failed (${status})`;
}

export async function request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  if (!API_URL) {
    throw new ApiError(
      "EXPO_PUBLIC_API_URL is not configured. Add your deployed API URL to client/.env.",
      0,
      null,
    );
  }

  const { timeoutMs = DEFAULT_TIMEOUT_MS, signal: callerSignal, ...requestOptions } = options;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const abortFromCaller = () => controller.abort();
  callerSignal?.addEventListener("abort", abortFromCaller, { once: true });

  try {
    const response = await fetch(API_URL + resolveApiPath(path), {
      ...requestOptions,
      signal: controller.signal,
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

    const payload = await readResponse(response);
    if (!response.ok) {
      throw new ApiError(getErrorMessage(payload, response.status), response.status, payload);
    }
    return payload as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof Error && error.name === "AbortError") {
      const timedOut = !callerSignal?.aborted;
      throw new ApiError(
        timedOut ? "The request timed out. Please try again." : "The request was cancelled.",
        0,
        { cause: error },
      );
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Unable to connect to the server. Check your connection.",
      0,
      { cause: error },
    );
  } finally {
    clearTimeout(timeout);
    callerSignal?.removeEventListener("abort", abortFromCaller);
  }
}

export const getApiBaseUrl = (): string | null =>
  API_URL ? API_URL + API_PREFIX : null;
