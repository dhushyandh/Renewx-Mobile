# Architecture

## Overview
One Expo Router application targets Android, iOS and Web through React Native and React Native Web. Native builds use EAS Build; web export can be deployed with EAS Hosting where available.

## Layers
- `app/`: route definitions and layouts only.
- `src/features/`: feature-focused UI and domain behavior.
- `src/components/`: reusable presentation components.
- `src/services/`: network and integration boundaries.
- `src/hooks/`: reusable hooks.
- `src/stores/`: client-only state; server state belongs in TanStack Query.
- `src/theme/`: design tokens and theme.
- `assets/`: optimized local brand and decorative assets.

## Platform strategy
Prefer shared React Native components. Use platform-specific files only when a platform needs materially different behavior. Use responsive breakpoints for web layout; do not fork the product into a separate web application.

## Backend boundary
The API client is the only generic HTTP entry point. Feature services will map documented backend contracts to UI needs. No backend routes are assumed until verified.

## Security
- Client-exposed `EXPO_PUBLIC_*` variables are public.
- Never bundle service-account keys, private keys, or server secrets.
- Authentication tokens must be stored using platform-appropriate secure storage once auth integration is designed.
