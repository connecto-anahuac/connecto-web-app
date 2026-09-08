"use client";

import { ProfessorCollection } from "../ProfessorCollection/ProfessorCollection";
import { ProfessorDetail } from "../ProfessorDetail/ProfessorDetail";
import { PeriodControl } from "./PeriodControl";
import { useProfessorNavigation } from "./useProfessorNavigation";

type Props = { professorId?: string; period?: string };

export function ProfessorsPageContent({ professorId, period }: Props) {
  const navigation = useProfessorNavigation();
  return (
    <div className="relative flex h-full w-full flex-col">
      <PeriodControl period={period} onChange={navigation.setPeriod} />
      <div className="min-h-0 flex-1">
        <ProfessorCollection
          activeProfessorId={professorId}
          period={period}
          onSelect={navigation.selectProfessor}
          onOpen={navigation.openDetail}
          onPreviewClose={navigation.closePreview}
          renderPreview={(id) => <ProfessorDetail className="px-4" professorId={id} period={period} />}
        />
      </div>
    </div>
  );
}
