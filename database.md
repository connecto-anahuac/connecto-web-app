## libraries
- dexie (IndexedDB wrapper)


## db

### local indexedDB
- database name: `appDB`

#### テーブル名: `students`
- schema: `{ id: number, name: string, status: string, period: number }`
- primary key: `id`
- index: `name`, `status`, `period`
 
#### テーブル名: `student_course_records`
- schema: `{ student_id: number, class_code: string, period: number, grade: number, status: string, update_at: string }`
- primary key: `student_id + class_code + period`
- index: `student_id`, `class_code`, `period`, `grade`, `status`, `update_at`

 