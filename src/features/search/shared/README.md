# Description
- FilterField
- FilterDefinition
- FilterCondition

filterField -> filterDefinition 
filterDefinitionをアプリ内では使用。
これを生成するための値としてfilterFieldで値を定義する。

使用可能なフィルターの定義

例えば学生が以下のような型だとします。

```ts
type Student = {
  id: string;
  name: string;
  age: number;
  faculty: "Engineering" | "Business" | "Law";
  active: boolean;
  failedSubjects: string[];
};
```

# FilterField

## FreeFilterField

自由入力するフィールドです。

```ts
const nameField: FreeFilterField<Student, string> = {
  key: "name",
  label: "名前",

  inputType: "free",
  valueType: "text",

  getValue: student => student.name,
};
```

##  OptionFilterField

こちらは選択肢があります。

例えば学部。

```ts
const facultyField: OptionFilterField<Student, string> = {
  key: "faculty",
  label: "学部",

  inputType: "option",
  valueType: "text",

  options: [
    {
      label: "工学部",
      value: "Engineering",
    },
    {
      label: "経営学部",
      value: "Business",
    },
    {
      label: "法学部",
      value: "Law",
    },
  ],

  getValue: student => student.faculty,
};
```

## dynamicOptions=true

例えば「履修科目」はデータによって変わります。

```ts
const subjectField: OptionFilterField<Student, string> = {
  key: "subject",
  label: "履修科目",

  inputType: "option",
  valueType: "text",

  dynamicOptions: true,

  getValue: student => student.subject,
};
```

データセット

```ts
[
    { subject: "Math" },
    { subject: "English" },
    { subject: "Math" },
    { subject: "Physics" }
]
```

実行時に

```
Math
English
Physics
```

を重複除去して生成します。





#  FilterDefinition<TItem>

`FilterDefinition<Student>` は `StudentをどうフィルタUIに表示するか` を定義しています。

`TItem`には実際には`Student`が入ります。

```ts
const studentFilterDefinitions: FilterDefinition<Student>[] = [
  {
    key: "name",
    label: "名前",
    inputType: "free",
    editor: "text",
    valueType: "text",
    operators: ["contains", "eq"],

    getValue: (student) => student.name,
  },

  {
    key: "age",
    label: "年齢",
    inputType: "free",
    editor: "number",
    valueType: "number",
    operators: ["eq", "gt", "gte", "lt", "lte", "between"],

    getValue: (student) => student.age,
  },

  {
    key: "faculty",
    label: "学部",
    inputType: "option",
    editor: "select",
    valueType: "text",
    operators: ["eq", "in"],

    options: [
      { label: "工学部", value: "Engineering" },
      { label: "経営学部", value: "Business" },
      { label: "法学部", value: "Law" },
    ],

    getValue: (student) => student.faculty,
  },

  {
    key: "failedSubjects",
    label: "不合格科目",
    inputType: "free",
    editor: "text",
    valueType: "text",
    operators: ["contains"],

    getValue: (student) => student.failedSubjects,
  },
];
```


#  FilterCondition

実際にユーザーがかけているフィルター条件

こちらは

```ts
{
    id,
    fieldKey,
    operator,
    value
}
```

なので、

例えば

### 名前に"田"を含む

```ts
{
    id: "1",
    fieldKey: "name",
    operator: "contains",
    value: "田"
}
```

### 学部が工学部または経営学部

```ts
{
    id: "4",
    fieldKey: "faculty",
    operator: "in",
    value: [
        "Engineering",
        "Business"
    ]
}
```


### 年齢18～22

```ts
{
    id: "5",
    fieldKey: "age",
    operator: "between",
    value: [18, 22]
}
```

