"use client";

import { StudentCollectionContainer } from "../StudentCollection/StudentCollectionContainer";
import { StudentDetailContainer } from "../StudentDetail/StudentDetailContainer";
import { useStudentPreviewNavigation } from "./useStudentPreviewNavigation";
import SidePanel from "@/shared/component/composite/sidePanel/SidePanel";
import IconButton from "@/shared/component/primitive/button/IconButton";
import PanelControllButton from "@/shared/component/primitive/button/PanelControllButton";

type Props = {
  studentId?: string;
};

export function StudentsPageContent({ studentId }: Props) {
  const { closeStudentPreview, openStudentDetail, selectStudent } =
    useStudentPreviewNavigation();

  return (
    <SidePanel.Root
      className="h-full w-full"
      onPanelChange={(panel) => {
        if (!panel) closeStudentPreview();
      }}
      panel={studentId ? { id: studentId, type: "student" } : null}
    >
      <SidePanel.Main className="h-full w-full">
        <StudentCollectionContainer
          activeStudentId={studentId}
          onStudentOpen={openStudentDetail}
          onStudentSelect={selectStudent}
        />
      </SidePanel.Main>
      <SidePanel.Viewport
        aria-label="Student preview"
        className="z-50 flex w-2/5 max-w-2xl flex-col gap-1 overflow-y-auto bg-SurfaceContainerLowest shadow-xl"
      >
        <SidePanel.Content type="student">
          {(panel) => (
            <>
              <div className="flex justify-between gap-1 p-2">
                <PanelControllButton
                  aria-label="Open student detail page"
                  appearance="text"
                  intent="lightInk"
                  isOpen
                  onClick={() => openStudentDetail(panel.id)}
                  size="lg"
                  type="button"
                />
                <IconButton
                  aria-label="Close student preview"
                  appearance="text"
                  icon="close"
                  intent="lightInk"
                  onClick={closeStudentPreview}
                  size="lg"
                  type="button"
                />
              </div>
              <StudentDetailContainer
                key="student-preview"
                className="px-4"
                studentId={panel.id}
              />
            </>
          )}
        </SidePanel.Content>
      </SidePanel.Viewport>
    </SidePanel.Root>
  );
}
