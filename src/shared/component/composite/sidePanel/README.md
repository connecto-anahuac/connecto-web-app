# SidePanel

`SidePanel` は、選択中の `{ type, id }` に対応する詳細パネルを表示する Compound Component です。`useSidePanel()` を使えば、`Root` の配下にある任意の子コンポーネントから開閉できます。

## Basic usage

```tsx
"use client";

import SidePanel, { useSidePanel } from "./SidePanel";

function OpenStudentButton() {
  const { open } = useSidePanel();

  return <button onClick={() => open({ type: "student", id: "student-1" })}>Open</button>;
}

export function Example() {
  return (
    <SidePanel.Root>
      <SidePanel.Main>
        <OpenStudentButton />
      </SidePanel.Main>
      <SidePanel.Viewport aria-label="Details" className="w-80 bg-white shadow-lg">
        <SidePanel.Content type="student">
          {(panel) => <StudentDetail id={panel.id} />}
        </SidePanel.Content>
      </SidePanel.Viewport>
    </SidePanel.Root>
  );
}
```

`Viewport` は選択がないときには描画されず、`Content` は選択中の `type` が一致するときだけ描画されます。開いている間は Escape キーで閉じられます。

## Push layout

`mode="push"` では `Main` がパネル分だけ縮みます。`side` は `top`、`right`、`bottom`、`left` から選べます。既定値は `overlay` と `right` です。

```tsx
<SidePanel.Root mode="push" side="left">
  <SidePanel.Main>{/* push 表示されるメインコンテンツ */}</SidePanel.Main>
  <SidePanel.Viewport aria-label="Details" className="w-80">
    <SidePanel.Content type="student">{(panel) => <StudentDetail id={panel.id} />}</SidePanel.Content>
  </SidePanel.Viewport>
</SidePanel.Root>
```

`className` と `style` は `Root`、`Main`、`Viewport` の各要素にそのまま渡せます。パネル幅・高さや余白は `Viewport` で指定してください。

## Controlled state

`panel` と `onPanelChange` を渡すと制御コンポーネントになります。初期値だけ指定する場合は `defaultPanel` を使います。

```tsx
const [panel, setPanel] = useState<SidePanelValue | null>(null);

<SidePanel.Root panel={panel} onPanelChange={setPanel}>
  {/* Main and Viewport */}
</SidePanel.Root>
```

## API

| API | Purpose |
| --- | --- |
| `SidePanel.Root` | 状態と `overlay` / `push` レイアウトを提供します。`panel`、`defaultPanel`、`onPanelChange`、`mode`、`side` を受け取ります。 |
| `SidePanel.Main` | push レイアウトで縮小されるメイン領域です。 |
| `SidePanel.Viewport` | パネルを描画する `aside` です。`aria-label` は必須です。 |
| `SidePanel.Content` | `type` が選択中のパネルに一致したとき、render function を呼び出します。 |
| `useSidePanel()` | `{ panel, isOpen, open, close }` を返します。 |
