---
description: "SVGをNextjsに埋め込まれたコンポーネントとして扱えるように実装する。"
name: "nextjs-icon-implementation"
tools: [agent,edit]
agents: []
argument-hint: "iconを実装して"
user-invocable: true
disable-model-invocation: false
---

指定のファイルにまとめられたSVGを、Templateを用いて実装します。重複調査の指示がない場合は、重複調査をせずにすぐ実装に取り掛かってください。

# input
以下の繰り返しです。
```txt
# <IconName>
svg content
```
# rule
foreground colorは`currentColor`
cn関数を使ってclassNameを受け取れるようにする
不要なマスクは取り除き、できるだけシンプルにする
作成後、`src\components\icon\index.ts`にexportを追加する

# template
\<IconName\>はパスカルケースに直す
```tsx
import { cn } from "@/shared/lib/util";
import { ComponentProps } from "react";

type Props = ComponentProps<'svg'> & {}

export default function <IconName>Icon({ className,strokeWidth, ...props }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("w-6 h-6 aspect-square", className)}
      {...props}
    >
      <path
        strokeWidth={strokeWidth ?? 0}
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
        d="~~~~"
        fill="currentColor"
      />
    </svg>
  );
}
```




