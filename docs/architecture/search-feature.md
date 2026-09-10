# Search Feature Guide

この文書は `src/features/search` の設計意図と現行構成を整理したものです。

Search feature の目的は、画面ごとに個別のフィルター UI / 条件管理 / 絞り込み処理を書かずに、フィールド定義を渡すだけで検索 UI とフィルター処理を組み立てられるようにすることです。

## 1. 概要

Search feature は「フィルター対象の値」「入力 UI」「operator」「条件 state」「絞り込み実行」を分離して一般化しています。

画面側は、基本的に次の情報だけを宣言します。

- どの項目をフィルター対象にするか
- 画面上のラベル
- 値の種類: `text`, `number`, `date`, `singleSelect`, `multiSelect`, `boolean`
- 入力方法: `free` または `option`
- item から実際の値を取り出す `getValue`
- 必要なら static options / dynamic options / operator override

その宣言から `FilterDefinition` を生成し、UI は `FilterDefinition.editor` を見て適切なコンポーネントを描画します。実行側は同じ `FilterDefinition` と store 内の `FilterCondition` を使って `applyFilters` します。

## 2. データフロー

```text
feature-specific FilterField[]
  -> buildFilterDefinitions(fields, dataset)
  -> FilterDefinition[]
  -> SearchTool / SearchToolModal / FilterRenderer
  -> TextFilter / NumberFilter / DateFilter / SelectFilter / MultiSelectFilter
  -> useFilterCondition
  -> useFilterStore.conditions
  -> applyFilters(items, definitions, relevantConditions)
  -> filtered items
```

重要なのは、UI と絞り込み実行が同じ `FilterDefinition` を共有することです。

- UI は `editor`, `inputType`, `options`, `operators`, `label` を使う
- エンジンは `key`, `valueType`, `operators`, `getValue` を使う
- store は `FilterCondition` だけを持つ

## 3. 中心となる型

### `FilterField`

場所: `src/features/search/shared/filter-field.ts`

Feature 側が宣言する軽い入力です。プレゼンテーション非依存で、基本的には「この field はどんな値か」だけを表します。

```ts
defineFilterField<StudentListItem>({
  key: "name",
  label: "Nombre",
  icon:"person",
  valueType: "text",
  inputType: "free",
  getValue: (student) => student.name,
})
```

`FilterField` はまだ最終的な UI 種別や operator を持たなくてもよく、`filter-factory` が補完します。

### `FilterDefinition`

場所: `src/features/search/shared/filter-definition.ts`

UI と filter engine が実際に使う完成形です。

```ts
type FilterDefinition<TItem> = {
  key: string;
  label: string;
  editor: "text" | "number" | "select" | "multiSelect" | "date";
  valueType: ValueType;
  operators: Operator[];
  getValue: (item: TItem) => FilterPrimitive | FilterPrimitive[] | null | undefined;
  inputType: "free" | "option";
}
```

`inputType: "option"` の場合は `options` も持ちます。

### `FilterCondition`

場所: `src/features/search/shared/filter-definition.ts`

ユーザーが入力した実際の条件です。Zustand store にはこの配列だけが保存されます。

```ts
type FilterCondition = {
  id: string;
  fieldKey: string;
  operator: Operator;
  value: FilterConditionValue;
}
```

現行の `useFilterCondition` では、1 field につき 1 condition を想定しており、`id` と `fieldKey` は field key に揃えています。

## 4. 主要ファイルの責務

### Shared logic

| File | Responsibility |
| --- | --- |
| `filter-field.ts` | Feature 側が宣言する `FilterField` と `defineFilterField` |
| `filter-definition.ts` | 実行時に使う operator / editor / value / condition 型 |
| `operator-policy.ts` | `valueType` ごとに許可する operator の単一情報源 |
| `filter-factory.ts` | `FilterField` から `FilterDefinition` を生成する |
| `filter-engine.ts` | `FilterCondition` を item に適用して絞り込む |
| `filter-store.ts` | Zustand で active conditions を管理する |
| `use-filter-condition.ts` | 1 field 分の UI と store を接続する hook |
| `filter-metadata.tsx` | field key と表示 icon の対応。behavior から JSX を分離する |

### UI components

| File | Responsibility |
| --- | --- |
| `search-tool/SearchTool.tsx` | toggle button と modal の入口 |
| `search-tool/SearchToolModal.tsx` | filter tab / sort tab の外枠と `FilterRenderer` の一覧 |
| `filter/FilterRenderer.tsx` | `filter.editor` に応じて filter UI を切り替える |
| `filter/TextFilter.tsx` | text free input |
| `filter/NumberFilter.tsx` | number free input |
| `filter/DateFilter.tsx` | date free input |
| `SelectFilter.tsx` | option 単一選択 |
| `MultiselectFilter.tsx` | option 複数選択 |
| `filter/FilterFieldHeader.tsx` | label/icon と operator select |
| `filter/FilterCard.tsx` | 各 filter のカード枠 |

