# StudentDetail client slice

学生詳細画面のクライアント側オーケストレーションです。学生情報を読み込み、StudentClassItem のリストを TanStack Table とグリッド表示へ渡します。

## 責務分担

- `StudentDetailContainer.tsx`: データ取得 hook と table hook を呼び、Presenter に平坦な props を渡します。
- `useStaticStudentDetail.ts`: Dexie の live query で現在の学生情報と履修計画を購読し、UI モデルへ変換します。
- `useStudentClassTable.ts`: scope付き検索storeを TanStack Table へ接続します。sorting、visibility、pinning、sizing は引き続き TanStack のローカル状態として所有します。
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

検索文字列とフィルターは `student:grades:${studentId}` scopeの検索storeを正とします。TanStack Table のcolumn filter APIは既存UIとのadapterであり、状態の所有者ではありません。学生を切り替えても、同一タブ中は学生ごとの検索条件が保持されます。

ソート、列の固定・非表示・幅は現時点では `useStudentClassTable` のTanStackローカル状態です。永続的な表示設定への移行は別作業です。

## 変更時の注意

- 新しい列は `features/student/types/studentClassViewConfig.ts` に追加します。Presenter や DataTable にドメイン条件を追加しません。
- フィルター条件は検索storeのcommandを通して変更します。TanStack stateを正本として追加しないでください。
- ソートや列表示の挙動は、外部状態へ移行するまでは `useStudentClassTable.ts` に追加します。
- グリッドを TanStack 状態へ連動させる移行は別作業です。現時点で `StudentDiagram` に filterable entry を戻さないでください。
- データ取得契約を変える場合は、この client slice ではなく `external/` と DTO 層から変更します。
