import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "../api/client";

const shouldRetryQuery = (failureCount: number, error: unknown): boolean => {
  if (failureCount >= 2) return false;
  if (error instanceof ApiError) {
    // Client errors are deterministic; retry only network failures and server errors.
    return error.status === 0 || error.status >= 500;
  }
  return true;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: shouldRetryQuery,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
});
