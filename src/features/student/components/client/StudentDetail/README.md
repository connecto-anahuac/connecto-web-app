# StudentDetail client slice

This slice renders one student's profile, academic overview, and curriculum.

## Responsibilities

- `StudentDetailContainer.tsx` owns the filter scope, loads the student and plan,
  creates the grade table, and passes flat display props to the presenter.
- `studentDetailViewModel.ts` contains pure profile and overview-card builders.
- `StudentDetailPresenter.tsx` is stateless and renders `ProfileSummary`, the
  overview tab, and the curriculum `DataSection` with table and diagram views.
- `useStaticStudentDetail.ts` loads the current student and derives UI-grade data.
- `useStudentClassTable.ts` connects the scoped filter store to TanStack Table.

## Data flow

```text
useStaticStudentDetail + useStudentClassTable
  -> StudentDetailContainer
  -> studentDetailViewModel
  -> StudentDetailPresenter
  -> ProfileSummary / overview cards / DataSection
```
