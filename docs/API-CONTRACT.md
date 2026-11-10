# API Contract

Status: not yet verified. The existing RenewX backend source and API documentation have not yet been inspected.

Reuse the existing Express/MongoDB backend and authentication provider. Record real endpoint paths, auth mechanism, request/response DTOs and error shapes here before connecting screens. Never invent routes or payloads. Keep secrets out of source control and out of EXPO_PUBLIC variables. Server-side prices, stock, discounts, totals and order state are authoritative.

Required endpoint groups: auth/session, categories, products/search/filters, wishlist, cart, checkout/payment, orders/tracking, sell requests, profile and addresses.
