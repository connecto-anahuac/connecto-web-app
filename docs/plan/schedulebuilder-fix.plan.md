Student側の実装を基準に、TanStack Tableへ渡す配列の参照を生成元で安定させます。`useTable` 共通実装やStudent側は変更しません。

## 参照したパターン

[useStudentClassTable.ts](C:/Users/deded/Documents/LocalDev/Connecto/src/features/student/components/client/StudentDetail/useStudentClassTable.ts:20) 自体は、受け取った `data` をそのまま `useTable` に渡しています。

参照安定性は呼び出し元の [useStaticStudentDetail.ts](C:/Users/deded/Documents/LocalDev/Connecto/src/features/student/components/client/StudentDetail/useStaticStudentDetail.ts:31) が保証しています。

- 空配列をモジュール定数 `EMPTY_STUDENT_GRADES` として共有
- DTO変換を `useMemo([snapshot])` で固定
- [StudentDetailContainer.tsx](C:/Users/deded/Documents/LocalDev/Connecto/src/features/student/components/client/StudentDetail/StudentDetailContainer.tsx:38) は、その安定した配列をテーブルフックへ渡すだけ

## 修正プラン

1. Schedule Builderの入力参照を安定化する

   [OfferingCourseShellContainer.tsx](C:/Users/deded/Documents/LocalDev/Connecto/src/features/scheduleBuilder/client/offeringCourseShell/OfferingCourseShellContainer.tsx:72) を修正します。

   - `ScheduleBuilderCourseDto[]` 用の空配列をモジュール定数として定義
   - propsの既定値 `offeringCourses = []` をその定数へ変更
   - `sourceCourses.map(toScheduleBuilderOfferingCourse)` を `useMemo` で囲む
   - 依存配列は `[sourceCourses]` のみにする

   想定形は次のとおりです。

   ```tsx
   const EMPTY_OFFERING_COURSES: readonly ScheduleBuilderCourseDto[] = [];

   function OfferingCourseShellContent({
     offeringCourses: sourceCourses = EMPTY_OFFERING_COURSES,
     // ...
   }: ContentProps) {
     const offeringCourses = useMemo(
       () => sourceCourses.map(toScheduleBuilderOfferingCourse),
       [sourceCourses],
     );
   }
   ```

2. テーブルフックの責務を維持する

   [useOfferingCourseShellTable.ts](C:/Users/deded/Documents/LocalDev/Connecto/src/features/scheduleBuilder/client/offeringCourseShell/useOfferingCourseShellTable.ts:39) は変更しません。

   Student側と同様に、「テーブルフックは安定したデータを受け取る」という境界にします。共有 `useTable` で `autoResetPageIndex: false` を設定する案は、他画面のページリセット動作まで変え、不安定な参照を隠すため採用しません。

3. クライアント再レンダーの回帰テストを追加する

   現在の [useOfferingCourseShellTable.test.ts](C:/Users/deded/Documents/LocalDev/Connecto/src/features/scheduleBuilder/client/offeringCourseShell/useOfferingCourseShellTable.test.ts:36) は静的サーバーレンダリングなので、TanStack Tableの内部state更新を再現できません。

   `OfferingCourseShellContainer.stories.tsx` を追加し、ブラウザ上で以下を検証します。

   - `DataSearchRootProvider` 配下でContainerを表示
   - 親ハーネスが `selectedCourseKey` をstate管理
   - コースカードをクリック
   - クリック処理が完了し、`data-isselected="true"` へ変わる
   - 続けて検索入力または再クリックが操作できる
   - props未指定の空一覧でも、親の再レンダー後に停止しない

   修正前は最初のクリックがタイムアウトし、修正後は完了するため、今回の不具合を直接検出できます。

4. 検証する

   プロジェクト規約に従い、`npm` で以下を実行します。

   ```powershell
   npm exec vitest -- run --config vitest.unit.config.ts src/features/scheduleBuilder/client/offeringCourseShell
   npm exec vitest -- run --project=storybook
   npm run lint -- src/features/scheduleBuilder/client/offeringCourseShell
   ```

   最後に実ページで、コース選択・選択解除・検索・ドラッグ開始が連続して操作できることを確認します。

実装時はサブエージェントに `OfferingCourseShellContainer.tsx` と回帰Storyの所有権を渡し、メインスレッドではこのプランとの一致、共有テーブルへ不要な変更が入っていないこと、検証結果を確認します。