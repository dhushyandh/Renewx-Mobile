# API Contract

No endpoint paths are assumed in this scaffold.

Before storefront implementation, document each verified endpoint with:
- HTTP method and path.
- Authentication requirements.
- Query/body schema.
- Response schema.
- Pagination conventions.
- Error formats and status codes.
- Image URL behavior.
- Rate limits or operational constraints.

Required domains:
1. Authentication and session.
2. Products and product details.
3. Categories.
4. Search, filters and sorting.
5. Wishlist.
6. Cart.
7. Address book.
8. Checkout and payment.
9. Orders and tracking.
10. Sell/upgrade submissions.
11. Profile and support.

Use sanitized real responses from the existing backend. Never place real customer data or tokens in this document.