## 5. Operator policy

operator の既定値は `operator-policy.ts` の `OPERATORS_BY_VALUE_TYPE` で決まります。

現行意図は次の通りです。

| valueType | Default operators | Intent |
| --- | --- | --- |
| `text` | `contains`, `eq` | 部分一致または完全一致 |
| `number` | `eq`, `gt`, `gte`, `lt`, `lte`, `between` | 数値比較と範囲検索 |
| `date` | `eq`, `gt`, `gte`, `lt`, `lte`, `between` | 日付を timestamp に正規化して比較 |
| `singleSelect` | `eq` | 1 つの選択肢との一致 |
| `multiSelect` | `in` | 複数選択した値のいずれかに一致 |
| `boolean` | `eq` | true / false の一致 |

表示ラベルは `getOperatorLabel` で `valueType` ごとに出し分けます。`number` / `date` は `>`, `≧` などの記号、text/select 系は `Es`, `Contiene` などの文言を使う設計です。

## 6. Filter factory

`buildFilterDefinition` は `FilterField` から `FilterDefinition` を作る場所です。

主な補完ルール:

- `operators` は `field.operators` があればそれを優先する
- `operators` がなければ `valueType` から `getOperatorsForValueType` で導出する
- `inputType: "option"` かつ `multiple: false` なら `editor: "select"`
- `inputType: "option"` の default は `editor: "multiSelect"`
- `inputType: "free"` は `valueType` から `text` / `number` / `date` を導出する
- `options` が明示されていれば static options として使う
- `dynamicOptions: true` かつ dataset が渡されていれば、dataset から distinct options を生成する

この factory があるため、画面側は UI コンポーネント名や operator の細かい選択を毎回書かずに済みます。

## 7. Filter engine

場所: `src/features/search/shared/filter-engine.ts`

`applyFilters(items, definitions, conditions)` は次の順で処理します。

1. `definitions` を `key -> definition` の Map にする
2. 条件が空なら元の `items` をそのまま返す
3. item ごとにすべての condition を評価する
4. condition 同士は AND 条件として扱う
5. condition の operator が definition に許可されていない場合は match しない

operator ごとの意図:

- `eq`: 実値と期待値の完全一致。actual が配列ならいずれかの entry が一致すれば true
- `contains`: string 化して小文字比較の部分一致
- `between`: `[min, max]` の range value を受け取り、`number` / `date` などを比較可能値に正規化して判定
- `gt`, `gte`, `lt`, `lte`: scalar value を比較可能値に正規化して大小比較
- `in`: multiSelect 用の包含判定として意図されているが、現行 engine では未実装

## 8. Store and condition lifecycle

場所: `src/features/search/shared/filter-store.ts`, `src/features/search/shared/use-filter-condition.ts`

Store は active な `FilterCondition[]` を持ちます。

- `upsertCondition`: 同じ `id` の condition があれば置き換え、なければ追加
- `removeCondition`: condition id で削除
- `clear`: 全 conditions を削除

UI 側は `useFilterCondition(filter)` を使います。

- store から `fieldKey === filter.key` の condition を探す
- condition がない場合、operator は `filter.operators[0]` を default にする
- `setValue` に空値が渡されたら condition を削除する
- 値があれば `{ id: filter.key, fieldKey: filter.key, operator, value }` を upsert する
- `setOperator` は既存 condition がある場合だけ operator を更新する

## 9. Feature 側の使い方

### 1. Field key を定義する

```ts
export const STUDENT_FILTER_KEYS = {
  name: "name",
  status: "status",
} as const;
```

### 2. `FilterField[]` を宣言する

```ts
export const STUDENT_FILTER_FIELDS: FilterField<StudentListItem>[] = [
  defineFilterField<StudentListItem>({
    key: STUDENT_FILTER_KEYS.name,
    label: "Nombre",
    valueType: "text",
    inputType: "free",
    getValue: (student) => student.name,
  }),
  defineFilterField<StudentListItem>({
    key: STUDENT_FILTER_KEYS.status,
    label: "Estatus",
    valueType: "multiSelect",
    inputType: "option",
    dynamicOptions: true,
    getValue: (student) => student.status,
  }),
];
```

### 3. Hook 側で definitions と filtered result を作る

```ts
const conditions = useFilterStore((state) => state.conditions);
const relevantConditions = conditions.filter((condition) =>
  FILTER_KEY_LOOKUP[condition.fieldKey] === true,
);

const definitions = useMemo(
  () => buildFilterDefinitions(STUDENT_FILTER_FIELDS, students),
  [students],
);

const filteredStudents = useMemo(
  () => applyFilters(students, definitions, relevantConditions),
  [students, definitions, relevantConditions],
);
```

