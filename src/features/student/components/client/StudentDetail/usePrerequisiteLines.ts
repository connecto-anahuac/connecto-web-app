"use client";

import {
  type RefCallback,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { PrerequisiteEdge } from "./useStudentDiagramSelection";

type Rect = Pick<DOMRect, "bottom" | "height" | "left" | "right" | "top" | "width">;

export type PrerequisiteLine = PrerequisiteEdge & {
  path: string;
};

export function getPrerequisiteLinePath(
  root: Rect,
  prerequisite: Rect,
  course: Rect,
) {
  const prerequisiteCenterX = prerequisite.left + prerequisite.width / 2;
  const prerequisiteCenterY = prerequisite.top + prerequisite.height / 2;
  const courseCenterX = course.left + course.width / 2;
  const courseCenterY = course.top + course.height / 2;

  if (Math.abs(courseCenterX - prerequisiteCenterX) >= Math.abs(courseCenterY - prerequisiteCenterY)) {
    const pointsRight = prerequisiteCenterX <= courseCenterX;
    const startX = (pointsRight ? prerequisite.right : prerequisite.left) - root.left;
    const endX = (pointsRight ? course.left : course.right) - root.left;
    const startY = prerequisiteCenterY - root.top;
    const endY = courseCenterY - root.top;
    const controlX = (startX + endX) / 2;

    return `M ${startX} ${startY} C ${controlX} ${startY} ${controlX} ${endY} ${endX} ${endY}`;
  }

  const pointsDown = prerequisiteCenterY <= courseCenterY;
  const startX = prerequisiteCenterX - root.left;
  const endX = courseCenterX - root.left;
  const startY = (pointsDown ? prerequisite.bottom : prerequisite.top) - root.top;
  const endY = (pointsDown ? course.top : course.bottom) - root.top;
  const controlY = (startY + endY) / 2;

  return `M ${startX} ${startY} C ${startX} ${controlY} ${endX} ${controlY} ${endX} ${endY}`;
}

function linesEqual(
  current: readonly PrerequisiteLine[],
  next: readonly PrerequisiteLine[],
) {
  return (
    current.length === next.length &&
    current.every(
      (line, index) =>
        line.prerequisiteId === next[index]?.prerequisiteId &&
        line.courseId === next[index]?.courseId &&
        line.path === next[index]?.path,
    )
  );
}

export function usePrerequisiteLines(edges: readonly PrerequisiteEdge[]) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardElements = useRef(new Map<string, HTMLButtonElement>());
  const [lines, setLines] = useState<readonly PrerequisiteLine[]>([]);

  const setCardRef = useCallback(
    (itemId: string): RefCallback<HTMLButtonElement> =>
      (element) => {
        if (element) cardElements.current.set(itemId, element);
        else cardElements.current.delete(itemId);
      },
    [],
  );

  const measure = useCallback(() => {
    const root = rootRef.current;
    if (!root || edges.length === 0) {
      setLines((current) => (current.length === 0 ? current : []));
      return;
    }

    const rootRect = root.getBoundingClientRect();
    const next = edges.flatMap<PrerequisiteLine>((edge) => {
      const prerequisite = cardElements.current.get(edge.prerequisiteId);
      const course = cardElements.current.get(edge.courseId);
      if (!prerequisite || !course) return [];

      return [
        {
          ...edge,
          path: getPrerequisiteLinePath(
            rootRect,
            prerequisite.getBoundingClientRect(),
            course.getBoundingClientRect(),
          ),
        },
      ];
    });

    setLines((current) => (linesEqual(current, next) ? current : next));
  }, [edges]);

  useLayoutEffect(() => {
    measure();

    const root = rootRef.current;
    if (!root) return;

    const viewport = root.closest<HTMLElement>("[data-diagram-viewport]");
    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(measure);

    resizeObserver?.observe(root);
    for (const element of cardElements.current.values()) {
      resizeObserver?.observe(element);
    }
    viewport?.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      resizeObserver?.disconnect();
      viewport?.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  return useMemo(
    () => ({ lines, measure, rootRef, setCardRef }),
    [lines, measure, setCardRef],
  );
}
