# Schedule Builder ドラッグ＆ドロップ実装計画

## Summary

- `features/scheduleBuilder` を正式な実装対象とし、指定された `career`・`period` の選択済みOffering Course、教授、稼働時間、教室、T1〜T10を読み込む。
- 左側は `sessionNumber >= 1` の科目を1科目1カードで表示し、Canvasはスペイン語の月〜日×T1〜T10の固定グリッドにする。
- 配置はブラウザメモリ内だけで管理し、リロード・画面離脱・パラメータ変更で破棄する。既存の `features/offeringCourse/components/client/ScheduleBuilder` とDexieの保存スキーマは変更しない。

## Implementation Changes

1. データ取得と状態境界

- Template直下にクライアント側のルートContainerを置き、Offering Course一覧、Canvas、右パネルを同一の状態と`DndContext`配下にまとめる。
- Schedule Builder専用の読取DTO・service・client handlerを追加し、選択済みOffering Courseと科目情報、period別の教授担当可能科目・availability、教室、時間スロットを一括取得する。Feature層はhandler/DTOだけを参照する。
- Client hook/storeで読込状態、選択中の科目・session・配置、セル内順序、パネル、コンテキストメニューを管理する。careerまたはperiod変更時は配置を空に戻す。
- `sessionNumber=N` はN個の開講sessionとして扱い、各sessionの必要週次授業数を `ceil(hours / 1.5)` とする。hoursが0以下ならドラッグを無効化し、時間数未設定を表示する。

2. 配置モデルと制約判定

- 状態を「科目 → session → 週次授業」に分ける。教授と定員はsession単位、曜日・Tスロット・教室・セル内順序は週次授業単位で保持する。
- 左カードからのドロップはコピーとし、必要回数が未完了の最小session番号へ自動割当する。session 1が完了後にsession 2へ進み、全session完了時は左カードを薄色・ドラッグ不可にする。削除すると再度配置可能にする。
- セルの有効性は「担当可能かつ稼働可能で同時間に未割当の教授が存在」「空き教室が存在」「同じ推奨学期の授業が存在しない」の全条件で判定する。教授割当済みsessionでは、その教授自身のavailabilityと競合を使う。
- 無効セルもドロップを受け入れる。配置後に警告状態とし、教授未割当、担当不可、稼働不可、教授競合、教室未割当、教室競合、推奨学期競合をコード化してスペイン語メッセージでパネルに表示する。
- パネルで曜日・時間・教室・教授を変更したら即時再検証する。既存の割当値は自動解除せず、矛盾があれば警告を残す。教授候補一覧は同パネル内に展開し、担当可能な教授を表示、全週次授業を担当できない候補は理由付きで無効化する。

3. Canvasと操作

- 既存のDiagram、`TimeSlotRowHeader`、`ScheduleEmptyCell`、`ClassCard`、`ScheduleAssignmentPanel`、`ProfessorAsignModal`、`src\shared\component\composite\modal\Modal.tsx`、`src\shared\component\composite\sidePanel\SidePanel.tsx`、`src\shared\component\composite\diagram\Diagram.tsx(必要であれば)`を拡張・再利用する。曜日はLunes、Martes、Miércoles、Jueves、Viernes、Sábado、Domingo、時間は実データの開始・終了時刻を表示する。
- 各セルは週次カードと追加用タイルを3列CSS Gridで左上から右下へ配置し、4件目以降を折り返す。行高は内容に応じて伸ばし、Canvas全体を縦横スクロール可能、曜日・時間ヘッダーをstickyにする。
- `@dnd-kit`のPointer/Keyboard SensorとDragOverlayを使用する。左からのコピー、Canvas内のセル間移動、同一セル内の並び替え、別カード上への挿入を実装する。
- 左カードのクリック／ドラッグ開始時は有効セルをハイライトする。別カードで切替、再クリック・Esc・Canvas外クリックで解除し、成功したドロップ後は新しい週次カードを選択して右パネルを開く。
- 空きセルのアバターには、その曜日・時間に稼働可能で、現在のCanvasで別授業に割り当てられていない全active教授を表示する。色は教授IDから決定論的に割り当てる。
- Canvasカードの右クリックメニューに「Eliminar del horario」を設ける。またCanvasカードをOffering Course領域へドロップしても同じ削除処理を行い、配置枠を左カードへ戻す。
- `ScheduleAssignmentPanel`は全sessionタブを表示し、選択sessionの教授・定員・必要数分の週次授業を編集する。定員は既存どおり初期値15の非永続ローカル値とし、今回の有効性判定には使用しない。

## Public Types and Interfaces

- 読取契約として、Offering Course、教授の担当科目と曜日別availability、教室、時間スロットをまとめた`ScheduleBuilderDataDto`を追加する。
- Feature内に`ScheduleCourseDraft`、`ScheduleSessionDraft`、`ScheduleOccurrence`、`ScheduleCellId`、`ScheduleConflictCode`を追加する。週次授業IDはcourse/session/連番から一意に生成する。
- `ClassCard`へ選択・完了・警告・ドラッグ状態を追加し、`ScheduleEmptyCell`へdefault/highlighted/invalid/drag-over状態を追加する。
- `ScheduleAssignmentPanel`のpropsを、選択course/session、週次授業一覧、教授候補、教室候補、競合メッセージ、各変更コールバックを受け取る制御コンポーネントへ整理する。

## Test Plan

- データ層：career/periodで選択済み科目を絞り、`sessionNumber >= 1`だけを科目情報・教授能力・availability・教室・T1〜T10と結合できること。
- ドメインロジック：必要週次回数の算出、最初の未完了sessionへの振分、全session完了／削除後の再開、移動時の自分自身除外を検証する。
- 制約：教授能力・availability・教授重複・教室重複・推奨学期重複を個別および複合で検出し、無効配置自体は保持されること。
- 操作：コピー、同一セル並び替え、セル間移動、Offering Course側への返却、右クリック削除、選択切替、Esc／外側クリック解除、ドロップ後のパネル表示を検証する。
- 表示：7曜日×10スロット、時刻、3列折り返し、アバター除外、完了カードと警告カード、loading/error/空一覧をPresenterテストとStorybookで確認する。
- 検証はnpmのみを使い、`npm run lint`、`npx tsc --noEmit`、`npx vitest run --project unit`、`npm run build-storybook`を実行する。

## Assumptions

- sessionNumberは開講session数、hoursは各sessionが必要とする週授業時間であり、教授はsession内の全週次授業で共通とする。
- 競合対象は今回のインメモリCanvas内の配置だけで、既存の`CourseAssignmentRecord`は初期表示にも判定にも使用しない。
- 同じ推奨学期の授業は、科目・sessionが異なっても同一曜日・Tスロットへ重ねない。
- スケジュール配置は保存しないが、左側のOffering Course選択内容は既存の前画面で保存されたcareer/period別データを読み取る。
- ユーザーが追加した既存部品・Storybookファイルは保持し、別実装のOffering Course Schedule Builderや未指定の共有コンポーネントは変更しない。
