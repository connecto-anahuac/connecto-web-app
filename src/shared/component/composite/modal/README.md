# Modal

`Modal` は Floating UI を使った、複数トリガーで共有できる浮動コンテンツです。`ModalProvider` が開閉状態を管理し、各トリガーは自分自身または名前付きの基準位置をアンカーにして同じ内容を開けます。

## 基本例

```tsx
"use client";

import Modal, { ModalProvider } from "@/components/modal/Modal";

export function Example() {
  return (
    <ModalProvider>
      <Modal.Trigger>
        <button type="button">開く</button>
      </Modal.Trigger>

      <Modal.Content>
        <div className="rounded-md bg-white p-4 shadow-lg">
          モーダルの内容
        </div>
      </Modal.Content>
    </ModalProvider>
  );
}
```

`reference` を指定しない `Modal.Trigger` は、そのトリガー自身を基準にして表示されます。

## 名前付きの基準位置と複数トリガー

`Modal.Reference` は空のアンカー要素を描画します。配置した場所がモーダルの基準位置になります。`Modal.Trigger` の `reference` に同じ ID を渡すと、そのトリガーを押したときに指定の基準位置を使います。

```tsx
import Modal, { ModalProvider } from "@/components/modal/Modal";

<ModalProvider placement="bottom-start">
  <div className="toolbar">
    <Modal.Reference id="toolbar" />
  </div>

  <table>
    <tbody>
      <tr>
        <td>
          <Modal.Reference id="table" />
        </td>
      </tr>
    </tbody>
  </table>

  <Modal.Trigger reference="toolbar">
    <button type="button">ツールバー位置で開く</button>
  </Modal.Trigger>

  <Modal.Trigger reference="table">
    <button type="button">テーブル位置で開く</button>
  </Modal.Trigger>

  <Modal.Content>
    <div className="rounded-md bg-white p-4 shadow-lg">共有する内容</div>
  </Modal.Content>
</ModalProvider>;
```

既存の要素を基準位置にしたい場合は、`Modal.Reference` の子要素にします。子要素は `ref` を受け取れる DOM 要素、または `forwardRef` 済みのコンポーネントである必要があります。

```tsx
<Modal.Reference id="header-action">
  <div className="h-8" />
</Modal.Reference>
```

未登録の ID を `reference` に渡した場合は、操作不能にならないようトリガー自身を基準にして開きます。

## 開閉状態を外部管理する

`open` と `onOpenChange` を渡すと制御コンポーネントとして使えます。渡さない場合は `ModalProvider` が内部で状態を管理し、`defaultOpen` で初期状態を指定できます。

```tsx
"use client";

import { useState } from "react";
import Modal, { ModalProvider } from "@/components/modal/Modal";

export function ControlledExample() {
  const [open, setOpen] = useState(false);

  return (
    <ModalProvider open={open} onOpenChange={setOpen} placement="right-start">
      <Modal.Trigger>
        <button type="button">開く</button>
      </Modal.Trigger>

      <Modal.Content>
        <div className="rounded-md bg-white p-4 shadow-lg">制御された内容</div>
      </Modal.Content>
    </ModalProvider>
  );
}
```

# 開閉状態を外から呼ぶ
ModalProvider が forwardRef で、useImperativeHandle で open() / close() を公開している。

```tsx
import { useRef } from "react";
import { ModalProvider, type ModalHandle } from "@/components/modal/Modal";

const modalRef = useRef<ModalHandle>(null);

<ModalProvider ref={modalRef}>
  {/* Modal.Content など */}
</ModalProvider>;

modalRef.current?.open();
modalRef.current?.close();
```

## API

| コンポーネント | 主な props | 説明 |
| --- | --- | --- |
| `ModalProvider` | `open`, `defaultOpen`, `onOpenChange`, `placement` | 状態と Floating UI の設定を管理します。`UseFloatingOptions` のうち `open`、`onOpenChange`、`elements` 以外も指定できます。 |
| `Modal.Reference` | `id`, `children?` | 名前付きアンカーを登録します。 |
| `Modal.Trigger` | `reference?`, `children` | クリックで開閉します。`reference` がなければ自分自身をアンカーにします。 |
| `Modal.Content` | `children` | 開いている間だけ子要素を表示し、位置・`role="dialog"`・外部クリック時の閉じる操作を適用します。 |

`Modal.Content`、`Modal.Trigger` はどちらも単一の要素を子に取ります。子要素の `style` とイベントハンドラは維持したまま、必要な props を追加します。
