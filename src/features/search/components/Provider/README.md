# DataSearchProvider

`DataSearchProvider` は、1つの画面または独立した検索領域の `SearchQuery` を保持します。Provider自体はデータを持たず、検索実行は `features/search/shared/useDataSearch.ts` が担当します。

## 状態

```ts
type SearchQuery = {
  text: string;
  conditions: FilterCondition[];
};
```

- `text` はグローバルテキスト検索だけに使う。
- `conditions` はフィールド単位の検索条件だけに使う。
- `conditions[].value` は必ずcanonical value。option labelや表示文字列は保存しない。

Storeでは、`setSearchText`、`upsertCondition`、`removeCondition`、`clear` を提供します。`conditions` は旧UIとの互換投影としても公開されていますが、新規コードでは `query` を読み、`useDataSearch` を通して結果を得てください。

## Provider境界

検索条件を共有したいUIを同じProviderで囲みます。検索対象が異なる画面・ネストした詳細画面には別Providerを置きます。

```tsx
<DataSearchProvider>
  <StudentsShell />
</DataSearchProvider>

<DataSearchProvider>
  <StudentDetail />
</DataSearchProvider>
```

これにより学生一覧の条件がStudentDetailの成績検索へ混入することを防ぎます。Providerを追加する際は、同じ画面内で旧 `FilterProvider` と新 `DataSearchProvider` を併用しないでください。`FilterProvider` は移行互換の別名であり、新規コードでは使用しません。
