# Project Audit

## Repository status
This repository was verified as empty before the initial scaffold was created. No existing application source was available here to inspect.

## Required external audit
The following existing RenewX systems must be inspected before feature implementation:
- Existing Expo application repository/source.
- Existing customer web experience (if separate; it is not to be rebuilt as a separate app).
- Existing Express/MongoDB backend.
- Product, category, search, cart, checkout, payment, order, tracking, sell/upgrade and profile endpoints.
- Google authentication configuration and signing fingerprints.
- Existing image CDN/storage conventions.

## Reuse policy
Preserve working backend APIs and database records. Do not migrate schemas or alter production data as part of this client scaffold.

## Open questions
- Confirm canonical production API base URL.
- Obtain endpoint contract and representative sanitized responses.
- Confirm authentication token format and refresh flow.
- Confirm product image URL transformation rules.
- Confirm pagination, filter and sorting query conventions.
