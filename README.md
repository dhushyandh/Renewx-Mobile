# RenewX Crew 2.0

A unified Expo application for Android, iOS and web using React Native, Expo Router and strict TypeScript.

## Stack
- Expo SDK 54 and Expo Router
- TypeScript (.ts / .tsx) application source
- React Native and React Native Web
- TanStack Query for server state
- Zustand for small client-only UI state
- Existing RenewX Express/MongoDB backend (reuse; do not replace)

## Local setup
1. Install Node.js LTS.
2. Run npm install.
3. Copy .env.example to .env and set EXPO_PUBLIC_API_URL to the existing backend URL.
4. Run npm run doctor and npm run typecheck.
5. Run npm start; use npm run web for browser development.

EXPO_PUBLIC variables are bundled into the client. Never put private keys, database credentials or server secrets in them.

## Architecture rules
- app/ contains route composition; src/features contains domain logic.
- Application source must use TypeScript only. babel.config.js remains JavaScript because Babel expects a JS config file.
- TanStack Query owns remote/server state; Zustand is for transient UI state only.
- Do not add fake products, orders, users, ratings, stock or metrics.
- Do not guess backend routes or DTOs. Verify the existing API contract first.
- The server is authoritative for price, stock, discounts, checkout totals and order status.
- Preserve RenewX navy #111827, yellow #FFC400, white and cloud-grey identity.
- Build responsive mobile and desktop experiences from the same app.

## Current implementation status
The repository contains a TypeScript foundation, navigation shell, design tokens, shared API boundary, feature domain types and a starter home screen. Live catalogue, auth, checkout and order workflows are not connected. Expo Doctor, typecheck, web export and native builds have not yet been run. See docs/PROJECT-AUDIT.md and docs/ROADMAP.md.
