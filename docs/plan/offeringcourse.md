# OfferingCourseDetailからOfferingCoursePanelへの置換

## Summary

- `ScheduleBuilder` の詳細領域を `OfferingCoursePanel` に置き換え、初期状態では閉じておく。カード本体クリックで対象クラスのpanelを開き、Close後も別のカードから再表示できるようにする。
- クラス一覧では集計値だけを取得し、study plan・学生・履修状況・prerequisiteの詳細はpanel専用hookからクラスキー単位で取得する。
- 未提供クラスの編集内容は画面滞在中の下書きとして保持し、`ofertar` 時にIndexedDBへ保存する。提供済みクラスの変更は即時保存する。

## Implementation Changes

- クラスキーに紐づく全 `PlanRecord` を取得し、`planId` からstudy planを解決する。学生は現行データモデルに合わせて `student.career === studyPlan.career` で所属判定する。
- 対象学生を、正規化後のstatusがactiveで、対象クラスの合格履歴（grade 6以上）がない学生に限定する。prerequisiteは既存仕様どおり推移的に解決し、全科目合格済みの「選択可能」と、1件以上未履修の「Sin prerrequisitos」に分類する。
- study planごとに学生を `currentSemester` でグループ化する。初期選択は、選択可能な学生のうち `currentSemester >= そのplanでの対象クラス推奨semester` とする。prerequisite未履修者は表示のみで選択不可とする。
- semesterトグルは、そのsemester内の選択可能学生を一括選択・解除する。全員選択／全員解除／一部選択を表示へ反映し、EstimatedStudentNumberにはそのsemesterの選択可能学生数を表示する。ただし、個別選択がすべて同じでない場合は、smesterのismulti=trueで、個別の選択の変更は行わず、個別選択をisenableの切り替selected自体は変更しない。smesterのismulti=trueの状態でダブルクリックすると全選択ismulti=falseにする。
- study planタブ切替後も各planの選択状態を保持する。上部のplan totalは表示中planの選択人数、フッターは全planの選択学生IDを重複排除した人数とする。
- 履修済み学生は通常取得結果から除外する。既存の「Aprobados」ボタンは将来の追加取得用プレースホルダーとして残し、今回は取得・表示処理を追加しない。
- `ScheduleBuilderPresenter` 内の選択状態をContainer/hookへ移し、Presenterを描画専用にする。カード本体クリックはpanel表示だけを行い、カード内CTAを明示的なoffer/unoffer操作にする。
- 未提供クラスの下書きはクラスキー単位でScheduleBuilder側に保持し、panelを閉じたり別クラスへ移動しても維持する。下書き未作成のクラスで `ofertar` を押した場合はpanelを開いて詳細を取得し、生成されたデフォルト選択を1回の操作で保存する。
- 既存のユーザー作成中コンポーネントとStorybookファイルは維持し、Container／Presenter／hook構成へ組み込む。

## Interfaces and Persistence

- 軽量な一覧DTOから学生ID群を外し、カード用の集計人数を返す。panel専用DTOとして、クラス情報、study plan ID・名称・推奨semester、semester別の選択可能学生とprerequisite未履修学生を定義する。
- panelの公開入力は少なくとも `courseKey` とoffering保存スコープ用の `career` とし、詳細取得・loading・error・選択状態はpanelのContainer/hookが管理する。
- `OfferingCourseRecord` に `selectedStudentIdsByStudyPlan: Record<studyPlanId, studentId[]>` を追加する。`estimatedNumber` は全planの選択IDの重複排除数、`sessionNumber` はpanelの値として同じレコードへ保存する。
- 既存レコードとの互換性のため、選択IDフィールドがないレコードはpanel初回表示時にデフォルト選択から復元する。新規保存後は空選択も含めて明示的なplan別配列を保存する。
- 未提供中はIndexedDBへ書き込まず、`ofertar` で下書きをupsertする。提供済みレコードでは学生・semester・session変更を即時upsertし、unoffer時は従来どおりレコードを削除する。

## Test Plan

- サービス単体テスト：複数study planに同じクラスがある場合、careerによる学生所属、active限定、対象クラス合格者の除外、未合格・成績なし、直接／推移的prerequisite分類、semesterグループ化を検証する。
- panel hookテスト：推奨semester以上の初期選択、semester一括操作、個別操作、部分選択表示、plan切替、plan別人数、全plan重複排除合計、クラス切替時の古いレスポンス無視を検証する。
- 永続化テスト：未提供中は書き込まれないこと、Close／クラス切替後も下書きが残ること、offer時にplan別ID・合計・sessionが保存されること、提供済み変更と再読込復元、legacyレコードの初期化、unoffer削除を検証する。
- UIテスト／Storybook：初期panel非表示、カード本体で表示、Close、タブ、loading・error・空データ、prerequisite未履修者が選択不可であることを検証する。
- 検証コマンドはプロジェクト規約に従い `npm run lint`、`npm run typegen`、`npm exec vitest -- run` を使用する。

## Assumptions

- studentへの `studyPlanId` 追加は今回行わず、現行の `career` 文字列をstudy plan所属キーとして扱う。
- 同じ学生IDが複数study planに現れても、plan別選択は個別に保存し、全体人数だけを重複排除する。
- 下書きはページ再読込では破棄され、offeringCoursesレコードに保存された提供済み状態だけが再読込後に復元される。
