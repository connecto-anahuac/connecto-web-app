# Student types

Student UIのモデルと `DataViewConfig` を配置します。

- `studentClassViewConfig.ts`: StudentDetailの成績一覧
- `studentFilterConfigs.ts`: 学生一覧の表示・検索・フィルター定義

検索専用の定義は作らず、`id / accessor / format / searchTexts / options / dynamicOption` をDataViewカラムへ宣言します。static optionがあるカラムではdynamic optionは生成されません。

新しいカラムを追加した場合は、表示値とmetadata生成のテストを追加し、`npx tsc --noEmit` と関連Vitestを実行してください。
