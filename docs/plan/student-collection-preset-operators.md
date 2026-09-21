# Student collection preset operators

## Goal

Allow each StudentCollection filter preset to declare its own operator so enum
presets can continue to use `in` while numeric presets can use operators such as
`gt`.

## Implementation plan

1. Type `STUDENT_COLLECTION_PRESETS` with the shared
   `FilterPresetConfig<StudentCollectionFieldId>` model.
   - Use `filterKey`, `conditionValue`, and `operator`.
   - Keep status/career presets on `in`.
   - Define the failing-class preset as `failedClassCount > 0`.
2. Replace the `in`-specific preset logic in `useStudentCollectionTable` with
   `isFilterPresetSelected` and `getFilterPresetNextCondition`.
3. Keep `operatorPolicy.ts` as the single source of allowed operators. No new
   operator is required because numeric `gt` is already supported.
4. Add or update focused tests for:
   - numeric `gt` condition creation and selection;
   - operator-sensitive selection;
   - unchanged enum `in` behavior;
   - preset field/operator compatibility;
   - the existing `fieldId` expectation mismatch in the shared preset test.
5. Validate with focused Vitest tests, change-scoped ESLint, and TypeScript
   checking using npm-based commands.

## Scope constraints

- Do not change unrelated schedule-builder or shared UI work already present in
  the working tree.
- Do not expand this into per-column operator overrides; this change concerns
  declarative presets only.
- Preserve `operatorPolicy.ts` unless a test demonstrates a policy defect.
