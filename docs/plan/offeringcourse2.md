# Offering CourseのZustand状態管理導入

## Summary

`offeringCourse` feature専用のZustandストアを作成し、コースごとの学生選択、行の有効状態、career/study plan、session、パネル状態を一元管理する。Presenterはstatelessのまま維持し、一覧カードとパネルを同じストアから同期させる。

## Implementation Changes

- `ScheduleBuilder`単位のvanilla Zustand storeとProviderを追加する。career変更時に状態を初期化し、コースキーごとに以下を保持する。
  - 選択学生ID（study plan別）
  - 有効な学生ID（study plan別）
  - session数
  - offering状態、詳細、保存中・エラー状態
  - 選択中コース／study planとパネル表示状態
- 一覧・詳細取得結果をストアへhydrateし、UI操作は先にストアへ原子的に反映してからIndexedDBへ保存する。semester一括操作は学生ごとの連続保存ではなく、1回の状態更新・保存にまとめる。
- コースごとの保存を順序化し、古い非同期レスポンスで新しい状態が上書きされないようにする。保存失敗時は後続変更がなければ直前状態へ戻し、エラーを表示する。
- career totalは、そのstudy plan内の選択学生IDを重複除外した人数とする。全career totalはcareer totalの単純合算とし、career間で同じ学生IDがあっても別々に数える。
- `GenerationAcordion`から外部指定の`isMulti`を削除し、`Previstos`内の選択状態が混在している場合だけ導出する。
  - mixed時の通常クリック：親の`isSelected`を全子行の`isEnabled`へ同期し、子の`isSelected`は変更しない。
  - mixed時のダブルクリック：全子行をselectedかつenabledにしてmixedを解除する。
  - non-mixed時の通常クリック：semester内の全対象行を一括選択・解除し、既存のenabled状態は保持する。
  - `Sin prerrequisitos`の行は選択・enabled・totalの対象外とする。
- `ToggleButton`をcontrolled/uncontrolled両対応に直し、`isSelected`が渡された場合はZustandの値を表示上の正本とする。
- `OfferingCoursePanel`は、選択中career total、全career total、sessionをZustand selectorから表示し、タブ切替後も同じコースの状態を維持する。
- `OfferingClassCardView`右上の人数は、常にパネルと同じ全career totalを表示する。詳細未取得時は一覧DTOの初期推定totalを使用し、詳細取得・選択変更後はストア値へ切り替える。
- 未offeringカードは従来の`ofertar`ボタンを表示する。offering済みカードは同じ領域を小型sessionカウンターへ置換し、操作時にカードを開かないようイベント伝播を止める。sessionを1から0へ減らした場合はunofferする。

## Public Types and Persistence

- 一覧DTOへ`estimatedNumber`を追加し、各study planで「推奨semester以上かつ履修条件を満たす学生数」を計算して全career分を単純合算する。学生ID自体は一覧DTOへ含めない。
- offering選択のdomain、DTO、IndexedDBレコード、更新inputへ、任意の`enabledStudentIdsByStudyPlan`を追加する。
- 既存レコードにenabled情報がない場合は、詳細取得時に全eligible学生をenabledとして補完する。非indexedフィールドの追加なのでDexieのスキーマversion変更は行わない。
- 永続化される`estimatedNumber`も、study planごとの選択人数を単純合算する定義へ統一する。
- `OfferingCoursePanelSemester.isMulti`と関連するPresenter propsを削除し、mixed状態は必ずストア上の学生選択から算出する。

## Test Plan

- Zustand storeの単体テスト：
  - career totalと、career間の重複を含む全career合算
  - 個別選択、一括選択・解除、mixed判定
  - mixed通常クリックでenabledだけが変化すること
  - mixedダブルクリックでselected/enabledが全てtrueになること
  - session更新と0でのunoffer
  - hydrate、旧データのenabled初期化、保存失敗時のrollback
- service/DTOテスト：
  - 一覧の初期推定total
  - 永続化totalの単純合算
  - enabled IDの保存・復元と旧レコード互換
- Storybook interaction/componentテスト：
  - パネルとカードのtotal/session即時同期
  - offeringボタンとsessionカウンターの切替
  - mixedトグルのsingle/double click
  - session操作でカードが意図せず開かないこと
- 検証はnpm方針に従い、対象Vitest、全unit test、Storybook interaction、`npm run lint`、`npx tsc --noEmit`、`npm run typegen`を実行する。

## Assumptions

- UI上のcareerは詳細DTOのstudy planタブに対応する。
- accordionの開閉状態と検索フィルター状態は共有ドメイン状態ではないため、既存のローカル／filter store管理を維持する。
- non-mixed一括選択はdisabled行も含めて状態を更新するが、disabled中の個別トグル操作は引き続き禁止する。
