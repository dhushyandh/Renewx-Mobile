# RenewX Crew 2.0

A unified Expo application for Android, iOS, and Web (React Native Web), backed by the existing RenewX API.

## Product direction
Premium pre-owned electronics marketplace: discover, buy, sell, and upgrade devices.

## Platforms
- Android and iOS: Expo native builds with EAS Build.
- Web: Expo web export deployed with EAS Hosting (subject to account/hosting availability).
- One Expo Router codebase; no separate React/Vite web application.

## Requirements
- Node.js LTS compatible with the selected Expo SDK.
- npm
- Expo account for EAS Build/Hosting.

## Getting started
```bash
npm install
npx expo start
```

Web:
```bash
npx expo start --web
```

Validate:
```bash
npx expo-doctor
npx expo export --platform web
```

## Environment
Copy `.env.example` to `.env` and set `EXPO_PUBLIC_API_URL` to the existing RenewX API base URL. Do not commit real credentials or secrets. Anything prefixed `EXPO_PUBLIC_` is embedded in client bundles and must never contain secrets.

## Current milestone
Foundation scaffold only. Storefront screens will be implemented after the existing backend API contract has been audited and documented. No demo products or fake customer data are included.
