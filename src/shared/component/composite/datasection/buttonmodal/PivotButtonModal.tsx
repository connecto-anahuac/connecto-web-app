import Button from "@/shared/component/primitive/button/Button";
import ButtonModal from "@/shared/component/primitive/ButtonModal";
import { ColumnToolMenu } from "../ColumnToolMenu";
import type { ColumnToolButtonModalProps } from "./type";

export default function PivotButtonModal<TItem>({
  open,
  onOpenChange,
  disabled,
  table,
  tableConfig,
  hasBadge,
}: ColumnToolButtonModalProps<TItem>) {
  return (
    <ButtonModal open={open} onOpenChange={onOpenChange}>
      <ButtonModal.Trigger>
        <Button
          icon="pin"
          label="Pivot"
          intent="darkInk"
          appearance="text"
          size="md"
          disabled={disabled}
          hasBadge={hasBadge}
        />
      </ButtonModal.Trigger>
      <ButtonModal.Content>
     
          {table && tableConfig ? (
            <ColumnToolMenu
              columns={table.getAllLeafColumns()}
              config={tableConfig}
              onChoice={(column) =>
                column.pin(column.getIsPinned() === "left" ? false : "left")
              }
              value={(column) => column.getIsPinned() === "left"}
              visibleIcon="pin"
              hiddenIcon="unpin"
            />
          ) : <div/>}
      
      </ButtonModal.Content>
    </ButtonModal>
  );
}
