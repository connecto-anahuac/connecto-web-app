# Diagram Count Locators Implementation Plan

## Goal

DataSection のフィルター一致アイテムが Diagram の現在の表示領域外にある場合、
上・右・下・左の各方向にある件数を `CountLocator` で表示する。

## Architectural invariants

- スクロール計測と Locator の状態は shared `Diagram` 内に閉じ込める。
- Feature Presenter は stateless のまま、対象アイテムを props で宣言するだけにする。
- Locator は opt-in とし、既存の Diagram 利用箇所の表示を変えない。
- フィルター一致アイテムだけを集計し、行・列非表示で未レンダーのアイテムは除外する。
- 一部でも表示されているアイテムは枠外として数えない。
- 角にあるアイテムは該当する二方向の両方に数える。
- 既存の未コミット CountLocator / RoundedPin / icon index 変更を保持して統合する。
- AGENTS.md に従い、検証は npm ベースで実行し、pnpm は使わない。

## Checkpoints

- [x] CP1: `Diagram.Viewport`、`Diagram.Content locatorTarget`、方向別集計ロジックを shared Diagram に追加する。
- [x] CP2: `CountLocator` を四方向・アクセシビリティ・0件非表示に対応させる。
- [x] CP3: shared Diagram の純粋集計テスト、既存レイアウト回帰テスト、Storybook の狭い viewport 例を追加する。
- [x] CP4: StudentDiagram を Viewport/locatorTarget API に移行し、feature テストを追加する。
- [x] CP5: PlanCourseDiagram に同じ opt-in Locator を適用する。
- [x] CP6: OfferingCourse ScheduleBuilder を shared Diagram に移行し、旧 feature Diagram を利用箇所確認後に削除する。
- [x] CP7: ScheduleBuilderCanvas の既存 Diagram 表示が変わらないことを回帰確認する。
- [x] CP8: 変更対象の focused test、lint、TypeScript を実行する。
- [x] CP9: 統合差分をプランと照合し、ユーザー変更の保持とスコープ外差分がないことを確認する。

## Validation commands

- `npm exec vitest -- run <focused test files>`
- `npm run lint -- <changed files>`
- `npm exec tsc -- --noEmit --pretty false`
- 必要に応じて `npm exec vitest -- run --project storybook`

## Progress log

- 2026-09-21: 調査済みの実装案をチェックポイント化。shared、Student/Plan、OfferingCourse の3スライスに分けて実装を委任。
- 2026-09-21: CP4-CP5 main review 完了。Student/Plan は一致カードのみを対象化し、非一致がある場合だけ Locator を有効化。担当の focused tests 4件と focused ESLint が成功。shared API 完成後の統合型検証は保留。
- 2026-09-21: CP6 main review 完了。OfferingCourse は shared compound API へ移行し、座標・非表示軸・カード状態を維持。旧 Diagram の runtime import がないことを確認して削除。担当の focused tests 6件、ESLint、TypeScript、diff check が成功。
- 2026-09-21: CP1-CP3 main review 完了。完全枠外・部分表示・角の二方向集計、scroll/resize/mutation 追従、rAF 集約、方向別 a11y、0以下非表示を確認。shared tests 10件と focused ESLint が成功。
- 2026-09-21: CP7-CP9 完了。統合 focused tests は4 files/20 tests 成功、focused lint・TypeScript・diff check 成功。ScheduleBuilderCanvas は13件中12件成功し、今回未変更の `data-completed` 既存期待値のみ失敗（対象 source/test に差分なし）。既存の CountLocator/RoundedPin/icon 登録は新 API に統合し、スコープ外差分なし。
