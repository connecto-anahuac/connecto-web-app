# Student types

学生ドメインの UI モデル、変換関数、検索設定、表示設定を置く層です。コンポーネント固有の状態や TanStack Table のインスタンスはここに置きません。

## StudentClassItem の表示設定

`studentClassViewConfig.ts` の `STUDENT_CLASS_VIEW_CONFIG` が、StudentClassItem のリスト表示における唯一の列設定です。

- `id` と `position` は内部識別・グリッド配置用のためリストには出しません。
- それ以外のプロパティは初期表示列です。
- `preRequisites` はコース名だけを連結して表示・検索します。
- `status` は canonical な `GradeStatus` 値を保持し、表示と enum filter にはスペイン語ラベルを使います。
- `accessor` は比較用、`format` は画面・全文検索用です。両者を混同しないでください。

この設定は `components/table/dataView.types.ts` の `DataViewConfig<StudentClassItem>` を満たします。テーブル列だけでなく、将来グリッドを設定駆動に移行する際の共通メタデータです。

## 既存検索設定

`studentGradeFilterConfigs.ts` と `studentFilterConfigs.ts` は、既存の独自検索エンジン用の `DataPropertyConfig` です。StudentDetail の TanStack リストでは使用しませんが、他画面や完全移行判断まで削除しません。

## 新しいリスト列を追加する手順

1. `StudentClassItem` に UI モデルの値があることを確認する。
2. `STUDENT_CLASS_VIEW_CONFIG.columns` に `id`、`accessor`、`format`、値型、必要なら enum options と初期幅を追加する。
3. 表示値・非表示の内部値・特殊フォーマットを `studentClassViewConfig.test.ts` に追加する。
4. `npx tsc --noEmit` と該当 Vitest を実行する。
