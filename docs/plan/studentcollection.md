# リッチなテーブルセル表示の実装

## Summary

`accessor` と `format` はデータ処理・テキスト表現として維持し、テーブル専用の `cellRenderers` を追加する。初期適用は学生一覧の「名前＝Avatar＋文字列」「状態＝Badge」に限定する。`StudentCollectionPresenter` は変更せず、ステートレスな表示責務を維持する。

## Implementation Changes

- 共通テーブルに `DataTableCellRenderer<TItem>` と `DataTableCellRenderers<TItem, TFieldId>` を追加する。renderer は TanStack の `CellContext` を受け取り `ReactNode` を返す。
- `DataViewConfig` の field ID に後方互換な文字列ジェネリクスを追加し、学生一覧では `satisfies` を使ってrendererキーのタイプミスを検出する。
- `useTable` に任意の `cellRenderers` オプションを追加する。指定列はrenderer、未指定列は従来の `format` を使用し、ソート・フィルターは常に `accessor` の値を使用する。
- 共通 `Cell` の固定 `<span>` ラッパーをブロック要素を安全に格納できる構造へ変更する。通常文字列の省略表示はフォールバックrenderer側、リッチセルのレイアウトは各renderer側で管理する。
- セルの `title` は生の `cell.getValue()` ではなく `format(row.original)` を使用し、リッチ表示でもテキスト表現を保持する。
- 学生一覧に feature-local なrenderer定義を追加する。
  - `name`: 小サイズの既存 `Avator`、学生名、既存のAvatarカラーパレットを表示する。
  - `status`: 既存 `Badge` を表示し、activoは緑系、inactive/bajaはニュートラル系の見た目にする。状態は色だけに依存せず文字列も常時表示する。
- `StudentCollectionItem` に `avatarColorRef` を追加し、既存DTOの同名フィールドを一覧変換時に保持する。React要素はDTOや行データに格納しない。
- renderer定義はモジュールレベルの安定したオブジェクトとして `useStudentCollectionTable` に渡し、不要なColumnDef再生成を避ける。

## Public Interfaces

```tsx
type DataTableCellRenderer<TItem> = (
  context: CellContext<TItem, unknown>,
) => ReactNode;

type DataTableCellRenderers<
  TItem,
  TFieldId extends string = string,
> = Readonly<Partial<Record<TFieldId, DataTableCellRenderer<TItem>>>>;

type UseTableOptions<TItem, TFieldId extends string = string> = {
  // existing options
  cellRenderers?: DataTableCellRenderers<TItem, TFieldId>;
};
```

renderer未指定時の挙動は従来どおりとし、`StudentDetail` を含む既存の `useTable` 呼び出しは変更不要にする。

## Test Plan

- 共通テーブル:
  - renderer指定列でReact要素が描画される。
  - renderer未指定列では `format` の文字列が描画される。
  - rendererを追加してもソート・フィルターには `accessor` の値が使用される。
  - `Cell` がAvatarやBadgeを含むブロック要素を不正な `<span><div>` 構造にしない。
  - リッチセルの `title` が `format` のテキストになる。
- 学生一覧:
  - DTOの `avatarColorRef` が `StudentCollectionItem` に引き継がれる。
  - 名前セルにAvatarのイニシャル、色、学生名が表示される。
  - 状態セルに状態文字列を持つBadgeと対応するトーンが表示される。
  - 既存のloading、error、empty-table表示が変わらない。
- 検証はAGENTS.mdに従って `pnpm` を使わず、対象Vitest、`npm run lint -- <対象パス>`、`npx tsc --noEmit` の順に実行する。

## Assumptions

- 初期適用範囲はユーザー選択どおり「名前＋状態」。
- Avatarは画像URLではなく、既存 `Avator` のイニシャル表示と `avatarColorRef` に基づく色を使用する。
- 外部DTO、DB、ルート、データ取得方式は変更しない。
- `format` は検索、ツールチップ、将来のCSV出力などで利用できるプレーンテキスト契約として維持する。
