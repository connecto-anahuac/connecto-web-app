# Search shared

データ一覧・カードグリッド共通の、クライアント側検索基盤です。学生一覧、StudentDetail、開講科目スケジュールはこの層を使います。

## まず読むファイル

- `filterField.ts`: `DataPropertyConfig<TItem>`。データプロパティの唯一の定義元。
- `filterFactory.ts`: 設定を実行用の `CompiledPropertySchema<TItem>` にコンパイルする。
- `filterEngine.ts`: `EngineContext` と Filter / Search / Score の実行パイプライン。
- `useDataSearch.ts`: Reactコンテナが使う標準フック。
- `../components/Provider/README.md`: `DataSearchProvider` とquery状態の配置ルール。

## 値の責務

各プロパティでは、同じ値を用途別に分けます。ラベルを条件や比較に保存してはいけません。

| 値 | 役割 | 例: 状態 |
| --- | --- | --- |
| source value | ViewModelから取得した入力値 | `"failed"` |
| canonical value | 条件、比較、option識別に使う正規値 | `"failed"` |
| display value | フィルタUIと画面へ表示する値 | `"Reprobado"` |
| search text | 全文検索の照合対象 | `"Reprobado"` |

`FilterCondition.value` と `SearchQuery.conditions` に保存できるのは canonical value だけです。optionの `value` はcanonical value、`label` はdisplay valueです。optionフィールドの全文検索はlabelを対象にし、内部valueを検索しません。

## プロパティを追加する

ドメインの `types/*FilterConfigs.ts` に、`defineDataProperty` で定義します。

```ts
const properties: DataPropertyConfig<Student>[] = [
  defineDataProperty<Student>({
    key: "status",
    label: "Estado",
    icon: "status",
    valueType: "enum",
    inputType: "option",
    getValue: (student) => student.status,
    options: [
      { value: "failed", label: "Reprobado" },
      { value: "passed", label: "Aprobado" },
    ],
    search: true,
  }),
];
```

- `getValue` はsource valueだけを返す。
- `normalize` は入力値とsource valueをcanonical valueにそろえる必要がある場合だけ指定する。標準では text/enum は文字列、number は有限数、date はtimestamp、boolean はbooleanへ変換する。
- `formatDisplay` はoption labelでは表せない表示値にだけ指定する。
- `search: true` を指定したフィールドだけが全文検索対象になる。検索範囲を意図せず増やさないため、明示指定を推奨する。
- `dynamicOptions: true` は現在のデータセットからcanonical valueを重複排除してoptionを作る。

## EngineContext と実行順

`runSearch` は以下を持つ不変の `EngineContext` を作成し、各Engineは次のcontextを返します。

```text
source   : 入力データ。Engineは変更しない
query    : text と canonical conditions
runtime  : コンパイル済みプロパティ、option label mapなどの実行メタデータ
working  : EvaluationEntry[]。各Engineが判定・hit・scoreを更新する作業領域
result   : finalize後のentriesとmatchCount
```

標準の順序は次のとおりです。

```text
FilterEngine → SearchEngine → ScoreEngine → finalize
```

- FilterEngine: フィールド間はAND、`in` の選択値はORで比較する。
- SearchEngine: search textの完全一致・前方一致・部分一致を記録する。
- ScoreEngine: 一致種別を 3 / 2 / 1 点として最高scoreを設定する。
- finalize: `filterPass && searchPass` を `isMatch` に確定する。

SortやHighlightを追加する場合は `SearchEnginePlugin<TItem>` を実装し、`runSearch` のplugin配列へ明示的に登録する。既存Engineの責務へ混ぜない。

## Reactでの利用

対象画面を `DataSearchProvider` で囲み、コンテナで `useDataSearch` を呼びます。

```tsx
const {
  definitions,
  searchText,
  setSearchText,
  listEntries,
  gridEntries,
} = useDataSearch(STUDENT_GRADE_FILTER_FIELDS, studentGrades);
```

- `definitions` はフィルタUIへ渡すコンパイル済みプロパティ。
- `listEntries` は一致したレコードだけを元の順序で返す。
- `gridEntries` は全レコードを返す。カード側が `entry.isMatch` でopacityなどを決める。
- presetは `FilterCondition` をcanonical valueで作り、Providerのcondition操作を通して更新する。

## テスト

- schema/value変換: `filterFactory.test.ts`
- Engineとlist/grid結果: `filterEngine.test.ts`
- Provider状態: `../components/Provider/filterStore.test.ts`

Storybookのブラウザテストとは分離してユニットテストを実行する場合は、次を使います。

```powershell
.\node_modules\.bin\vitest.cmd run --config vitest.unit.config.ts
```
