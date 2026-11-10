export type ApiRequestOptions = Omit<RequestInit, 'body'> & { body?: unknown };
export class ApiError extends Error {
  constructor(message:string, public readonly status:number, public readonly payload:unknown) { super(message); this.name='ApiError'; }
}
const API_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');
export async function request<T>(path:string, options:ApiRequestOptions = {}):Promise<T> {
  if (!API_URL) throw new Error('EXPO_PUBLIC_API_URL is not configured.');
  const url = API_URL + (path.startsWith('/') ? path : '/' + path);
  const response = await fetch(url, { ...options, body: options.body === undefined ? undefined : JSON.stringify(options.body), headers:{ Accept:'application/json', ...(options.body !== undefined ? {'Content-Type':'application/json'} : {}), ...options.headers } });
  const contentType=response.headers.get('content-type') || '';
  const payload:unknown=contentType.includes('application/json') ? await response.json() : await response.text();
  if (!response.ok) {
    const body=payload as {message?:string;error?:string}|null;
    throw new ApiError(body?.message || body?.error || 'Request failed ('+response.status+')',response.status,payload);
  }
  return payload as T;
}
export const getApiBaseUrl=():string|null=>API_URL || null;
