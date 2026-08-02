# DataSection

検索、プリセット、フィルター、ソート、表示切替をまとめる共通レイアウトです。

フィルターUIには `tableConfig` と `metadata` を渡します。`FilterButtonGroup` は `DataViewColumn` を描画し、検索scopeの `SearchQuery` を更新します。

```tsx
<DataSection
  table={table}
  tableConfig={config}
  metadata={metadata}
  searchText={globalFilter}
  onSearchTextChange={setGlobalFilter}
  presets={presets}
  listDiagram={<DataTable table={table} config={config} />}
  cardDiagram={<StudentDiagram items={items} />}
/>
```

`table` はソート、列表示、固定、サイズ変更に使用します。検索・条件フィルターの正本は `DataSearchProvider` のscope別queryです。
