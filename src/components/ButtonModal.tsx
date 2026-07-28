"use client";

import {
  cloneElement,
  createContext,
  useContext,
  type HTMLProps,
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
  type UseFloatingOptions,
} from "@floating-ui/react";

type ButtonModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
} & UseFloatingOptions;

type ContextValue = ReturnType<typeof useButtonModal>;

const Context = createContext<ContextValue | null>(null);

function useButtonModal({ open, onOpenChange, ...options }: ButtonModalProps) {
  const floating = useFloating({
    open,
    onOpenChange,
    placement: "bottom-start",
    whileElementsMounted: autoUpdate,
    middleware: [offset(6), flip(), shift({ padding: 8 })],
    ...options,
  });

  const click = useClick(floating.context);
  const dismiss = useDismiss(floating.context);

  const interactions = useInteractions([click, dismiss]);

  return {
    ...floating,
    ...interactions,
    open,
  };
}

export default function ButtonModal(props: ButtonModalProps) {
  const value = useButtonModal(props);

  return <Context.Provider value={value}>{props.children}</Context.Provider>;
}

function useButtonModalContext() {
  const ctx = useContext(Context);

  if (!ctx) {
    throw new Error("ButtonModal components must be inside <ButtonModal>");
  }

  return ctx;
}

type TriggerProps = {
  children: ReactElement<HTMLProps<Element>>;
};

ButtonModal.Trigger = function Trigger({ children }: TriggerProps) {
  const { refs, getReferenceProps, open } = useButtonModalContext();

  return cloneElement(children, {
    ref: refs.setReference,
    "aria-pressed": open,
    ...getReferenceProps(children.props),
  });
};

type ContentProps = {
  children: ReactElement<HTMLProps<HTMLElement>>;
};

ButtonModal.Content = function Content({ children }: ContentProps) {
  const { refs, floatingStyles, getFloatingProps, open } =
    useButtonModalContext();

  if (!open) return null;

  return cloneElement(children, {
    ref: refs.setFloating,
    style: {
      ...children.props.style,
      ...floatingStyles,
      zIndex: 9999,
    },
    ...getFloatingProps(children.props),
  });
};

//==================================================
//Example usage
//==================================================

// <ButtonModal open={open} onOpenChange={onOpenChange}>
//   <ButtonModal.Trigger>
//     <child/>
//   </ButtonModal.Trigger>

//   <ButtonModal.Content>
//     <child/>
//   </ButtonModal.Content>
// </ButtonModal>
