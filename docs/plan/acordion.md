# GenerationAccordion 親子トグル修正

## Summary

`togglebutton.md` の仕様に合わせ、semester 親トグルの選択状態と学生の選択状態を独立させる。親トグルは常に操作可能とし、親の `isSelected` が子トグルの `isEnabled` を制御する。親をOFFにしても学生選択は保持する。

## Implementation Changes

- `GenerationAcordion` へ `isSemesterEnabled` と `onSemesterEnabledChange` を追加する。親操作ではこの値だけを変更し、学生IDの一括選択・解除やダブルクリック処理を削除する。
- semester 行のトグルには親状態を `isSelected` として渡し、常に enabled にする。学生行は `isSemesterEnabled && student.isEligible !== false` の場合だけ操作可能にする。
- semester 横の人数を、全学生数ではなく選択済み eligible 学生数から算出する。親OFFでも人数、学生の `isSelected`、Panel内の合計値は変えない。
- 部分選択表示に使っている `isMulti` を `GenerationAcordion`、semester row、`OfferingCoursePanelSemester` から削除する。共有 `ToggleButton` 自体の汎用 `isMulti` APIは変更しない。
- `OfferingCoursePanelPresenter` は描画専用のまま、plan・semesterごとの親状態と変更コールバックをAccordionへ渡す。

## State Management

- ScheduleBuilderのZustandへ、永続化対象外の `semesterEnabledByCourse: Record<courseKey, Record<planId, Record<semesterId, boolean>>>` と更新commandを追加する。
- 未登録のsemesterは、そのクラスの配置セメスター以降のセメスターはONにする。親状態はPanelを閉じた後や別コース・planへ切り替えた後も保持し、career変更またはProvider破棄時にリセットする。
- ストアに接続されない単体Storyでは `useOfferingCoursePanel` のuncontrolled fallbackを使用する。
- 親状態は `OfferingCourseDraft`、DTO、IndexedDBへ追加せず、ページ再読込後は全ONへ戻す。学生IDの既存永続化フローは変更しない。

## Public Interfaces

- Accordion propsに `isSemesterEnabled: boolean`、`onSemesterEnabledChange(isEnabled)` を追加し、`isMulti` を削除する。
- Panel内部型からsemesterの `isMulti` を削除する。
- 学生選択callbackのシグネチャと `EnabledStudentIdsByStudyPlan` は維持する。

## Test Plan

- Accordion interaction：親OFFで学生callbackが発火せず、選択済み学生が薄いオレンジ、未選択学生が薄いグレーのまま表示されること。
- 親をOFF→ONにしても学生選択が保持され、ON後に再び学生を操作できること。
- 部分選択・全選択のどちらでも親状態を独立して切り替えられ、選択人数とPanel合計が親状態に影響されないこと。
- Store単体テスト：初期値ON、Panel close・course/plan切替後の保持、career resetでの破棄を検証する。
- Storybookを4表示状態へ更新し、既存の`isMulti`・ダブルクリック前提を除去する。
- `npm exec vitest -- run` で対象テスト、`npm run lint`、`npm run typegen`を実行する。

## Assumptions

- 「親トグルは常にenable」とは、親ToggleButtonの操作可否が常に有効で、その `isSelected` がsemesterグループの有効状態を表すことを意味する。
- prerequisite不足の学生は従来どおり選択・人数計算の対象外とする。
- `GeneratioinAcordion` ディレクトリ名と `GenerationAcordion` の既存スペルは今回変更しない。


## reference
- [仕様](togglebutton.md)