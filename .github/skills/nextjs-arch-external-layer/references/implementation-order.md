# Implementation Order

Add new server-backed functionality in this order:

1. `external/dto/<domain>`
2. `external/repository/<domain or backend>`
3. `external/service/<domain>`
4. `external/handler/<domain>/*.server.ts`
5. `external/handler/<domain>/*.action.ts` when the client needs it
6. feature hooks or server templates that call the handler

This keeps contracts and boundaries stable while the UI is wired.