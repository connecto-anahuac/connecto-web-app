# Table components

TaTanStack Table の状態を受け取り、テーブル表示と列単位の操作 UI を提供する共有コンポーネントです。ここではデータ取得やドメイン固有の列定義を持ちません。

## 主なファイル

- `DataTable.tsx`: ヘッダー・行・セルを描画し、列のリサイズ、ソート、左固定、非表示、列フィルターを提供します。
- `dataView.types.ts`: リストと将来のグリッドで共用する `DataViewConfig<TItem>` の型です。
- `HeaderCell.tsx` / `Cell.tsx`: テーブルの見た目の基本セルです。`DataTable` はこの2つを使って描画します。

## 利用契約

`DataTable` は、状態を管理済みの TanStack `Table<TItem>` と対応する設定を受け取ります。

```tsx
<DataTable table={table} config={STUDENT_CLASS_VIEW_CONFIG} />
```

状態の所有者は呼び出し側です。`DataTable` は `table` の `sorting`、`columnFilters`、`columnVisibility`、`columnPinning`、`columnSizing` を操作しますが、fetch や Zustand 検索ストアには依存しません。

## DataViewConfig

`DataViewColumn<TItem>` は列 ID、ラベル、アイコン、値型、`accessor`、表示用 `format` を定義します。

filter検索にかけられる値は、accessor,searchtexts,options.labelすべて。

- `accessor`: TanStack のgetValue(colId)の返り値。比較・ソート・フィルターに使う生の値を返します。
- `format`: セルに表示する文字列を返します。
- `searchTexts`: テキスト検索時の文字列、複数指定したい場合。
- `valueType`: `text`、`number`、`enum`。enum は `options` を指定すると複数選択フィルターになります。
- `initialSize`: 指定がなければヘッダー文字数から最小サイズを計算します。
- `minWidth` / `maxWidth`: optional width bounds. Defaults are `140` and `1200`.

Initial column width is not stored in config. `useTable` estimates it from the header label length plus the compact header action area and then clamps it with `minWidth` / `maxWidth`.

設定の実体はドメイン側に置きます。現在の StudentClassItem 用設定は `features/student/types/studentClassViewConfig.ts` です。

## 列操作

- ヘッダーのソートボタンは昇順・降順を切り替え、数値列と文字列列で別のアイコンを表示します。
- 列幅が狭いときは pivot・filter・hide を三点メニューにまとめ、ソートは常に表示します。
- ヘッダー本体のクリックでも同じ列メニューを開きます。
- pivot は TanStack の left pinning、hide は column visibility、ドラッグ境界は column sizing に対応します。

`TableFilterButtonGroup` と `TableColumnFilter` は `DataSection` およびヘッダー用の制御型フィルター UI です。既存の検索エンジン向け `FilterButtonGroup` とは状態を共有しません。
