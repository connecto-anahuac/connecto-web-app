# Search / Filter Engine

`src/features/search/shared` は、`DataViewConfig<TItem>` を入力として、テーブル・リスト・グリッドで共通利用する検索／絞り込みエンジンです。UI や状態管理から独立しており、同じ `SearchQuery` とデータセットに対して常に同じ評価結果を返します。

対象ファイル:

| ファイル | 役割 |
| --- | --- |
| `filterDefinition.ts` | 入出力、実行コンテキスト、プラグインの型契約 |
| `filterFactory.ts` | `DataViewConfig` を実行用スキーマへコンパイル |
| `filterEngine.ts` | 条件評価、全文検索、スコアリング、結果選択 |

## 全体の流れ

```text
DataViewConfig<TItem> + items
  -> buildDataViewMetadata()
  -> compileDataViewSchema()
  -> CompiledPropertySchema<TItem>

SearchQuery + items + schema
  -> createEngineContext()
  -> filterEngine -> searchEngine -> scoreEngine
  -> finalizeEngineContext()
  -> SearchResult<TItem> / FilterResult
```

`DataViewConfig` は表示用の `accessor` と `format` を持ちます。factory はその定義をエンジン向けの `CompiledProperty` に変換するため、呼び出し側がフィールドごとの比較・検索ロジックを重複して実装する必要はありません。

## 入力と型の契約

### 値

エンジン内部の比較値は `CanonicalValue`、すなわち `string | number | boolean` です。表示ラベルは条件値に保存せず、`enum` のような選択肢も値（例: `"active"`）で評価します。ラベル（例: `"Aprobado"`）は検索テキストとして追加されます。

`FilterConditionValue` は次のいずれかです。

| 形 | 用途 |
| --- | --- |
| 単一値 | `eq`、`contains`、比較演算子 |
| 値の配列 | `in` |
| `[min, max]` | `between`（両端を含む） |
| `null` | 未設定・無効な条件 |

```ts
type SearchQuery = {
  globalTextQuery: string;
  conditions: FilterCondition[];
};

type FilterCondition = {
  columnId: string;
  operator: Operator;
  value: FilterConditionValue;
};
```

`columnId` は `DataViewColumn.id` と一致させます。存在しない列、許可されない operator、正規化できない値はその条件を不一致として扱います。意図せず条件を無視しないための安全側の仕様です。

## factory: 表示定義を実行スキーマに変換する

`compileDataViewSchema(config, dataset, metadata?)` は `filterable !== false` の列だけをコンパイルし、配列とキー検索用 `Map` を返します。

各 `CompiledProperty` は以下を提供します。

- `operators`: value type に許可された operator（`operatorPolicy.ts`）
- `readCanonicalValue`: item の値を比較可能な canonical value に変換
- `getSearchText`: その列で検索対象となる文字列群を取得
- `normalizeConditionValue`: UI・URL・preset 由来の条件値を canonical value に変換

### 正規化規則

| `valueType` | canonical value |
| --- | --- |
| `text`, `enum` | `String(value)` |
| `number` | 有限の number。変換できない値は `null` |
| `boolean` | boolean。文字列なら `"true"` のみ true |
| `date` | UNIX milliseconds。`Date` または解析可能な日付文字列 |

`date` を timestamp に揃えることで、文字列表現に依存せず `gt` や `between` を比較できます。

### enum と検索ラベル

`buildDataViewMetadata` が static / dynamic options を作り、`getDataViewColumnSearchTexts` が raw value、表示ラベル、追加の `searchTexts` を検索対象にします。そのため次の設定では、`"active"` と `"Aprobado"` のどちらでも検索できますが、フィルター条件には `"active"` を渡します。

```ts
const config: DataViewConfig<Student> = {
  columns: [{
    id: "status",
    label: "Status",
    icon: "status",
    valueType: "enum",
    accessor: (student) => student.status,
    format: (student) => student.status,
    options: [{ value: "active", label: "Aprobado" }],
  }],
};
```

## engine: 評価パイプライン

`runSearch(items, query, schema, plugins?)` は初期コンテキストを生成し、既定では次の順番にプラグインを適用してから finalization します。入力の `items` と `query` は変更しません。

| 段階 | 出力する entry の情報 | 仕様 |
| --- | --- | --- |
| 初期化 | `filterPass: true`, `searchPass: true` | item ごとに `EvaluationEntry` を生成。`item.id` が string なら entry id に利用、なければ配列 index 由来の id |
| `filterEngine` | `filterPass` | すべての条件を AND で評価 |
| `searchEngine` | `searchPass`, `searchHits` | 全コンパイル済み列の検索テキストを走査 |
| `scoreEngine` | `filteringScore` | 最良の hit 種別を 0–3 点へ変換 |
| `finalizeEngineContext` | `isMatch`, `result` | `filterPass && searchPass` を確定し、件数を集計 |

