"use client";

import { forwardRef, type ComponentProps } from "react";
import Modal, {
  ModalProvider,
  type ModalHandle,
} from "../composite/modal/Modal";

export type ButtonModalHandle = ModalHandle;
type ButtonModalProps = ComponentProps<typeof ModalProvider>;

const ButtonModal = forwardRef<ButtonModalHandle, ButtonModalProps>(
  function ButtonModal({ children, ...props }, ref) {
    return (
      <ModalProvider ref={ref} {...props}>
        {children}
      </ModalProvider>
    );
  },
);

ButtonModal.displayName = "ButtonModal";

const ButtonModalComposer = Object.assign(ButtonModal, {
  Content: Modal.Content,
  Reference: Modal.Reference,
  Trigger: Modal.Trigger,
});

export default ButtonModalComposer;