### 4. UI に渡す

```tsx
<SearchTool definitions={definitions} />
```

現行では global な `useFilterStore` を使っているため、複数画面や複数検索領域が同時に存在する場合は、feature hook 側で `relevantConditions` に絞る必要があります。

## 10. 現行利用箇所

| Feature | Field definitions | Hook |
| --- | --- | --- |
| Students list | `src/features/student/types/student-filter-fields.ts` | `src/features/students/components/client/StudentsShell/useStudentFilters.ts` |
| Student plan | `src/features/student/types/student-plan-filter-fields.ts` | `src/features/student/components/client/StudentPlan/useStudentPlanFilters.ts` |
| Schedule builder | `src/features/offeringCourse/types/offering-course-filter-fields.ts` | `src/features/offeringCourse/components/client/ScheduleBuilder/useScheduleBuilderFilters.ts` |

## 11. 現在ぐちゃぐちゃになっている点

ここは「設計意図」と「現行実装」がズレている、または未整理な箇所です。

### `in` operator の型・policy・engine が揃っていない

`multiSelect` は `in` operator を使う意図ですが、現行の `Operator` 型の元である `operators` 配列には `in` が含まれていません。一方で `operator-policy.ts`、`MultiselectFilter.tsx`、一部テストは `in` を前提にしています。

また、`filter-engine.ts` の `matchesCondition` には `in` の case がありません。意図としては「expected value の配列のいずれかが actual value に含まれる」判定ですが、現行 engine にはまだ実装されていません。

整理するなら、まず `Operator` に `in` を追加し、`operatorTextLabels` / `operatorNumberLabels` / `matchesCondition` / tests を同時に揃えるのが自然です。

### `between` UI が未完成

`number` / `date` の operator には `between` がありますが、`NumberFilter` と `DateFilter` は単一 input だけを描画しています。`FilterConditionValue` は range value を持てる設計なので、UI 側で operator が `between` のときに `[min, max]` を編集できる形にする必要があります。

### `normalize` が定義だけ存在している

`FilterDefinition` には `normalize?: (value: unknown) => ...` がありますが、現行 engine / UI では使っていません。値正規化の責務を `filter-engine` 内の `normalizeComparableValue` に寄せるのか、definition ごとの `normalize` に寄せるのかを決める余地があります。

### Store が global

`useFilterStore` は search feature 全体で global な condition store です。そのため各 feature hook が `fieldKey` で relevant conditions を絞っています。

複数の search instance を同時に持つ可能性がある場合は、scope id を condition に持たせるか、検索領域ごとに store を分ける設計を検討します。

### `valueType: "multiSelect"` の意味が曖昧

現行では、実データが配列でなくても、複数選択 UI を使うために `valueType: "multiSelect"` を指定している例があります。`valueType` が「実データの型」なのか「フィルター入力の型」なのかが混ざっています。

整理するなら、実データ側は `singleSelect` / `text` / `number` などに寄せ、複数選択 UI は `inputType: "option"` と `multiple` で表す方が読みやすくなります。

### 古い component が残っている可能性

`src/features/search/components/SearchTool.tsx` と `src/features/search/components/search-tool/SearchTool.tsx` のように、似た名前のファイルが複数あります。実際に使う入口を `search-tool/` 側に統一するなら、旧ファイルの扱いを決める必要があります。

## 12. 追加・修正時の判断基準

新しいフィルターを追加するときは、まず feature 側の `FilterField` に追加します。

- UI を追加したいだけなら `FilterRenderer` と editor component を見る
- operator の種類を変えたいなら `operator-policy.ts` を見る
- 絞り込み結果がおかしいなら `filter-engine.ts` を見る
- condition が残る/消える挙動がおかしいなら `use-filter-condition.ts` と `filter-store.ts` を見る
- 画面固有のアイコンだけを変えたいなら `filter-metadata.tsx` を見る

Search feature の方針として、画面固有のフィールド名や domain 型はできるだけ `src/features/search` に入れず、各 feature の `types/*-filter-fields.ts` 側に閉じ込めます。

## 13. 優先して直すとよい順番

1. `in` operator を型・label・policy・engine・tests で一貫させる
2. `between` 用 UI を `NumberFilter` / `DateFilter` に追加する
3. `valueType` と `inputType/multiple` の責務を整理する
4. global store に scope が必要か判断する
5. 重複している search tool component を整理する

この順に直すと、まず現在の型/テスト/実行不整合が解消され、その後に UI と設計の読みやすさを改善できます。