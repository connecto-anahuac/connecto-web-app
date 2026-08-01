import { Icons } from "@/components/icon";
import SelectBoxUnfill from "@/components/select-box/SelectBoxUnfill";
import type { DataViewColumn } from "@/components/table/dataView.types";
import { cn } from "@/shared/lib/util";
import {
  getOperatorLabel,
  getOperatorsForValueType,
  type Operator,
} from "../../shared/operatorPolicy";

type Props<TItem> = {
  column: DataViewColumn<TItem>;
  operator: Operator;
  onOperatorChange: (operator: Operator) => void;
};

export function FilterFieldHeader<TItem>({
  column,
  operator,
  onOperatorChange,
}: Props<TItem>) {
  const IconComponent = Icons[column.icon];

  return (
    <div className="flex items-center gap-1 text-OnSurface">
      <div
        className={cn(
          "inline-flex w-fit shrink-0 items-center whitespace-nowrap rounded-sm transition-colors",
          "h-fit gap-1 pl-1 pr-2 py-1 text-sm font-medium leading-none",
          "bg-transparent text-connecto-muted",
        )}
      >
        <span className="flex size-4 items-center justify-center">
          <IconComponent className="size-full" />
        </span>
        <span>{column.label}</span>
      </div>

      <SelectBoxUnfill
        className="text-sm"
        defaultValue={operator}
        isMulti={false}
        options={getOperatorsForValueType(column.valueType).map((candidate) => ({
          label: getOperatorLabel(column.valueType, candidate),
          value: candidate,
        }))}
        onValueChange={(values) => {
          const next = values[0] as Operator | undefined;
          if (next) onOperatorChange(next);
        }}
      />
    </div>
  );
}
