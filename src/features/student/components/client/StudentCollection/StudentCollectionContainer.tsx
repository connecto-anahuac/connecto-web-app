"use client";

import { StudentCollectionPresenter } from "./StudentCollectionPresenter";
import { useStaticStudentCollection } from "./useStaticStudentCollection";
import { useStudentCollectionTable } from "./useStudentCollectionTable";

export function StudentCollectionContainer() {
  const { errorMessage, loading, studentCollection } = useStaticStudentCollection();
  const { config, table } = useStudentCollectionTable(studentCollection);

  return <StudentCollectionPresenter errorMessage={errorMessage} loading={loading} table={table} tableConfig={config} />;
}
