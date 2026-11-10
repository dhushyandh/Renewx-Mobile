# RenewX Mobile — Master Project Roadmap

This is the **single source of truth** for project phase numbering. Use these seven master phases for all progress updates. Smaller implementation tasks are tracked as sub-tasks inside the relevant master phase; they do not create a second phase numbering system.

**Current focus:** Phase 6 — Selling & tracking  
**Overall status:** In progress. No phase is considered complete until its acceptance checks pass.

Status meanings:
- **Done** — implemented and verified against its acceptance checks.
- **In progress** — implementation or verification is underway.
- **Pending** — not yet started or not sufficiently verified.

---

## Phase 1 — Product planning
**Status: In progress / planning baseline established**

- [x] Identify core audiences: customers and administrators
- [x] Define main customer journeys: browse, buy, sell, manage orders
- [x] Define customer/admin permission boundary
- [x] Define primary navigation: Home, Shop, Sell, Orders, Profile
- [ ] Confirm complete user stories and edge cases for every journey
- [ ] Confirm final feature scope and acceptance criteria

**Exit criteria:** User roles, permissions, navigation, workflows and feature scope are documented and agreed.

## Phase 2 — Branding & UI system
**Status: In progress / existing system needs audit**

- [x] Existing shared colour, spacing and radius tokens
- [x] Existing shared screen/component foundation
- [ ] Audit logo, app icon and launch/splash assets
- [ ] Audit typography, icon consistency and component variants
- [ ] Verify reusable buttons, inputs, cards, alerts, loading and empty states
- [ ] Review key screens for consistent visual hierarchy and responsive layouts

**Exit criteria:** A documented, consistent design system is used across all customer and admin screens.

## Phase 3 — Architecture
**Status: In progress / implementation exists, CI verification required**

- [x] Expo Router application and route structure
- [x] TypeScript client foundation
- [x] Central API client and authentication token handling
- [x] Zustand stores and React Query integration
- [x] Backend API integration foundation
- [x] GitHub Actions validation workflow
- [ ] Resolve all current client/server typecheck and CI failures
- [ ] Verify auth persistence, expired-token handling and role enforcement
- [ ] Verify API environment configuration for development and production
- [ ] Verify Android, iOS and web builds

**Exit criteria:** Clean CI, stable navigation/state/auth, documented API configuration and successful target-platform builds.

## Phase 4 — Storefront
**Status: In progress / existing screens require end-to-end verification**

- [ ] Home screen uses live backend products only
- [ ] Categories and category filtering use real catalogue data
- [ ] Search, sorting and filters work against backend data
- [ ] Product cards show real images, prices, stock and condition
- [ ] Product detail screen handles loading, API errors and not-found
- [ ] Wishlist reads and writes server-backed data
- [ ] Skeleton loading, empty states, retry and pull-to-refresh
- [ ] Remove all demo products and hardcoded storefront values

**Exit criteria:** A customer can discover and inspect real products with reliable loading, empty and error states.

## Phase 5 — Commerce
**Status: In progress / verify each transaction path**

- [ ] Cart persists against the backend and handles stock changes
- [ ] Address selection and management work end to end
- [ ] Checkout validates customer, address, price and inventory
- [ ] Payment provider integration is configured and tested in sandbox
- [ ] Payment success, failure, cancellation and retry are handled
- [ ] Orders are created only after valid checkout/payment outcome
- [ ] Order history and order detail show real backend records
- [ ] No fake orders, payment confirmations or hardcoded totals

**Exit criteria:** A customer can complete a real test checkout and see the resulting backend order accurately.

## Phase 6 — Selling & tracking
**Status: In progress / customer Sell flow and admin review implementation underway**

### Customer sell journey
- [x] Eight-step sell wizard UI: category, brand, model, variant, condition, photos, pickup details, quote/review
- [x] Backend catalogue API methods for brands and models
- [x] Image picker integration in the customer flow
- [x] Quote and sell-request submission API wiring
- [ ] Verify catalogue category mapping and fallback behaviour against live backend data
- [ ] Verify photo upload endpoint contract, size limits and returned URLs
- [ ] Verify quote payload and response against the backend
- [ ] Verify authenticated request submission and confirmation ID
- [ ] Verify customer can see their submitted requests and current status

### Admin review
- [x] Admin trade-in list and status-update API methods
- [x] Admin sell-request review screen implementation
- [x] Status filters and request detail view
- [x] Approve/reject actions with amount and admin note
- [x] Link from admin overview to sell-request management
- [ ] Verify admin screen typecheck/build and role-protected navigation
- [ ] Verify approve/reject updates persist and notify the correct customer
- [ ] Verify invalid status transitions and server errors are handled clearly

### Pickup and tracking
- [ ] Admin can schedule pickup with date/time and relevant instructions
- [ ] Customer can view pickup schedule and request status
- [ ] Pickup status transitions are reflected consistently in customer UI
- [ ] Tracking uses real backend events/statuses, never sample tracking data
- [ ] Cancellation and exception paths are verified

**Exit criteria:** Customer submission, admin decision, customer notification, pickup scheduling and status tracking work end to end with real backend data.

## Phase 7 — Production readiness
**Status: Pending**

- [ ] Resolve all CI, TypeScript, test and build failures
- [ ] Add/complete unit and API integration tests for critical journeys
- [ ] Perform end-to-end QA on customer and admin workflows
- [ ] Security review: authentication, authorization, input validation, uploads and secrets
- [ ] Performance review: image sizes, list rendering, caching and network behaviour
- [ ] Accessibility review: labels, contrast, touch targets and screen-reader behaviour
- [ ] Test slow network, offline, empty, expired session and server failure states
- [ ] Verify production environment variables and backend deployment
- [ ] Produce and test Android release build; verify iOS release path if in scope
- [ ] Complete release checklist and rollback plan

**Exit criteria:** Critical journeys pass QA, security and performance checks are addressed, and release builds are verified.

---

## Working rules

1. Always report progress using the seven master phases above.
2. A sub-task being coded does not mean it is complete; mark it Done only after verification.
3. Do not use demo data or hardcoded success states to satisfy acceptance criteria.
4. Fix blockers in the current phase before moving to the next phase.
5. Update this roadmap when meaningful work is merged, and include the commit/CI result when reporting completion.
