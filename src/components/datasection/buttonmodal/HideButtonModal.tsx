import Button from "@/components/button/Button";
import ButtonModal from "@/components/ButtonModal";
import { ColumnToolMenu } from "../ColumnToolMenu";
import type { ColumnToolButtonModalProps } from "./type";

export default function HideButtonModal<TItem>({
  open,
  onOpenChange,
  disabled,
  table,
  tableConfig,
}: ColumnToolButtonModalProps<TItem>) {
  return (
    <ButtonModal open={open} onOpenChange={onOpenChange}>
      <ButtonModal.Trigger>
        <Button
          icon="unvisible"
          label="Ocultar"
          intent="darkInk"
          appearance="text"
          size="md"
          disabled={disabled}
        />
      </ButtonModal.Trigger>
      <ButtonModal.Content>
        {table && tableConfig ? (
          <ColumnToolMenu
            columns={table.getAllLeafColumns()}
            config={tableConfig}
            onChoice={(column) =>
              column.toggleVisibility(!column.getIsVisible())
            }
            value={(column) => column.getIsVisible()}
            visibleIcon="visible"
            hiddenIcon="unvisible"
          />
        ) : (
          <div />
        )}
      </ButtonModal.Content>
    </ButtonModal>
  );
}
