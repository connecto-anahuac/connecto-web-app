"use client";

import {
  cloneElement,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLProps,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
  type VirtualElement,
  type UseFloatingOptions,
} from "@floating-ui/react";

type ModalProviderProps = {
  children: ReactNode;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state for an uncontrolled modal. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
} & Omit<UseFloatingOptions, "open" | "onOpenChange" | "elements">;

type ModalContextValue = {
  floatingStyles: CSSProperties;
  getFloatingProps: ReturnType<typeof useInteractions>["getFloatingProps"];
  getReferenceProps: ReturnType<typeof useInteractions>["getReferenceProps"];
  open: boolean;
  registerReference: (id: string, node: Element | null) => void;
  setFloating: (node: HTMLElement | null) => void;
  setReferenceForTrigger: (
    referenceId: string | undefined,
    node: Element,
  ) => void;
};

export type ModalHandle = {
  open: (reference?: Element | VirtualElement) => void;

  close: () => void;
};

const ModalContext = createContext<ModalContextValue | null>(null);

export const ModalProvider = forwardRef<ModalHandle, ModalProviderProps>(
  function ModalProvider(
    {
      children,
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      ...options
    },
    ref,
  ) {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const references = useRef(new Map<string, Element>());
    const open = controlledOpen ?? uncontrolledOpen;

    const handleOpenChange = useCallback(
      (nextOpen: boolean) => {
        if (controlledOpen === undefined) {
          setUncontrolledOpen(nextOpen);
        }
        onOpenChange?.(nextOpen);
      },
      [controlledOpen, onOpenChange],
    );

    const floating = useFloating({
      open,
      onOpenChange: handleOpenChange,
      placement: "bottom-start",
      whileElementsMounted: autoUpdate,
      middleware: [offset(6), flip(), shift({ padding: 8 })],
      ...options,
    });

    useImperativeHandle(
      ref,
      () => ({
        open: (reference) => {
          if (reference) {
            floating.refs.setReference(reference);
          }
          handleOpenChange(true);
        },
        close: () => handleOpenChange(false),
      }),
      [floating.refs, handleOpenChange],
    );

    const click = useClick(floating.context);
    const dismiss = useDismiss(floating.context);
    const role = useRole(floating.context, { role: "dialog" });
    const { getReferenceProps, getFloatingProps } = useInteractions([
      click,
      dismiss,
      role,
    ]);

    const registerReference = useCallback(
      (id: string, node: Element | null) => {
        if (node) {
          references.current.set(id, node);
        } else {
          references.current.delete(id);
        }
      },
      [],
    );

    const setReferenceForTrigger = useCallback(
      (referenceId: string | undefined, trigger: Element) => {
        floating.refs.setReference(
          referenceId === undefined
            ? trigger
            : (references.current.get(referenceId) ?? trigger),
        );
      },
      [floating.refs],
    );

    const value = useMemo(
      () => ({
        floatingStyles: floating.floatingStyles,
        getFloatingProps,
        getReferenceProps,
        open,
        registerReference,
        setFloating: floating.refs.setFloating,
        setReferenceForTrigger,
      }),
      [
        floating.floatingStyles,
        floating.refs.setFloating,
        getFloatingProps,
        getReferenceProps,
        open,
        registerReference,
        setReferenceForTrigger,
      ],
    );

    return (
      <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
    );
  },
);

function useModalContext() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("Modal components must be inside <ModalProvider>");
  }

  return context;
}

type ReferenceProps = {
  id: string;
  children?: ReactElement<HTMLProps<HTMLElement>>;
};

function Reference({ id, children }: ReferenceProps) {
  const { registerReference } = useModalContext();
  const setReference = useCallback(
    (node: HTMLElement | null) => registerReference(id, node),
    [id, registerReference],
  );

  if (children) {
    return cloneElement(children, { ref: setReference });
  }

  return (
    <span
      aria-hidden="true"
      ref={setReference}
      style={{ display: "inline-block", height: 0, width: 0 }}
    />
  );
}

type TriggerProps = {
  children: ReactElement<HTMLProps<HTMLElement>>;
  /** The id of a <Modal.Reference>. Without one, the trigger is the anchor. */
  reference?: string;
};

function Trigger({ children, reference }: TriggerProps) {
  const { getReferenceProps, open, setReferenceForTrigger } = useModalContext();
  const triggerProps = getReferenceProps(
    children.props,
  ) as HTMLProps<HTMLElement>;

  return cloneElement(children, {
    "aria-expanded": open,
    ...triggerProps,
    onClick: (event: ReactMouseEvent<HTMLElement>) => {
      setReferenceForTrigger(reference, event.currentTarget);
      triggerProps.onClick?.(event);
    },
  });
}

type ContentProps = {
  children: ReactElement<HTMLProps<HTMLElement>>;
};

function Content({ children }: ContentProps) {
  const { floatingStyles, getFloatingProps, open, setFloating } =
    useModalContext();

  if (!open) return null;

  return cloneElement(children, {
    ref: setFloating,
    style: { ...children.props.style, ...floatingStyles, zIndex: 9999 },
    ...getFloatingProps(children.props),
  });
}

export const Modal = {
  Content,
  Reference,
  Trigger,
};

export default Modal;
