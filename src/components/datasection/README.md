# DataSection

検索・プリセット・表示切替・テーブル操作ツールをまとめる共通レイアウトです。データの状態を持たず、渡されたコールバックまたは TanStack `Table` を操作します。

## レイアウト

1. 検索バーとプリセットチップ
2. フィルターグループ
3. リスト／カード切替、Sort、Ocultar、Pivot、件数
4. `listDiagram` または `cardDiagram`

`defaultView` は表示開始ビュー、`onViewChange` はビュー切替の通知に使います。

## TanStack Table 連携

新しいテーブル利用では `table` と `tableConfig` を必ず対で渡します。

```tsx
<DataSection
  table={table}
  tableConfig={STUDENT_CLASS_VIEW_CONFIG}
  searchText={globalFilter}
  onSearchTextChange={setGlobalFilter}
  presets={presets}
  listDiagram={<DataTable table={table} config={STUDENT_CLASS_VIEW_CONFIG} />}
  cardDiagram={<StudentDiagram items={items} />}
/>
```

- 検索バーは呼び出し側の global filter 状態を更新します。
- 2行目は `TableFilterButtonGroup` に切り替わり、TanStack の column filter を直接更新します。
- `Ocultar` と `Pivot` は全列を表示し、同じメニューから非表示列の復元・固定解除もできます。
- `Sort` は `SortingState` を編集します。SortCard は追加、削除、方向切替に加え、HTML Drag and Drop で優先順位を変更します。カード上から順が優先順位です。
- 件数は `table.getFilteredRowModel()` を表示します。

## 旧検索エンジンとの互換

`table` と `tableConfig` を渡さない既存画面では、従来どおり `definitions` を使う `FilterButtonGroup` を描画します。この経路は既存の `DataSearchProvider` と検索ストア向けです。

StudentDetail では TanStack Table が唯一のリスト状態源です。カードグリッドは移行中のため、現時点ではテーブルのフィルター・ソート・列操作と連動しません。
