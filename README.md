# RenewX

RenewX is maintained as a single repository with a mobile client and API server.

## Structure
- `client/` — Expo React Native application.
- `server/` — Express + MongoDB API, JWT authentication, email OTP, payments and workers.
- `docs/` — Architecture, API contract and implementation notes.

## Install
```bash
npm install
```

## Run the client
```bash
npm run dev
```

## Run the API
```bash
npm run dev:server
```

Copy `client/.env.example` to `client/.env` and set `EXPO_PUBLIC_API_URL`.
Copy `server/.env.example` to `server/.env` and configure MongoDB, JWT, email, storage and payment settings.

Never commit real secrets or environment files.
