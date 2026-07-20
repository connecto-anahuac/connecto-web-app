# Feature Checklist

- Add or update `types/` first when new UI state or enums are needed.
- Add `queries/` helpers and key factories before writing hooks.
- Put query hooks in `hooks/query/`.
- Put mutation hooks in `hooks/mutation/`.
- Put interactive UI under `components/client/<Widget>/`.
- Put server entry templates under `components/server/<Page>/`.
- Add colocated tests for the hook or widget that owns behavior.