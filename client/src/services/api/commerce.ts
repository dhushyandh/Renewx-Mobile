import { request } from "./client";

export type ApiEnvelope<T> = { success: boolean; data: T; message?: string; error?: { message?: string } };
export type Product = {
  id: string;
  _id?: string;
  name: string;
  brand?: string;
  model?: string;
  description?: string;
  price: number;
  original_price?: number;
  image_url?: string;
  images?: string[];
  category: string;
  condition?: string;
  stock: number;
  status?: string;
  specs?: string | Record<string, unknown>;
  warranty_months?: number;
};
export type Address = {
  _id: string;
  type: "Home" | "Work" | "Other";
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
};
export type SellRequestInput = {
  category: string;
  brand: string;
  model: string;
  storage?: string;
  condition: Record<string, unknown>;
  customerPhone: string;
  address: string;
  pincode: string;
  expectedSellingPrice?: number;
  photos?: string[];
};
export const commerceApi = {
  products: (params?: { page?: number; limit?: number; category?: string; search?: string; sort?: string }) => {
    const query = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== "") query.set(key, String(value));
    });
    return request<ApiEnvelope<Product[]> & { total?: number; totalPages?: number; page?: number; limit?: number }>(`/products${query.toString() ? `?${query}` : ""}`);
  },
  product: (id: string) => request<ApiEnvelope<Product>>(`/products/${encodeURIComponent(id)}`),
  orders: () => request<ApiEnvelope<any[]> & { count?: number }>("/orders"),
  order: (id: string) => request<ApiEnvelope<any>>(`/orders/${encodeURIComponent(id)}`),
  addresses: () => request<ApiEnvelope<any[]>>("/users/me/addresses"),
  addAddress: (address: Record<string, unknown>) => request<ApiEnvelope<any>>("/users/me/addresses", { method: "POST", body: address }),
  updateAddress: (id: string, address: Record<string, unknown>) => request<ApiEnvelope<any>>(`/users/me/addresses/${encodeURIComponent(id)}`, { method: "PUT", body: address }),
  deleteAddress: (id: string) => request<ApiEnvelope<unknown>>(`/users/me/addresses/${encodeURIComponent(id)}`, { method: "DELETE" }),
  updateProfile: (profile: Record<string, unknown>) => request<ApiEnvelope<any>>("/users/me/profile", { method: "PATCH", body: profile }),
  tradeInQuote: (input: Record<string, unknown>) => request<ApiEnvelope<any>>("/trade-in/quote", { method: "POST", body: input }),
  createTradeIn: (input: SellRequestInput) => request<ApiEnvelope<any>>("/trade-in/pickup", { method: "POST", body: input }),
  myTradeIns: () => request<ApiEnvelope<any[]>>("/trade-in/my-requests"),
  adminAnalytics: (period = "month") => request<ApiEnvelope<any>>(`/analytics?period=${period}`),
  adminUsers: (params?: { page?: number; limit?: number; search?: string }) => {
    const query = new URLSearchParams();
    Object.entries(params || {}).forEach(([k,v]) => { if (v !== undefined && v !== "") query.set(k,String(v)); });
    return request<ApiEnvelope<any[]> & { total?: number }>(`/users${query.toString()? `?${query}`:""}`);
  },
};
