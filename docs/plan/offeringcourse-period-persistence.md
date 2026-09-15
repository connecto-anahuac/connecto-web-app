# OfferingCourse Period-scoped Persistence

## Goal

Persist and restore offering-course selections through the existing `external` boundary, scoped by the `period` received by `ScheduleBuilderPageTemplate`.

## Invariants

- `app/` only resolves route input and passes it to the feature template.
- Feature code accesses persistence only through `external/handler` and DTOs.
- `OfferingCoursePanel` remains UI/store-oriented; `useScheduleBuilder` orchestrates persistence.
- Selection identity is `(career, period, courseKey)`.
- Switching periods for the same career cannot retain or hydrate stale selection state.
- Existing records for period `202660` remain addressable with the same composite ID.
- No Dexie schema migration is required because `period` and `[career+period]` are already indexed.

## Workstreams

### A. External boundary and persistence

- [x] Add required `period` to the update DTO.
- [x] Make selection query, detail query, save, and delete receive `period` explicitly.
- [x] Generate offering selection IDs from `career`, `period`, and `courseKey`.
- [x] Remove persistence-service dependence on the fixed offering period constant.
- [x] Separate the client write handler from the query handler if this can be done without widening the change.
- [x] Add/update service tests for period-scoped save, delete, list, and detail lookup.

### B. Route and feature orchestration

- [x] Resolve `period` in the offering-course route and pass it to `ScheduleBuilderPageTemplate`.
- [x] Pass `period` through the template and container to `useScheduleBuilder`.
- [x] Include `period` in the filter/provider scope.
- [x] Supply `period` to all external selection/detail reads and writes.
- [x] Ensure hook effects and callbacks react to period changes.

### C. Client state isolation

- [x] Store the active `period` alongside `career`.
- [x] Reset and hydrate state using the full `(career, period)` scope.
- [x] Reject delayed hydration and queued draft writes from a stale period.
- [x] Add store tests for same-career period changes and stale work.

## Integration Review

- [x] Confirm handler-only feature imports.
- [x] Confirm all selection operations use the same period.
- [x] Confirm no direct persistence import was added to `OfferingCoursePanel`.
- [x] Confirm the three workstreams compose without signature gaps.
- [x] Review the final diff for unrelated changes.

## Validation

- [x] Focused offering-course unit tests pass (7 files, 19 tests).
- [x] `npm run typegen` passes.
- [x] Changed-scope ESLint passes.
- [ ] Full `npm run lint` passes. Blocked by pre-existing repository/generated-output errors outside this change.
- [ ] Full unit suite passes. 135/144 pass; 9 existing filter API expectation failures remain outside this change.
- [ ] Full `tsc --noEmit` passes. One existing `DataTablePresenter.test.ts` `bgColor` type error remains outside this change.
- [x] `git diff --check` passes.

## Status Log

- 2026-09-14: Plan created. Implementation delegated across external, feature/route, and state workstreams.
- 2026-09-14: Workstream C reviewed complete; focused store tests passed (9/9).
- 2026-09-14: Workstream A reviewed complete; focused external tests passed (5 files, 9 tests).
- 2026-09-14: Workstream B reviewed complete; route type generation and focused lint passed.
- 2026-09-14: Integration review complete. Targeted gates pass; unrelated repository-wide failures are recorded above and were not modified.
- 2026-09-14: Final review added a `(career, period)` key to the state provider, closing the pre-effect stale-scope window; focused tests remained green.
- 2026-09-14: Implementation complete. All change-scoped gates pass; repository-wide pre-existing failures remain documented under Validation.
