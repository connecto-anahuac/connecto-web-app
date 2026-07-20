---
name: figma-tailwind-best-practices
description: 'FigmaデータをTailwindで実装する際の実装ルール。Use when: Figma to Tailwind, width/spacingの変換方針, arbitrary valueの許容判断, color tokenの選定, color_scheme.cssとcourse_colors.cssの運用。'
argument-hint: '実装対象(Figma URL/コンポーネント名)と、再利用したい値(サイズ/色)を指定してください'
---

# Figma Tailwind Best Practices

Figmaデータから Tailwind CSS 実装を生成するときに、
「Tailwindらしさを維持しつつ、必要な精度だけ担保する」ためのワークフロー。

## When To Use

- Figma のコンポーネントや画面を Tailwind で実装するとき
- `w-[11px]` のような arbitrary value を使うべきか迷うとき
- 色を既存トークンから選ぶか、新規追加するか判断したいとき
- リポジトリ内の色定義を一貫した運用で増やしたいとき

## Required Color Sources

色は必ず次の 2 ファイルを先に参照する。

- `src/app/styles/color_scheme.css`
- `src/app/styles/course_colors.css`

## Procedure

1. Figma の値を「レイアウト」「サイズ」「色」に分解する。
2. サイズ系は Tailwind の既定スケール（例: `w-2`）で表現できるかを最初に判定する。
3. 色は上記 2 ファイルから semantic token を選ぶ。
4. 既存値で表現できない場合のみ、以下の分岐ルールで追加実装する。
5. 最後にチェックリストで品質確認する。

## Sizing Rules (Width/Height/Spacing)

### Rule 1: Tailwind default value を最優先

- まず `w-2`, `px-4`, `rounded-lg` など既存ユーティリティへ変換する。
- Figma 値に近くても、既存スケールで視覚差が許容できるなら既存値を採用する。

### Rule 2: 既存値がない場合の分岐

- その値が「そのコンポーネント内だけ」で完結するなら、`w-[11px]` のような直書きは許可。
- 複数箇所で再利用する値は、arbitrary value を増やさず CSS に宣言して使う。

例:

```tsx
<div className="w-[11px]" />
```

```css
/* shared utility example */
@utility componentA-width {
	width: 11px;
}
```

```tsx
<div className="componentA-width" />
```

### Rule 3: 再利用の判断基準

次のいずれかを満たす場合は CSS 宣言へ昇格する。

- 同一コンポーネント内で 3 回以上使う
- 別コンポーネントでも使う見込みがある
- デザイン上の意味を持つ値（カード固定幅、共通角丸など）

## Color Rules

### Rule 1: 既存 token を優先

- `color_scheme.css` と `course_colors.css` から最も意味が近い semantic color を選ぶ。
- 可能な限り生の hex (`#xxxxxx`) を JSX に直書きしない。

### Rule 2: 該当しない色は semantic 名で追加

- 既存にない場合のみ、新しい semantic 名で追加する。
- 追加先の原則:
	- アプリ共通/UI 基盤色: `color_scheme.css`
	- コース/ドメイン分類色: `course_colors.css`

命名例:

- 良い例: `--CourseBadgeInfo`, `--ScheduleConflict`, `--DataPanelMutedText`
- 悪い例: `--blue-2`, `--newColor`, `--tmp-orange`

### Rule 3: 追加時の整合

- 追加した色は用途が分かる名前にする。
- 既存トークンと意味重複する色は追加しない。
- 追加後は実装側で token 経由で使用する。

## Decision Flow

1. この値は Tailwind の既定値で表せるか?
2. 表せるなら既定値を使う。
3. 表せない場合、その値は単発利用か?
4. 単発なら arbitrary value を許可。
5. 再利用するなら CSS utility または token を追加する。
6. 色は 2 つの CSS ファイルを確認済みか?
7. 未定義なら semantic 名で追加する。

## Completion Checklist

- サイズ値は可能な限り Tailwind 既定値に変換されている
- arbitrary value は単発用途に限定されている
- 再利用値は CSS 側へ昇格されている
- 色は `color_scheme.css` / `course_colors.css` から選択されている
- 新規色は semantic 名で追加され、命名理由が説明できる
- JSX に生の hex を繰り返し直書きしていない
