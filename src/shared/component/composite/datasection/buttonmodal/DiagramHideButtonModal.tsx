import Button from "@/shared/component/primitive/button/Button";
import ButtonModal from "@/shared/component/primitive/ButtonModal";
import { Icons } from "@/shared/component/primitive/icon";

export type DiagramHideItem = {
  id: string;
  label: string;
};

type Props = {
  open: boolean;
  onOpenChange: () => void;
  items: readonly DiagramHideItem[];
  hiddenItemIds: ReadonlySet<string>;
  onItemToggle: (id: string) => void;
};

export default function DiagramHideButtonModal({
  open,
  onOpenChange,
  items,
  hiddenItemIds,
  onItemToggle,
}: Props) {
  return (
    <ButtonModal open={open} onOpenChange={onOpenChange}>
      <ButtonModal.Trigger>
        <Button
          icon="unvisible"
          label="Ocultar"
          intent="darkInk"
          appearance="text"
          size="md"
          disabled={items.length === 0}
          hasBadge={hiddenItemIds.size > 0}
        />
      </ButtonModal.Trigger>
      <ButtonModal.Content>
        <div className="flex min-w-56 flex-col rounded-md border border-Outline  p-1 bg-Surface  text-OnSurface shadow-lg">
          {items.map((item) => {
            const Icon = hiddenItemIds.has(item.id)
              ? Icons.unvisible
              : Icons.visible;

            return (
              <button
                className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-Primary hover:text-OnPrimary"
                key={item.id}
                onClick={() => onItemToggle(item.id)}
                type="button"
              >
                <Icon className="size-4" /> {item.label}
              </button>
            );
          })}
        </div>
      </ButtonModal.Content>
    </ButtonModal>
  );
}
