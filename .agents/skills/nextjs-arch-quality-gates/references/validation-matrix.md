# Validation Matrix

Run commands from `frontend/`.

Route or app structure changes:

- `pnpm typegen`
- `pnpm lint`

Hook, component, action, handler changes:

- `pnpm lint`
- `pnpm test:run`

Broad refactor or cross-layer change:

- `pnpm typegen`
- `pnpm lint`
- `pnpm test:run`
- `pnpm format:check`

Primary command source:

- `frontend/package.json`