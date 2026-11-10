import { request } from "./client";

export type ApiEnvelope<T> = { success: boolean; data: T; message?: string };
export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  isFeatured?: boolean;
  isActive: boolean;
  sizes?: string[];
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
  deviceType: "Phone" | "Laptop" | "Tablet" | "Audio" | "Wearable" | "Other";
  brand: string;
  model: string;
  condition: "Like new" | "Good" | "Fair" | "Needs repair";
  notes?: string;
  images?: string[];
};

const authenticated = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const commerceApi = {
  products: (params?: { page?: number; limit?: number; category?: string; search?: string }) => {
    const query = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== "") query.set(key, String(value));
    });
    const queryString = query.toString();
    return request<ApiEnvelope<Product[]> & { pagination?: { total: number; page: number; pages: number } }>(
      `/api/products${queryString ? `?${queryString}` : ""}`
    );
  },
  product: (id: string) => request<ApiEnvelope<Product>>(`/api/products/${encodeURIComponent(id)}`),
  cart: (token: string) => request<ApiEnvelope<any>>("/api/cart", authenticated(token)),
  addCartItem: (token: string, productId: string, quantity = 1, size?: string) =>
    request<ApiEnvelope<any>>("/api/cart/add", { method: "POST", ...authenticated(token), body: { productId, quantity, ...(size ? { size } : {}) } }),
  updateCartItem: (token: string, productId: string, quantity: number, size?: string) =>
    request<ApiEnvelope<any>>(`/api/cart/update/${encodeURIComponent(productId)}`, { method: "PUT", ...authenticated(token), body: { quantity, ...(size ? { size } : {}) } }),
  removeCartItem: (token: string, productId: string, size?: string) =>
    request<ApiEnvelope<any>>(`/api/cart/remove/${encodeURIComponent(productId)}${size ? `?size=${encodeURIComponent(size)}` : ""}`, { method: "DELETE", ...authenticated(token) }),
  wishlist: (token: string) => request<ApiEnvelope<any>>("/api/wishlist", authenticated(token)),
  addWishlistItem: (token: string, productId: string) =>
    request<ApiEnvelope<any>>("/api/wishlist", { method: "POST", ...authenticated(token), body: { productId } }),
  removeWishlistItem: (token: string, productId: string) =>
    request<ApiEnvelope<any>>(`/api/wishlist/${encodeURIComponent(productId)}`, { method: "DELETE", ...authenticated(token) }),
  addresses: (token: string) => request<ApiEnvelope<Address[]>>("/api/addresses", authenticated(token)),
  addAddress: (token: string, address: Omit<Address, "_id">) =>
    request<ApiEnvelope<Address>>("/api/addresses", { method: "POST", ...authenticated(token), body: address }),
  updateAddress: (token: string, id: string, address: Omit<Address, "_id">) =>
    request<ApiEnvelope<Address>>(`/api/addresses/${encodeURIComponent(id)}`, { method: "PUT", ...authenticated(token), body: address }),
  deleteAddress: (token: string, id: string) =>
    request<ApiEnvelope<unknown>>(`/api/addresses/${encodeURIComponent(id)}`, { method: "DELETE", ...authenticated(token) }),
  sellRequests: (token: string) => request<ApiEnvelope<any[]>>("/api/sell-requests", authenticated(token)),
  createSellRequest: (token: string, input: SellRequestInput) =>
    request<ApiEnvelope<any>>("/api/sell-requests", { method: "POST", ...authenticated(token), body: input }),
  adminStats: (token: string) => request<ApiEnvelope<any>>("/api/admin/stats", authenticated(token)),
  adminOrders: (token: string) => request<ApiEnvelope<any[]>>("/api/orders/admin/all", authenticated(token)),
  adminSellRequests: (token: string) => request<ApiEnvelope<any[]>>("/api/sell-requests/admin/all", authenticated(token)),
};
