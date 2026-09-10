
# DataSearchRootProvider 
は、createFilterStore() で Zustand ストアを一度だけ生成し、子孫へ共有します。useState(createFilterStore) にしているため、再レンダーのたびにストアが作り直されません。

# DataSearchProvider 
は便利な合成版です。
親に DataSearchRootProvider がある場合：scope だけ追加する
親ストアがない場合（Storybook や単独ウィジェットなど）：自分で root ストアも作る

# DataSearchScopeProvider 
はストアを作りません。scopeId だけを渡します。これにより、同じストア内でも例えば以下を別々に保持できます。
students:list：学生一覧の検索条件
student:grades:123：学生 123 の成績一覧の検索条件

```tsx
<DataSearchRootProvider> {/* 検索状態を保持するストアを1つ作る */}
  <DataSearchProvider scopeId="students:list"> {/* 学生一覧用の状態を選ぶ */}
    <StudentsPageTemplate />
  </DataSearchProvider>
</DataSearchRootProvider>
```

# usage

zustandから直接 useStore を呼ぶのではなく、useDataSearchActions() と useDataSearchQuery() を使うことを推奨します。scopeId は必須です。
`src/features/search/components/Provider/useFilterStore.tsx`の取得関数経由で取得



# DataSearchProvider

検索状態は、アプリケーションに1つだけ置く `DataSearchRootProvider` のregistryへscope単位で保持します。`DataSearchProvider` は画面や独立した検索領域へscopeを設定する互換用compound providerです。Provider自体は検索対象データを持たず、検索実行は `features/search/shared/useDataSearch.ts` が担当します。

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

Storeの正本は `queriesByScope` だけです。`setSearchText`、`setConditions`、`upsertCondition`、`removeCondition`、`clearScope` はscope IDを必須とします。`conditions` は旧UI向けhookが `query.conditions` から導出する互換投影で、storeには重複保存しません。

## Provider境界

root providerはroute切り替えで破棄されないlayoutに置きます。検索条件を共有したいUIを同じscopeで囲み、検索対象が異なる領域には異なる安定したscope IDを割り当てます。

```tsx
<DataSearchRootProvider>
  <DataSearchProvider scopeId="students:list">
  <StudentsShell />
  </DataSearchProvider>

  <DataSearchScopeProvider scopeId={`student:grades:${studentId}`}>
    <StudentDetail />
  </DataSearchScopeProvider>
</DataSearchRootProvider>
```

これにより学生一覧の条件がStudentDetailへ混入せず、学生ごとの条件もroute切り替え後に復元できます。`FilterProvider` は移行互換の別名であり、新規コードでは使用しません。
