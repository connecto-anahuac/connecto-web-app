import { renderToStaticMarkup } from "react-dom/server";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { StudentsPageContent } from "./StudentsPageContent";

let collectionProps: Record<string, unknown> | undefined;

const navigation = vi.hoisted(() => ({
  closeStudentPreview: vi.fn(),
  openStudentDetail: vi.fn(),
  selectStudent: vi.fn(),
}));

vi.mock("../StudentCollection/StudentCollectionContainer", () => ({
  StudentCollectionContainer: (props: Record<string, unknown>) => {
    collectionProps = props;
    return <div data-testid="student-collection" />;
  },
}));

vi.mock("../StudentDetail/StudentDetailContainer", () => ({
  StudentDetailContainer: ({ studentId, className }: { studentId: string; className?: string }) => (
    <div className={className} data-student-id={studentId}>Student detail</div>
  ),
}));

vi.mock("./useStudentPreviewNavigation", () => ({
  useStudentPreviewNavigation: () => navigation,
}));

describe("StudentsPageContent", () => {
  it("connects the selected student and URL navigation callbacks to the collection preview", () => {
    renderToStaticMarkup(<StudentsPageContent studentId="A/B 1" />);

    const props = collectionProps as {
      activeStudentId: string;
      onStudentOpen: (studentId: string) => void;
      onStudentPreviewClose: () => void;
      onStudentSelect: (studentId: string) => void;
      renderStudentPreview: (studentId: string) => ReactNode;
    };

    props.onStudentSelect("1111");
    props.onStudentOpen("A/B 1");
    props.onStudentPreviewClose();

    expect(props.activeStudentId).toBe("A/B 1");
    expect(navigation.selectStudent).toHaveBeenCalledWith("1111");
    expect(navigation.openStudentDetail).toHaveBeenCalledWith("A/B 1");
    expect(navigation.closeStudentPreview).toHaveBeenCalledOnce();
    expect(renderToStaticMarkup(props.renderStudentPreview("A/B 1"))).toContain(
      'data-student-id="A/B 1"',
    );
  });
});
