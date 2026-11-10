export type CartLine = { productId: string; quantity: number; unitPrice: number };
// Prices returned by the server are authoritative; never trust client totals at checkout.
