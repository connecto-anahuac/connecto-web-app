"use client";

import { useEffect, useRef, type ComponentProps } from "react";
import type { VirtualElement } from "@floating-ui/react";

import Modal, {
  ModalProvider,
  type ModalHandle,
} from "@/shared/component/composite/modal/Modal";
import { cn } from "@/shared/lib/util";

export type ScheduleCardContextMenuProps = Omit<ComponentProps<"section">, "onDelete"> & {
  anchor: Element | VirtualElement;
  open: boolean;
  onDelete: () => void;
  onOpenChange: (open: boolean) => void;
};

/** Controlled display-only menu for a scheduled occurrence. */
export function ScheduleCardContextMenu({
  anchor,
  className,
  onDelete,
  onOpenChange,
  open,
  ...props
}: ScheduleCardContextMenuProps) {
  const modalRef = useRef<ModalHandle>(null);

  useEffect(() => {
    if (open) modalRef.current?.open(anchor);
  }, [anchor, open]);

  return (
    <ModalProvider
      open={open}
      onOpenChange={onOpenChange}
      placement="right-start"
      ref={modalRef}
    >
      <Modal.Content>
        <section
          aria-label="Opciones de la clase"
          className={cn(
            "w-52 rounded-md border border-DividerMiddle bg-SurfaceContainerLowest p-1 shadow-lg",
            className,
          )}
          {...props}
        >
          <button
            className="w-full rounded-sm px-3 py-2 text-left text-sm text-Error hover:bg-DividerLowest focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-Primary"
            onClick={onDelete}
            type="button"
          >
            Eliminar del horario
          </button>
        </section>
      </Modal.Content>
    </ModalProvider>
  );
}

export default ScheduleCardContextMenu;
