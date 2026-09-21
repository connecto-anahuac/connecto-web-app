# Student diagram prerequisite highlight

## Scope

Keep the implementation inside `src/features/student/components/client/StudentDetail/` unless an existing shared contract makes that impossible.

## Implementation plan

- [x] Add a feature-local selection hook/helper that derives the selected course, its direct and transitive prerequisites, and deduplicated direct edges.
- [x] Make each eligible course card an accessible toggle button with `aria-pressed`; clicking the selected card again clears the selection.
- [x] Preserve the normal filter behavior (`opacity-10` and not clickable for unmatched cards), while selection mode keeps the selected prerequisite chain at normal opacity and dims every unrelated visible card with `opacity-40`.
- [x] Render prerequisite edges in a pointer-events-free SVG layer behind the cards, omitting edges whose endpoints are hidden or absent.
- [x] Recalculate edge geometry when selection, visible axes, layout size, or scrolling changes.
- [x] Add colocated tests covering chain, branching, deduplication, cycles, toggle clearing, filter precedence, hidden endpoints, and existing locator behavior.
- [x] Run focused Vitest, ESLint, and TypeScript validation with `npm`.
- [x] Clear an active selection from document-level pointer input outside every card belonging to that diagram instance.
- [x] Keep same-card toggle and different-card selection behavior independent from outside-selection clearing, with SSR-safe listener cleanup.
- [x] Add focused tests for card detection, diagram instance isolation, outside clearing, and listener lifecycle, then rerun validation.

## Acceptance criteria

- Selecting `C` in `A -> B -> C` leaves only `A`, `B`, and `C` at normal opacity and renders the direct edges `A -> B` and `B -> C`.
- Direct and indirect prerequisites are traversed safely when input contains cycles or duplicate prerequisite references.
- Selecting an already selected card returns the diagram to its filter-only state and removes all prerequisite lines.
- Filter-unmatched cards remain disabled in the normal state. During a selection, prerequisite context takes visual precedence so prerequisites are fully visible; unrelated cards are `opacity-40`.
- No line is rendered when either endpoint is outside the visible diagram because its row/column is hidden or the course is absent.
- Cards expose button semantics and `aria-pressed`, and lines never intercept pointer input.
- Existing `StudentClassCardView` styling, including `w-full hover:shadow-md`, remains intact.
- Clicking diagram whitespace, a diagram header, or anywhere outside the selected diagram clears its selection.
- Clicking any card inside the same diagram instance is not treated as an outside click: the selected card toggles off and another eligible card becomes selected.
- A card in a different diagram instance is outside the current instance, so each mounted diagram manages only its own selection.
- Document listeners are safe during SSR and removed when selection ends or the diagram unmounts.

## Progress

- Plan recorded before implementation.
- Implementation completed within the StudentDetail feature slice.
- Focused Vitest: 4 files, 18 tests passed.
- ESLint: no errors; one pre-existing warning remains in `studentDetailViewModel.ts` for the unused `totalSemesters` parameter.
- TypeScript (`tsc --noEmit`) and `git diff --check`: passed.
