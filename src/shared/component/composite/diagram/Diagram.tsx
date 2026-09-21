"use client";

import {
  Children,
  Fragment,
  isValidElement,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/shared/lib/util";

import CountLocator, { type LocatorDirection } from "./CountLocator";

export type DiagramProps = ComponentProps<"div"> & {
  columnCount?: number;
  rowCount?: number;
  columnWidth?: string;
  gap?: CSSProperties["gap"];
};

export type DiagramHeaderGroupProps = {
  children?: ReactNode;
};

export type DiagramContentProps = ComponentProps<"div"> & {
  x: number;
  y: number;
  locatorTarget?: boolean;
};

export type DiagramViewportProps = ComponentProps<"div"> & {
  showLocators?: boolean;
  viewportClassName?: string;
};

export type DiagramRect = Pick<
  DOMRect,
  "bottom" | "left" | "right" | "top"
>;

export type LocatorCounts = Record<LocatorDirection, number>;

const emptyLocatorCounts: LocatorCounts = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

export function getLocatorCounts(
  viewport: DiagramRect,
  targets: readonly DiagramRect[],
): LocatorCounts {
  return targets.reduce<LocatorCounts>((counts, target) => {
    const isVisible =
      target.right > viewport.left &&
      target.left < viewport.right &&
      target.bottom > viewport.top &&
      target.top < viewport.bottom;

    if (isVisible) {
      return counts;
    }

    if (target.bottom <= viewport.top) counts.top += 1;
    if (target.left >= viewport.right) counts.right += 1;
    if (target.top >= viewport.bottom) counts.bottom += 1;
    if (target.right <= viewport.left) counts.left += 1;

    return counts;
  }, { ...emptyLocatorCounts });
}

function getVisibleChildren(children: ReactNode): ReactNode[] {
  const visibleChildren: ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (child === null || child === undefined || typeof child === "boolean") {
      return;
    }

    if (isValidElement(child) && child.type === Fragment) {
      const fragment = child as React.ReactElement<{ children?: ReactNode }>;
      visibleChildren.push(...getVisibleChildren(fragment.props.children));
      return;
    }

    visibleChildren.push(child);
  });

  return visibleChildren;
}

function countHeaderChildren(
  children: ReactNode,
  headerType: typeof DiagramColumns | typeof DiagramRows,
): number {
  let count = 0;

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return;
    }

    if (child.type === Fragment) {
      const fragment = child as React.ReactElement<{ children?: ReactNode }>;
      count += countHeaderChildren(fragment.props.children, headerType);
      return;
    }

    if (child.type === headerType) {
      const header = child as React.ReactElement<DiagramHeaderGroupProps>;
      count += getVisibleChildren(header.props.children).length;
    }
  });

  return count;
}

function getChildKey(child: ReactNode, fallback: string) {
  return isValidElement(child) && child.key !== null ? child.key : fallback;
}

function DiagramColumns({ children }: DiagramHeaderGroupProps) {
  return getVisibleChildren(children).map((child, index) => (
    <div
      key={getChildKey(child, `diagram-column-${index}`)}
      style={{
        gridColumnStart: index + 2,
        gridRowStart: 1,
        position: "sticky",
        top: 0,
        zIndex: 25,
      }}
    >
      {child}
    </div>
  ));
}

function DiagramRows({ children }: DiagramHeaderGroupProps) {
  return getVisibleChildren(children).map((child, index) => (
    <div
      key={getChildKey(child, `diagram-row-${index}`)}
      style={{
        gridColumnStart: 1,
        gridRowStart: index + 2,
        position: "sticky",
        left: 0,
        zIndex: 20,
      }}
    >
      {child}
    </div>
  ));
}

function DiagramContent({
  x,
  y,
  locatorTarget,
  style,
  ...props
}: DiagramContentProps) {
  return (
    <div
      {...props}
      data-diagram-locator-target={locatorTarget || undefined}
      style={{
        ...style,
        gridColumnStart: x + 1,
        gridRowStart: y + 1,
      }}
    />
  );
}

