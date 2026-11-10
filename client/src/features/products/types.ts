export type ProductCondition = 'new' | 'like_new' | 'good' | 'fair';
export type Product = { id: string; title: string; slug?: string; price: number; compareAtPrice?: number; condition: ProductCondition; images: string[]; categoryId?: string; inStock: boolean };
