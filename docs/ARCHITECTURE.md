# RenewX Crew 2.0 Architecture

Single Expo Router application for Android, iOS and web through React Native Web.

- app/: route composition and navigation only.
- src/features/: domain types, queries, mutations and feature UI.
- src/components/: shared UI primitives.
- src/services/api/: typed HTTP boundary.
- src/services/query/: TanStack Query cache configuration.
- src/hooks/: shared hooks.
- src/stores/: transient client-only Zustand state.
- src/theme/: design tokens.
- src/utils/: pure utilities.
- assets/: approved local artwork.

Data flow: route -> feature hook -> service -> typed API client -> existing Express API -> MongoDB. TanStack Query owns server state. Zustand must not duplicate server records.

Use responsive layouts across native and web. Verify Expo Doctor, typecheck, web export and native preview builds before release.
