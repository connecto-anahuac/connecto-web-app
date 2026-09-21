# Offering Course Shell Implementation Plan

## Goal

Build the schedule builder's left-side `OfferingCourseShellContainer` as a
single-column list of `ScheduleClassCard` items. The shell supports only text
search, sort, filter, and presets. View switching, hide, pivot, zoom, row
selection, detail panels, and mutations are out of scope.

## Guardrails

- Preserve unrelated and pre-existing worktree changes.
- Use `npm`, never `pnpm`.
- Keep the presenter stateless; put fetching and derived behavior in hooks and
  the container.
- Feature code may call `external/handler` and use `external/dto`, but must not
  import services or repositories.
- Do not reuse the mutation-heavy offering-course `useScheduleBuilder` hook.
- Do not fabricate unavailable professor, classroom, or scheduled-session data.
- Keep existing `DataSection` consumers backward compatible.

## Workstream A: DataSection capability visibility

- [x] Make `DataSection` render only enabled tools instead of showing omitted
      tools as disabled controls.
- [x] Hide `GraphSwitcher` when only one view is enabled.
- [x] Hide the filter row when `filter` is not enabled for the selected view.
- [x] Add a backward-compatible way to hide the zoom control; use it in the
      offering-course shell.
- [x] Preserve current defaults for existing consumers.
- [x] Add focused `DataSection` tests for visibility and backward compatibility.

## Workstream B: OfferingCourseShell feature slice

- [x] Pass required `career` and `period` values from `ScheduleBuilderTemplate`
      to `OfferingCourseShellContainer`.
- [x] Add a read-only hook that loads offering courses for the active career,
      exposes loading/error state, and ignores stale async results.
- [x] Add a shell-local table/filter hook using
      `OFFERING_COURSE_VIEW_CONFIG` and the shared filter store.
- [x] Provide dynamic recommended-semester presets through the existing
      `FilterPreset` condition machinery.
- [x] Add a stateless `OfferingCourseShellPresenter`.
- [x] Render `table.getRowModel().rows` as a vertically scrollable, single-column
      list so search, sort, filter, and presets affect both membership and order.
- [x] Adapt `ScheduleClassCard` for an unscheduled offering-course variant:
      missing professor/classroom/session details are omitted rather than filled
      with fake values.
- [x] Add colocated tests covering loading, error, empty state, mapping, filtered
      membership, sorted order, and preset toggling where practical.

## Integration Contract

The shell will configure `DataSection` with:

```tsx
defaultView="list"
enableView={["list"]}
listTools={["sort", "filter"]}
showZoom={false}
```

The custom `listDiagram` must use the TanStack table row model, not the raw
offering-course array. `DataSection` owns the search/filter/sort controls; the
shell owns only the one-column card rendering.

## Validation

- [x] Run focused Vitest tests for `DataSection` and `OfferingCourseShell`.
- [x] Run ESLint on all touched files.
- [x] Run TypeScript with `npm exec tsc -- --noEmit` (command run; blocked by
      the pre-existing `DataTablePresenter.test.ts:128` `bgColor` mismatch).
- [x] Run `npm run typegen` if route-facing types change (not required; no route
      file or generated route contract changed).
- [x] Inspect the final diff for unrelated edits and scope drift.

## Status Log

- 2026-09-14: Plan created. Implementation not yet started.
- 2026-09-14: Workstream A delegated to `datasection_visibility` and
  Workstream B delegated to `offering_shell`; implementation is in progress.
- 2026-09-14: Workstream A completed and reviewed. Seven focused DataSection
  tests and scoped ESLint validation passed.
- 2026-09-14: Workstream B completed. Independent audit found no blocking
  implementation defect and identified a test gap, which was returned to the
  implementation agent and closed with real store/table and stale-request tests.
- 2026-09-14: Final integration validation passed: 4 test files / 13 tests,
  scoped ESLint, and scoped diff check. Full TypeScript remains blocked only by
  the unrelated pre-existing DataTable presenter test error noted above.
