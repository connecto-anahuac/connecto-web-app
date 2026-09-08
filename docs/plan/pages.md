# Professor・Class・Classroom・Plan画面追加

## Summary

- `student` featureを基準に、collection → 右側preview → detailの導線をprofessor・classroom・planへ展開する。
- classはcollectionテーブルのみとし、preview・detailルートは作らない。
- IndexedDB、DTO、repository、service、client handler、feature UIまで一貫して追加する。
- IndexedDBを利用するため、データ取得はstudent同様に`useLiveQuery`を使用し、Server Componentでのprefetchは行わない。

## Routes and UI

- 次のneutral routesを追加する。
  - `/professors?period=YYYYNN&professorId=...`、`/professors/[id]?period=YYYYNN`
  - `/classes`
  - `/classrooms?classroomId=...`、`/classrooms/[id]`
  - `/plans?planId=...`、`/plans/[id]`
- collectionの単クリックは対象IDだけをqueryへ設定して右previewを開き、ダブルクリックとpreviewの展開ボタンはdetailへ遷移する。閉じる操作では対象IDだけを削除し、`period`など他のqueryを維持する。
- professorのperiod未指定時は、capability・assignment・availabilityに存在する最新periodを使用する。detail遷移時もperiodを維持する。
- 既存`DataTableWithPreview`を3ドメインで再利用し、classは通常の`DataTable`を使う。各collectionに独立した`DataSearchProvider` scopeを設ける。
- sidebarを実際のリンクとして機能させ、Profesores、Materias、Aulas、Plan de estudiosを各routeへ接続する。

### Professor

- collection列: `id, name, status, career, job, assignableSubjects, assignedHours`。
- detail profile: `id, name, career, job, email1, email2, phone`。名前には生成avatar、statusには既存と同系統のbadge/status表現を使う。
- tabs:
  - `overview`: assigned科目数、assignable科目数、assigned hoursのカードと、空のwarningカード「Sin advertencias.」
  - `assigned-subjects`: 選択periodの科目、時限、教室をDataSectionテーブル表示
  - `available-hours`: T1〜T10を開始・終了時刻、提出状態、稼働可否付きで表示。未登録は「未提出」とし、falseと区別する
- `assigned`は実割当の重複しない科目数、`assignableSubjects`はcapabilityの重複しない科目数、`assignedHours`は割当slotの時間合計として算出する。

### Class / Classroom / Plan

- class列: `keyCode, keyNumber, name, hours, credits, block, prerequisito`。既存coursesとpreRequisitosをjoinし、複数前提科目は名称またはキーをカンマ区切りで表示する。行操作は付けない。
- classroom列・profile: `id, name, place, note, equipments, admin`。detailはprofileのみで、タブや未定コンテンツは追加しない。
- plan列・profile: `id, name, firstPeriod, admin`。
- plan detailはDataSectionで、list表示を科目表、card表示を`semester`・`position`に基づく学期図とする。検索・sort・filter・hide・pivotは既存DataSectionの仕組みに接続する。
- student専用`ProfileSummary`を無理に流用せず、任意のinformation lineと任意のavatar/statusを受け取れる共通profile summaryを追加し、新機能で共有する。studentの既存表示契約は変更しない。

## IndexedDB and Interfaces

- Dexie v3へ更新し、以下を追加する。
  - `professors`: `id, name, status, career, job, email1, email2, phone`
  - `professorCourseCapabilities`: `id, professorId, period, courseId`
  - `courseAssignments`: `id, professorId, period, courseId, timeSlotId, classroomId`
  - `professorAvailabilities`: `id, professorId, period, timeSlotId, isAvailable`
  - `timeSlots`: `id, startTime, endTime, position`
  - `classrooms`: `id, name, place, note, equipments[], admin`
  - `studyPlans`: `id, name, firstPeriod, admin`
- 既存`plans`はplan-course関連として`planId`を付与し、course、semester、positionとの関連を明示する。既存student-plan取得を壊さないため、移行中はcareer lookup情報を保持する。
- v2→v3 migrationでは既存plan行を`career + name`単位でまとめてstudy planを生成し、各行へ安定した`planId`を設定する。移行時に由来不明の`firstPeriod`・`admin`は空値とし、UIでは`--`表示する。
- T1〜T10は90分刻みで固定する: `07:00–08:30`から`20:30–22:00`まで。時刻計算は文字列ではなくslot masterの開始・終了から行う。
- public配下に開発用JSON seedを追加する。教授、教室、capability、assignment、availability、study planを相互参照可能な形で用意し、active/inactive、複数period、available/unavailable/unsubmittedの表示状態を含める。既存テーブルにデータがある場合は上書きしない。
- 各ドメインにcollection/detail DTOとUI mapperを追加する。featureからは`external/handler/**/query.client.ts`だけを呼び、repositoryやserviceを直接importしない。
- collection用serviceは関連テーブルを一括取得してMapでjoinし、行ごとの追加DB queryを避ける。

## Test Plan

- repository/service:
  - course＋prerequisite join、professorのperiod別集計、availability三状態、plan-course joinを検証する。
  - v2 plan migrationで既存行が失われず、同一planへ正しく集約されることを検証する。
  - seedが空テーブルだけを投入し、既存データを上書きしないことを検証する。
- UI/hooks:
  - 各collectionのloading・error・empty・通常表示。
  - 単クリックpreview、ダブルクリックdetail、preview展開、close、query保持、ID encoding。
  - professorの3 tabsとperiod切替、classの行操作なし、classroomのprofile-only detail。
  - planのlist／学期図切替とsemester配置。
- 検証コマンドはAGENTS.mdに従いnpmのみを使用する。また、実行時間制限回避のためテストは、sandbox外で実行検証する。
  - 対象テスト: `npm exec vitest -- run <追加・変更テスト>`
  - routes: `npm run typegen`
  - 静的検証: `npm run lint`
  - 最終確認: `npm run build`

## Assumptions

- UIラベルとempty/error文言は既存画面に合わせてスペイン語、コード・route・query名は英語とする。
- `admin`は担当者名の文字列、`courseId`は既存`CourseRecord.key`を参照する。
- 曜日情報は今回のスキーマに含めず、period内のT1〜T10だけを扱う。
- professor warningは今回は常に「警告なし」を表示し、割当競合判定は実装しない。
- classはユーザー指定どおりcollectionのみで、選択状態、preview、detail routeを持たない。
