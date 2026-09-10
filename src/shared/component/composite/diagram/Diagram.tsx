import {
  Children,
  Fragment,
  isValidElement,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from "react";

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
};

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

function DiagramContent({ x, y, style, ...props }: DiagramContentProps) {
  return (
    <div
      {...props}
      style={{
        ...style,
        gridColumnStart: x + 1,
        gridRowStart: y + 1,
      }}
    />
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
});
