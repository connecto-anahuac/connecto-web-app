import { renderToStaticMarkup } from "react-dom/server";
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
  it("connects the selected student and URL navigation callbacks to SidePanel", () => {
    const markup = renderToStaticMarkup(<StudentsPageContent studentId="A/B 1" />);

    const props = collectionProps as {
      activeStudentId: string;
      onStudentOpen: (studentId: string) => void;
      onStudentSelect: (studentId: string) => void;
    };

    props.onStudentSelect("1111");
    props.onStudentOpen("A/B 1");

    expect(props.activeStudentId).toBe("A/B 1");
    expect(navigation.selectStudent).toHaveBeenCalledWith("1111");
    expect(navigation.openStudentDetail).toHaveBeenCalledWith("A/B 1");
    expect(props).not.toHaveProperty("renderStudentPreview");
    expect(props).not.toHaveProperty("onStudentPreviewClose");
    expect(markup).toContain('aria-label="Student preview"');
    expect(markup).toContain('aria-label="Open student detail page"');
    expect(markup).toContain('aria-label="Close student preview"');
    expect(markup).toContain('data-student-id="A/B 1"');
  });
});
