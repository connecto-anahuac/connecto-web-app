export type BreadcrumbItem = {
  label: string;
  href?: string;
};

const ROOT_SEGMENT_LABELS: Record<string, string> = {
  students: "Alumnos",
  professors: "Profesores",
  classes: "Materias",
  classrooms: "Salones",
  plans: "Plan de estudios",
  data: "Data Import",
  "schedule-builder": "Schedule builder",
};

const SCHEDULE_BUILDER_SEGMENT_LABELS: Record<string, string> = {
  "offering-course": "offering course",
  builder: "Schedule builder",
};

function decodeSegment(segment: string) {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

function getSegmentLabel(segments: string[], index: number) {
  const segment = segments[index];

  if (index === 0) {
    return ROOT_SEGMENT_LABELS[segment] ?? decodeSegment(segment);
  }

  if (segments[0] === "schedule-builder") {
    return SCHEDULE_BUILDER_SEGMENT_LABELS[segment] ?? decodeSegment(segment);
  }

  return decodeSegment(segment);
}

export function getBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return [];

  if (
    segments.length === 2 &&
    segments[0] === "schedule-builder" &&
    segments[1] === "builder"
  ) {
    return [{ label: "Schedule builder" }];
  }

  return segments.map((_, index) => {
    const isCurrentPage = index === segments.length - 1;

    return {
      label: getSegmentLabel(segments, index),
      href: isCurrentPage
        ? undefined
        : `/${segments.slice(0, index + 1).join("/")}`,
    };
  });
}
