"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";

export type SidePanelValue = {
  id: string;
  type: string;
};

export type SidePanelMode = "overlay" | "push";
export type SidePanelSide = "top" | "right" | "bottom" | "left";

type SidePanelContextValue = {
  close: () => void;
  isOpen: boolean;
  mode: SidePanelMode;
  open: (panel: SidePanelValue) => void;
  panel: SidePanelValue | null;
  side: SidePanelSide;
};

const SidePanelContext = createContext<SidePanelContextValue | null>(null);

function useSidePanelContext() {
  const context = useContext(SidePanelContext);

  if (!context) {
    throw new Error("SidePanel components must be inside <SidePanel.Root>");
  }

  return context;
}

export function useSidePanel() {
  return useSidePanelContext();
}

export type SidePanelRootProps = ComponentProps<"div"> & {
  /** Controlled panel selection. Use null to close the panel. */
  panel?: SidePanelValue | null;
  /** Initial panel selection when the component is uncontrolled. */
  defaultPanel?: SidePanelValue | null;
  mode?: SidePanelMode;
  onPanelChange?: (panel: SidePanelValue | null) => void;
  side?: SidePanelSide;
};

function Root({
  children,
  className,
  defaultPanel = null,
  mode = "overlay",
  onPanelChange,
  panel: controlledPanel,
  side = "right",
  ...props
}: SidePanelRootProps) {
  const [uncontrolledPanel, setUncontrolledPanel] = useState(defaultPanel);
  const panel = controlledPanel === undefined ? uncontrolledPanel : controlledPanel;

  const setPanel = useCallback(
    (nextPanel: SidePanelValue | null) => {
      if (controlledPanel === undefined) {
        setUncontrolledPanel(nextPanel);
      }
      onPanelChange?.(nextPanel);
    },
    [controlledPanel, onPanelChange],
  );

  const open = useCallback((nextPanel: SidePanelValue) => setPanel(nextPanel), [setPanel]);
  const close = useCallback(() => setPanel(null), [setPanel]);

  useEffect(() => {
    if (!panel) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [close, panel]);

  const value = useMemo(
    () => ({ close, isOpen: panel !== null, mode, open, panel, side }),
    [close, mode, open, panel, side],
  );

  const layoutClassName =
    mode === "overlay"
      ? "relative"
      : side === "top"
        ? "flex flex-col-reverse"
        : side === "bottom"
          ? "flex flex-col"
          : side === "left"
            ? "flex flex-row-reverse"
            : "flex flex-row";

  return (
    <SidePanelContext.Provider value={value}>
      <div className={[layoutClassName, className].filter(Boolean).join(" ")} {...props}>
        {children}
      </div>
    </SidePanelContext.Provider>
  );
}

export type SidePanelMainProps = ComponentProps<"div">;

function Main({ children, className, ...props }: SidePanelMainProps) {
  const { mode } = useSidePanelContext();

  return (
    <div
      className={[
        mode === "push" ? "min-h-0 min-w-0 flex-1" : undefined,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export type SidePanelViewportProps = Omit<ComponentProps<"aside">, "aria-label"> & {
  "aria-label": string;
};

function Viewport({ children, className, ...props }: SidePanelViewportProps) {
  const { mode, panel, side } = useSidePanelContext();

  if (!panel) return null;

  const placementClassName =
    mode === "push"
      ? "shrink-0"
      : side === "top"
        ? "absolute inset-x-0 top-0"
        : side === "bottom"
          ? "absolute inset-x-0 bottom-0"
          : side === "left"
            ? "absolute inset-y-0 left-0"
            : "absolute inset-y-0 right-0";

  return (
    <aside
      className={[placementClassName, className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </aside>
  );
}

export type SidePanelContentProps = {
  children: (panel: SidePanelValue) => ReactNode;
  type: string;
};

function Content({ children, type }: SidePanelContentProps) {
  const { panel } = useSidePanelContext();

  if (!panel || panel.type !== type) return null;

  return <>{children(panel)}</>;
}

export const SidePanel = {
  Content,
  Main,
  Root,
  Viewport,
};

export default SidePanel;