const locatorPositions: Record<LocatorDirection, string> = {
  top: "top-2 left-1/2 -translate-x-1/2",
  right: "right-2 top-1/2 -translate-y-1/2",
  bottom: "bottom-2 left-1/2 -translate-x-1/2",
  left: "left-2 top-1/2 -translate-y-1/2",
};

function DiagramViewport({
  children,
  showLocators = false,
  className,
  viewportClassName,
  ...props
}: DiagramViewportProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const [counts, setCounts] = useState<LocatorCounts>(emptyLocatorCounts);

  const measure = useCallback(() => {
    const viewport = scrollRef.current;

    if (!viewport || !showLocators) {
      setCounts(emptyLocatorCounts);
      return;
    }

    const targets = Array.from(
      viewport.querySelectorAll<HTMLElement>(
        '[data-diagram-locator-target="true"]',
      ),
    );
    const nextCounts = getLocatorCounts(
      viewport.getBoundingClientRect(),
      targets.map((target) => target.getBoundingClientRect()),
    );

    setCounts((current) =>
      (Object.keys(nextCounts) as LocatorDirection[]).every(
        (direction) => current[direction] === nextCounts[direction],
      )
        ? current
        : nextCounts,
    );
  }, [showLocators]);

  const scheduleMeasure = useCallback(() => {
    if (frameRef.current !== null) return;

    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      measure();
    });
  }, [measure]);

  useEffect(() => {
    const viewport = scrollRef.current;
    if (!viewport || !showLocators) {
      measure();
      return;
    }

    const resizeObserver = new ResizeObserver(scheduleMeasure);
    resizeObserver.observe(viewport);
    if (viewport.firstElementChild) {
      resizeObserver.observe(viewport.firstElementChild);
    }

    const mutationObserver = new MutationObserver(scheduleMeasure);
    mutationObserver.observe(viewport, {
      attributeFilter: ["data-diagram-locator-target", "style", "class"],
      attributes: true,
      childList: true,
      subtree: true,
    });

    viewport.addEventListener("scroll", scheduleMeasure, { passive: true });
    scheduleMeasure();

    return () => {
      viewport.removeEventListener("scroll", scheduleMeasure);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [measure, scheduleMeasure, showLocators]);

  return (
    <div {...props} className={cn("relative", className)}>
      <div
        ref={scrollRef}
        className={cn(
          "h-[inherit] max-h-[inherit] w-full overflow-auto",
          viewportClassName,
        )}
        data-diagram-viewport="true"
      >
        {children}
      </div>

      {showLocators &&
        (Object.keys(counts) as LocatorDirection[]).map((direction) =>
          counts[direction] > 0 ? (
            <CountLocator
              key={direction}
              direction={direction}
              value={counts[direction]}
              className={cn(
                "pointer-events-none absolute z-40",
                locatorPositions[direction],
              )}
            />
          ) : null,
        )}
    </div>
  );
}

function createGridTemplate(count: number, trackSize: string) {
  return count > 0 ? `auto repeat(${count}, ${trackSize})` : "auto";
}

function DiagramRoot({
  children,
  columnCount,
  rowCount,
  columnWidth = "minmax(13rem, 1fr)",
  gap = "1rem",
  style,
  ...props
}: DiagramProps) {
  const resolvedColumnCount =
    columnCount ?? countHeaderChildren(children, DiagramColumns);
  const resolvedRowCount =
    rowCount ?? countHeaderChildren(children, DiagramRows);

  return (
    <div
      {...props}
      style={{
        display: "grid",
        gridTemplateColumns: createGridTemplate(
          resolvedColumnCount,
          columnWidth,
        ),
        gridTemplateRows: createGridTemplate(resolvedRowCount, "min-content"),
        gridAutoRows: "min-content",
        gap,
        ...style,
      }}
    >
      <div
        aria-hidden="true"
        className="w-fit"
        style={{
          gridColumnStart: 1,
          gridRowStart: 1,
          position: "sticky",
          top: 0,
          left: 0,
          zIndex: 30,
          background: "transparent",
        }}
      >
        <div className="w-4" />
      </div>

      {children}
    </div>
  );
}

export const Diagram = Object.assign(DiagramRoot, {
  Columns: DiagramColumns,
  Rows: DiagramRows,
  Content: DiagramContent,
  Viewport: DiagramViewport,
});