空の `globalTextQuery` では検索プラグインは何も変更しないため、初期値の `searchPass: true` が維持されます。検索語は前後空白を除去しロケール依存の小文字化を行います。

### operator の意味

| operator | 一致条件 |
| --- | --- |
| `eq` | actual のいずれかが expected と厳密一致 |
| `in` | actual のいずれかが expected 配列に含まれる |
| `contains` | actual の文字列表現に expected の文字列表現を含む（大文字小文字を区別しない） |
| `between` | 単一 actual が `[min, max]` の範囲内（両端を含む） |
| `gt` / `gte` / `lt` / `lte` | 単一 actual と expected を比較 |

number 同士は数値、boolean 同士は `false < true`、それ以外は文字列として比較します。複数値の actual は `eq` / `in` / `contains` で「いずれかが一致」、範囲・大小比較では単一値のみを受け付けます。

許可する operator は value type ごとに `operatorPolicy.ts` が決めます。既定では text は `contains` / `eq`、number と date は等値・比較・範囲、enum は `in`、boolean は `eq` です。

### 検索の hit とスコア

検索では候補文字列と query を正規化した後、次の優先順位で 1 つ以上の `SearchHit` を作ります。

| kind | 判定 | score |
| --- | --- | --- |
| `exact` | 完全一致 | 3 |
| `prefix` | 先頭一致 | 2 |
| `partial` | 部分一致 | 1 |

`filteringScore` はすべての hit の合計ではなく、最高点です。現在の engine はこの値で並べ替えません。UI 側が関連度表示またはソートを実装するために利用できます。

## 結果の使い分け

`SearchResult.entries` は常に全 item の entry を保持します。表示方法に応じて selector を使用してください。

```ts
const result = runSearch(items, query, schema);

const listEntries = selectListEntries(result); // isMatch の item のみ
const gridEntries = selectGridEntries(result); // 全 item（非一致も含む）
```

テーブル連携には `runFilter` を使います。各 row id をキーにした `Map<RowId, MatchState>` を返し、`selectMatchedRows` で一致行だけを復元できます。同じ row id が複数あると誤った対応付けを防ぐため例外になります。

## React での標準的な利用

通常は `useDataSearch(config, items)` を利用します。この hook は metadata、schema、engine result を memoize し、query store と接続します。

```ts
const {
  searchText,
  setSearchText,
  setCondition,
  listEntries,
} = useDataSearch(studentDataViewConfig, students);

setSearchText("alice");
setCondition("semester", [3, 5], "between");
```

`setCondition` は列の `normalizeConditionValue` を通すため、空または無効な値は条件を削除します。条件を直接永続化・復元する場合も、同じ schema で正規化してから `runSearch` に渡してください。

## カスタムプラグイン

`SearchEnginePlugin<TItem>` は `EngineContext<TItem>` を受け取り、新しい context を返す純粋な変換です。既定プラグインを置き換えたり、追加の段階を挿入できます。

```ts
const auditPlugin: SearchEnginePlugin<Student> = {
  id: "audit",
  execute: (context) => ({
    ...context,
    working: {
      entries: context.working.entries.map((entry) => ({ ...entry })),
    },
  }),
};

const result = runSearch(items, query, schema, [
  filterEngine as SearchEnginePlugin<Student>,
  searchEngine as SearchEnginePlugin<Student>,
  scoreEngine as SearchEnginePlugin<Student>,
  auditPlugin,
]);
```

plugin は `working.entries` の必要な箇所だけをコピーし、`source`、`query`、`runtime` を変更しないでください。`isMatch` と `result` は最後に `finalizeEngineContext` が確定するため、通常の plugin で設定する必要はありません。

## 拡張時のチェックポイント

- 新しい value type や operator は、`dataView.types.ts`、`operatorPolicy.ts`、factory の正規化、engine の評価、UI、テストを同時に更新する。
- `DataViewColumn.id` は検索・フィルター・状態復元を結ぶ安定した識別子として扱う。
- 表示ラベルを比較値にしない。翻訳や表示形式が変わっても、条件値は canonical value のままにする。
- 条件追加はすべて AND になる。OR 条件やグループ条件が必要なら、`SearchQuery` と filter plugin の契約を拡張する。
- dataset や config が変わる場合は metadata と schema を再コンパイルする。

## テスト

仕様例は `filterEngine.test.ts` と `filterFactory.test.ts` にあります。shared engine の変更後は、少なくとも次を実行します。

```powershell
npx vitest --config vitest.unit.config.ts run src/features/search/shared/filterEngine.test.ts src/features/search/shared/filterFactory.test.ts
```
