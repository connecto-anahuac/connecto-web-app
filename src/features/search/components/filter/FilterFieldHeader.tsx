import IconWithText from "@/components/IconWithText";
import SelectBoxUnfill from "@/components/select-box/SelectBoxUnfill";
import type { ReactNode } from "react";
import { FilterDefinition, Operator } from "../../shared/filter-definition";
import { getOperatorLabel } from "../../shared/operator-policy";
import { IconName, Icons } from "@/components/icon";
import { cn } from "@/shared/lib/util";

type Props<TItem> = {
  filter: FilterDefinition<TItem>;
  icon?: IconName;
  operator: Operator;
  onOperatorChange: (operator: Operator) => void;
};

/**
 * フィルターカードのヘッダー: カラム名(+アイコン) と operator セレクター。
 * operator のラベルは valueType に応じて記号/テキストを出し分ける。
 */
export function FilterFieldHeader<TItem>({
  filter,
  icon,
  operator,
  onOperatorChange,
}: Props<TItem>) {
  const IconComponent = icon && Icons[icon];
  return (
    <div className="flex items-center gap-1 text-OnSurface">
      {IconComponent ? (
        <div
          className={cn(
            "inline-flex w-fit shrink-0 items-center whitespace-nowrap rounded-sm transition-colors",
            "h-fit gap-1 pl-1 pr-2 py-1 text-sm font-medium leading-none",
            "bg-transparent text-connecto-muted",
          )}
        >
          <span className="flex size-4 items-center justify-center ">
            <IconComponent className="size-full" />
          </span>
          <span>{filter.label}</span>
        </div>
      ) : (
        <span className="text-xs leading-none font-medium text-OnSurfaceVariant">
          {filter.label}
        </span>
      )}

      <SelectBoxUnfill
        className="text-sm"
        defaultValue={operator}
        isMulti={false}
        options={filter.operators.map((op) => ({
          label: getOperatorLabel(filter.valueType, op),
          value: op,
        }))}
        onValueChange={(values) => {
          const next = values[0] as Operator | undefined;
          if (next) {
            onOperatorChange(next);
          }
        }}
      />
    </div>
  );
}
