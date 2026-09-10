# DataSection Preview Migration Plan

## Goal

When `listDiagram` is not supplied, `DataSection` renders its default `DataTable`
and owns the preview panel behavior currently provided by `DataTableWithPreview`.
The preview panel must be positioned inside `DataSection` itself and must not be
implemented by rendering `DataTableWithPreview` in the graph slot.

## Architectural invariants

- `DataSection` directly renders `DataTable` for its default list view.
- The preview `aside` is a sibling of the graph container under the positioned
  `DataSection` root.
- The preview is visible only when the list view is selected, `listDiagram` is
  absent, and `selectedRowId` exists.
- Feature containers/hooks continue to own selected IDs and navigation actions.
- Feature presenters remain stateless and only pass flat props.
- Existing custom `listDiagram` consumers keep their current rendering behavior.
- `DataTableWithPreview` is not removed until every runtime consumer is migrated.

## Baseline (2026-09-10)

- Targeted tests: 3 passed, 2 failed.
- `DataSection` failures are caused by undeclared preview identifiers in the
  partial migration.
- TypeScript reports missing preview props and an incorrect requirement for the
  `DataTableProps.config` prop.
- The worktree contains unrelated user changes; implementation must not revert or
  rewrite them.

## Checkpoints

- [x] CP1: Repair `DataSectionProps` without inheriting all of `DataTableProps`.
  Model custom-list and default-list usage so preview requirements apply only to
  the default list path.
- [x] CP2: Render the default `DataTable` directly and map row interactions to IDs.
- [x] CP3: Render and position the preview panel at the `DataSection` root with the
  required list/default/selected visibility guard.
- [x] CP4: Replace delegation-based `DataSection` tests with direct behavior tests
  covering custom list priority, row mapping, preview controls, absence cases, and
  accessibility labels.
- [x] CP5: Run the focused shared-component tests and TypeScript check. Do not begin
  consumer migration until the shared slice is sound or remaining failures are
  proven unrelated.
- [x] CP6: Migrate Student, Classroom, Professor, and Plan collection consumers to
  the repaired `DataSection` contract while keeping state/navigation in their
  existing containers/hooks.
- [x] CP7: Run affected feature tests, focused lint, and TypeScript checks.
- [x] CP8: Confirm no runtime imports of `DataTableWithPreview` remain, then remove
  its component, barrel export, and dedicated tests.
- [x] CP9: Run the broadest available npm-based test/lint/type checks and inspect the
  final scoped diff for accidental changes.

## Validation commands

- `npm exec vitest -- run <focused test files>`
- `npm exec tsc -- --noEmit --pretty false`
- `npm run lint -- <changed files>`
- `npm exec vitest -- run`

## Progress log

- 2026-09-10: Plan fixed from repository inspection and baseline validation.
- 2026-09-10: CP1-CP5 reviewed complete. DataSection tests pass 6/6,
  focused ESLint and diff check pass. TypeScript is clean for the shared slice;
  the sole remaining error is the obsolete consumer `config` prop in
  `ClassCollection.tsx`, assigned to CP6.
- 2026-09-10: CP6-CP7 reviewed complete. Plan, Student, Classroom, and
  Professor use the DataSection default-list contract; Class retains its custom
  list diagram. Focused feature tests and lint pass, and the main-thread
  TypeScript/lint rerun passes on the consolidated worktree. Runtime
  DataTableWithPreview references remain only in its own component directory.
- 2026-09-10: CP8 complete. Removed the legacy component, barrel export, and
  dedicated test after confirming no external runtime references.
- 2026-09-10: CP9 complete. Consolidated TypeScript passes; focused lint passes;
  related tests pass (7 files, 21 tests); scoped diff check passes; and no
  DataTableWithPreview references remain in `src`. The broad test run has nine
  unrelated pre-existing filter-schema expectation failures and cannot launch the
  missing local Playwright Chromium binary. The broad lint run also fails on
  pre-existing/generated files (including `storybook-static`), while all touched
  source files pass focused lint.
