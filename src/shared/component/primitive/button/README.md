# floatingUI

open, onOpenChange,をuseFloatingに渡せば、開閉と外クリックでの閉じる動作が実装できる。
ただし、refとPropsをボタンに、refをモーダルに渡す必要がある。


```ts
"use client";
import {
  autoUpdate,flip,offset,shift,useClick,useDismiss,useFloating,useInteractions,
} from "@floating-ui/react";

export default function FilterButton<TItem>({open,onOpenChange,...props}: ButtonProps<TItem>) {

  const { refs, floatingStyles, context } = useFloating({
    open:open, //自前open
    onOpenChange:onOpenChange,//自前onOpenChange
    placement: "bottom-start",
    whileElementsMounted: autoUpdate,
    middleware: [offset(12), flip(), shift({ padding: 8 })],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context); //when click outside of the modal, it will be closed

  const { getReferenceProps } = useInteractions([
    click,
    dismiss,
  ]);

  return (
    <>
      <Button
        ref={refs.setReference}
        aria-pressed={open}
        {...getReferenceProps()}
      />

      {open && (
        <FilterRenderer
          ref={refs.setFloating}
          style={{
            ...floatingStyles,
            zIndex: 9999,
          }}
        />
      )}
    </>
  );
}

```
