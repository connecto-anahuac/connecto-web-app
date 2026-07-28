
# TanStack Table メモ

## ColumnDef

### accessorKey / accessorFn
- 行データから列の値を取得する
- `row.getValue(columnId)` が返す値
- フィルター・ソート・グループ化などで使用される

```ts
accessorKey: "name"

accessorFn: row => row.student.name
```

---

### cell
- 画面への表示方法を定義する
- ReactNodeを返す
- フィルター・ソートには影響しない

```ts
cell: ({ getValue }) => <strong>{getValue<string>()}</strong>
```

---

### filterFn
- 列フィルターの判定処理
- `row.getValue(columnId)` を対象に判定する

```ts
filterFn: (row, columnId, filterValue) => {
  return row.getValue(columnId) === filterValue;
}
```

---

## useReactTable

### filterFns
- 名前付きのFilterFnを登録する

```ts
const table = useReactTable({
  filterFns: {
    dataView: tableFilter,
  },
});
```

```ts
column.filterFn = "dataView";
```

---

### globalFilterFn
- グローバル検索時の判定処理
- **各行 × 各 enableGlobalFilter 列** に対して呼ばれる
- `columnId` が渡されるため、通常は `row.getValue(columnId)` を使用する

```ts
globalFilterFn: (row, columnId, value) => {
  return String(row.getValue(columnId)).includes(value);
}
```

---

## デフォルト動作

`filterFn` を指定しない場合
- TanStack Table が型に応じたデフォルトの FilterFn を使用する

`globalFilterFn` を指定しない場合
- デフォルトの Global FilterFn を使用する

どちらも対象となる値は

```ts
row.getValue(columnId)
```

で取得される。

`cell` の表示内容は検索・ソート対象にならない。


## row.original
- 元のデータオブジェクト
- `accessorFn` や `cell` から参照できる
- `accessor` を介さず、生データ全体にアクセスしたいときに使用する

```ts
row.original
// {
//   id: 1,
//   name: "Alice",
//   score: 90,
// }
```

```ts
cell: ({ row }) => {
  return row.original.name;
}
```

---

### row.getValue(columnId)
- そのカラムの `accessorKey` / `accessorFn` が返した値
- フィルター・ソート・グローバルフィルターではこちらを使用する

```ts
row.getValue("name")
```

---

## 使い分け

| 使用するもの | 用途 |
|-------------|------|
| `row.original` | 元データ全体を参照する |
| `row.getValue(columnId)` | カラムの値を取得する（accessor経由） |
| `cell` | 表示方法を定義する |

| 取得方法                        | 返るもの                                 |
| --------------------------- | ------------------------------------ |
| `row.original`              | 元データ全体                               |
| `row.getValue(columnId)`    | そのカラムの`accessor`が返した値                |
| `row.renderValue(columnId)` | 表示用の値（未定義時は`renderFallbackValue`を考慮） |
