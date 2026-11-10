export type OrderStatus = 'placed' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type OrderSummary = { id: string; orderNumber: string; status: OrderStatus; total: number; createdAt: string };
