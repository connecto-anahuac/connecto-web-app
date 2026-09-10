# 学生テーブルと詳細パネルのルート連携

## Summary

- 行の単クリックで `/students?studentId=1111` に `router.replace` し、右側に学生詳細パネルを表示する。
- 行のダブルクリック、またはパネル内の `PanelControllButton` で `/students/1111` へ `router.push` する。
- 閉じるボタンは `studentId` だけをURLから削除する。
- セル内のボタン・リンク・入力要素・将来追加される独自操作は、行イベントを発火させない。

## Implementation Changes

- `/students/page.tsx` で `PageProps<"/students">` の `searchParams.studentId` を読み、空文字や配列を正規化して `StudentsPageTemplate` に渡す。
- `/students/layout.tsx` はProviderと`children`だけを描画する構成に変更する。これにより `/students/[id]` では一覧を表示せず、既存の詳細ページを全面表示できるようにする。
- `StudentsPageTemplate` は以下を描画する。
  - 常時：`StudentCollectionContainer`
  - `studentId` がある場合：右端のオーバーレイパネルと `StudentDetailContainer`
  - パネルの `PanelControllButton`：`/students/${encodeURIComponent(studentId)}` へ遷移
  - 閉じるボタン：他のクエリを維持して `studentId` のみ削除
- URL操作はfeature側のクライアントhookに集約する。
  - `selectStudent(id)`：現在のクエリを複製し、`studentId` を設定して `router.replace`
  - `closeStudentPreview()`：`studentId` のみ削除して `router.replace`
  - `openStudentDetail(id)`：詳細ルートへ `router.push`
- `StudentCollectionContainer` がURL操作を所有し、Presenterにはフラットな行コールバックと選択中IDを渡す。Presenterにはルーターを直接持たせない。

### DataTable API

共通`DataTableProps<TItem>`へ次を追加する。

```ts
onRowClick?: (
  item: TItem,
  event: React.MouseEvent<HTMLDivElement>,
) => void;

onRowDoubleClick?: (
  item: TItem,
  event: React.MouseEvent<HTMLDivElement>,
) => void;

isRowActive?: (item: TItem) => boolean;
```

- 行クリックは直ちにプレビューを開く。ダブルクリック時は通常の2回目のclickを無視し、`onDoubleClick`で詳細へ遷移する。
- 行には選択スタイル、`aria-selected`、操作可能な場合の`tabIndex={0}`を設定する。
- Enter／Spaceは単クリック相当としてプレビューを開く。詳細ページへのキーボード導線はパネル内の`PanelControllButton`が担う。
- イベント発火元が以下の場合、行のclick/double-click/keyboard処理を停止する。
  - `a`, `button`, `input`, `select`, `textarea`
  - `[role="button"]`, `[role="link"]`
  - `[data-row-interaction="ignore"]`
- 非標準要素でセル独自操作を実装する場合は、操作要素またはそのラッパーに `data-row-interaction="ignore"` を付ける。これを将来のセル操作に対する明示的な拡張ポイントとする。

## Test Plan

- 共通DataTable：
  - 通常セルの単クリックで`onRowClick`が1回呼ばれる
  - ダブルクリックで`onRowDoubleClick`が呼ばれる
  - ボタン、リンク、入力要素、ignore属性内の操作では行イベントが呼ばれない
  - Enter／Spaceでプレビュー操作が呼ばれる
  - 選択行に`aria-selected`と選択スタイルが付く
- 学生feature：
  - 行クリックで既存クエリを維持した `/students?studentId=1111` にreplaceされる
  - パネルボタンと行ダブルクリックで `/students/1111` にpushされる
  - 閉じるボタンで`studentId`だけが削除される
  - `studentId`なしではパネルを表示せず、指定時は正しいIDで詳細を表示する
  - 存在しないIDでは既存の「Student not found」をパネル内に表示し、閉じる操作は利用できる
- 検証コマンド：
  - `npm exec vitest -- run <変更したテストファイル>`
  - `npm run typegen`
  - `npm run lint`
  - `npm run build`

## Assumptions

- URL形式は `/students?studentId=1111` とする。
- 単クリックの学生切り替えは履歴を増やさないよう`replace`を使う。
- 詳細パネルは現在の案どおり右側40%、最大幅`2xl`のオーバーレイ表示とする。
- ダブルクリックでは単クリックによるプレビュー更新後に詳細ページへ進む。戻る操作では、その学生のプレビューが開いた `/students?studentId=...` に戻る。
- DB・DTO・学生詳細データ取得処理は変更しない。
