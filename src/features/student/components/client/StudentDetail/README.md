# StudentDetail client slice

学生詳細画面のクライアント側オーケストレーションです。学生情報を読み込み、StudentClassItem のリストを TanStack Table とグリッド表示へ渡します。

## 責務分担

- `StudentDetailContainer.tsx`: データ取得 hook と table hook を呼び、Presenter に平坦な props を渡します。
- `useStaticStudentDetail.ts`: 現在の学生情報と履修計画を取得し、UI モデルへ変換します。
- `useStudentClassTable.ts`: TanStack の global filter、column filter、sorting、visibility、pinning、sizing を所有します。状態はこの画面のマウント中だけ保持します。
- `StudentDetailPresenter.tsx`: 表示専用です。`DataSection`、`DataTable`、`StudentDiagram` を組み立てます。
- `StudentDiagram.tsx`: カードグリッドを描画します。移行期間中は元の `StudentClassItem[]` を受け取り、テーブル状態には連動しません。

## データフロー

```text
useStaticStudentDetail
  -> StudentClassItem[]
  -> useStudentClassTable
  -> Table<StudentClassItem> + DataViewConfig
  -> DataSection / DataTable
```

検索文字列、フィルター、プリセット、ソート、列の固定・非表示・幅は `useStudentClassTable` の TanStack 状態を正とします。既存の `useDataSearch` と FilterProvider はこのリストの状態には使いません。

## 変更時の注意

- 新しい列は `features/student/types/studentClassViewConfig.ts` に追加します。Presenter や DataTable にドメイン条件を追加しません。
- フィルターやソートの挙動は `useStudentClassTable.ts` に追加します。
- グリッドを TanStack 状態へ連動させる移行は別作業です。現時点で `StudentDiagram` に filterable entry を戻さないでください。
- データ取得契約を変える場合は、この client slice ではなく `external/` と DTO 層から変更します。
