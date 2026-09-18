# Schedule course completion

## Objective

An offering course is completed only when every session is fully assigned and
has no validation errors. The completion value continues to flow through
`selectCompletedCourseKeys`; the presenter only renders that derived value.

## Completion predicate

`isScheduleCourseComplete(course)` returns `true` only when the course has at
least one session and every session satisfies all of the following:

- `requiredOccurrenceCount` is greater than zero.
- The required number of occurrences has been placed.
- `professorId` is assigned.
- Every occurrence has an assigned day and `timeSlotId`.
- Every occurrence has an assigned `classroomId`.
- Every occurrence has an empty `conflictCodes` array.

The existing `>= requiredOccurrenceCount` count behavior is retained. The
runtime assignment checks complement the non-null TypeScript fields and guard
against incomplete data.

## Implementation scope

- Update the canonical predicate in
  `src/features/scheduleBuilder/lib/schedule-draft.ts`.
- Expand colocated predicate tests in
  `src/features/scheduleBuilder/lib/schedule-draft.test.ts`.
- Update selector/store behavior tests in
  `src/features/scheduleBuilder/client/scheduleBuilderStore.test.ts`.
- Do not move completion logic into
  `OfferingCourseShellPresenter.tsx`; it remains a stateless renderer.
- Do not change conflict definitions or unrelated canvas completion rendering.

## Required test coverage

- Required occurrences alone do not complete a session.
- Missing professor, time, or classroom keeps the course incomplete.
- Any occurrence conflict keeps the course incomplete.
- One incomplete session keeps a multi-session course incomplete.
- Every fully assigned, conflict-free session completes the course.
- `selectIsCourseComplete` and `selectCompletedCourseKeys` reflect the same
  predicate and revert to incomplete after a required assignment is removed or
  becomes invalid.

## Verification

Run in this order:

1. `npm exec -- vitest run src/features/scheduleBuilder/lib/schedule-draft.test.ts src/features/scheduleBuilder/client/scheduleBuilderStore.test.ts`
2. `npm run lint -- src/features/scheduleBuilder/lib/schedule-draft.ts src/features/scheduleBuilder/lib/schedule-draft.test.ts src/features/scheduleBuilder/client/scheduleBuilderStore.test.ts`
3. `npm exec -- tsc --noEmit`

## Progress checklist

- [x] Canonical completion predicate updated.
- [x] Predicate unit-test matrix updated.
- [x] Store/selector tests updated.
- [x] Focused tests pass (2 files, 15 tests).
- [x] Scoped lint passes.
- [ ] TypeScript typecheck passes. Blocked by the pre-existing, out-of-scope
  `bgColor` type error in
  `src/shared/component/composite/table/DataTable/DataTablePresenter.test.ts:128`.
- [x] Final diff matches this scope and leaves the presenter unchanged.
