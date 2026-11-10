# API Contract

Backend repository inspected: https://github.com/dhushyandh/RenewX-Crew (branch: master).

The mobile app must use the existing Express/MongoDB backend and Clerk authentication. Authenticated requests use `Authorization: Bearer <Clerk session token>`. Never put Clerk secret keys or other server secrets in the mobile app. Server-side prices, stock, payment verification, totals, order state and admin authorization remain authoritative.

## Verified endpoints

Base URL is configured with `EXPO_PUBLIC_API_URL`.

### Public catalogue
- `GET /api/products?page=1&limit=20&category=Phones&search=...`
- `GET /api/products/:id`
- Product list response: `{ success, data: Product[], pagination }`
- Single product response: `{ success, data: Product }`
- Product categories now include Phones, Laptops, Tablets, Audio, Wearables, Accessories, Gaming, Monitors and Other. Legacy clothing category values remain accepted for existing records.
- `sizes` is optional for electronics; only legacy variant products should require it.

### Authenticated customer
- Cart: `GET /api/cart`, `POST /api/cart/add`, `PUT /api/cart/update/:itemId`, `DELETE /api/cart/remove/:itemId`, `DELETE /api/cart`.
- Wishlist: `GET /api/wishlist`, `POST /api/wishlist` with `{ productId }`, `DELETE /api/wishlist/:productId`.
- Addresses: `GET|POST /api/addresses`, `PUT|DELETE /api/addresses/:id`.
- Orders: `GET /api/orders`, `GET /api/orders/:id`, `POST /api/orders`.
- Device sell intake: `GET|POST /api/sell-requests`. Submission accepts deviceType, brand, model, condition, optional notes and up to six HTTP(S) image URLs.
- Notifications: `POST /api/notifications/register`, `DELETE /api/notifications/unregister`, `GET|PUT /api/notifications/preferences`.
- Payment: `POST /api/payments/create-order`; order creation verifies Razorpay payment server-side.

### Admin (backend role authorization required)
- Dashboard: `GET /api/admin/stats`
- Users: `GET /api/admin/users`, `PUT|DELETE /api/admin/users/:id`
- Orders: `GET /api/orders/admin/all`, `PUT /api/orders/:id/status`
- Sell requests: `GET /api/sell-requests/admin/all`, `PATCH /api/sell-requests/:id`

## Important integration notes
- Clerk session token retrieval and Expo Clerk provider/callback setup must be implemented and verified before authenticated mobile screens can be considered functional.
- Cart item `size` is optional for electronics. Legacy products with a non-empty sizes array still require a valid size/variant.
- Address payload fields: type (Home/Work/Other), street, city, state, zipCode, country, isDefault.
- The sell-request API currently accepts remote image URLs; a secure upload flow must provide those URLs before submission. Do not send large base64 image strings.
- The current backend does not expose a delivery-serviceability or live GPS endpoint. Location permission is optional; manual address entry remains the fallback.
- Cookie consent is implemented only for web tracking/analytics preferences. Native apps should use platform permission and privacy controls instead.
- Wishlist and sell-request backend routes were added in the backend repository, but they have not yet been runtime-tested against a deployed environment.

## Error handling
Handle non-2xx responses using the backend JSON `message` where available. Treat 401 as an expired/missing Clerk session, 403 as a role/permission denial, 404 as missing resource, 409 as stock conflict, and 5xx as retryable service errors where safe.
