# Schedule card warning levels

## Decision table

| `conflictCodes` | Card `warning` |
| --- | --- |
| Empty | `undefined` (no alert) |
| Only `professor_unassigned` and/or `classroom_unassigned` | `"mid"` |
| Any other conflict code (including a mix with unassigned codes) | `"high"` |

`"low"` is supported by the card API but is not produced by the current canvas
conflict mapping. The card adapts `"mid"` to the shared `Alert` primitive's
`"medium"` level without changing that shared primitive.

## Target files

- `src/features/scheduleBuilder/component/ClassCard.tsx`
- `src/features/scheduleBuilder/component/ClassCard.test.tsx`
- `src/features/scheduleBuilder/component/ClassCard.stories.tsx`
- `src/features/scheduleBuilder/client/scheduleBuilderCanvas/ScheduleBuilderCanvasPresenter.tsx`
- `src/features/scheduleBuilder/client/scheduleBuilderCanvas/ScheduleBuilderCanvasPresenter.test.tsx`

## Verification

Run in this order:

1. `npm exec -- vitest run src/features/scheduleBuilder/component/ClassCard.test.tsx src/features/scheduleBuilder/client/scheduleBuilderCanvas/ScheduleBuilderCanvasPresenter.test.tsx`
2. `npm run lint -- src/features/scheduleBuilder/component/ClassCard.tsx src/features/scheduleBuilder/component/ClassCard.test.tsx src/features/scheduleBuilder/component/ClassCard.stories.tsx src/features/scheduleBuilder/client/scheduleBuilderCanvas/ScheduleBuilderCanvasPresenter.tsx src/features/scheduleBuilder/client/scheduleBuilderCanvas/ScheduleBuilderCanvasPresenter.test.tsx`
3. `npm exec -- tsc --noEmit`

## Completion criteria

- `warning` accepts only `low`, `mid`, or `high`, and an omitted warning renders no alert.
- Canvas mapping follows the decision table and prioritizes `high`.
- Component tests, Canvas tests, lint, and TypeScript typecheck pass.
