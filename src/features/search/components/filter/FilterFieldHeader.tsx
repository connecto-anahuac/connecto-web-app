import IconWithText from "@/components/IconWithText";
import SelectBoxUnfill from "@/components/select-box/SelectBoxUnfill";
import type { ReactNode } from "react";
import { FilterDefinition, Operator } from "../../shared/filter-definition";
import { getOperatorLabel } from "../../shared/operator-policy";

type Props<TItem> = {
  filter: FilterDefinition<TItem>;
  icon?: ReactNode;
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
  return (
    <div className="flex items-center gap-1 text-OnSurface">
      {icon ? (
        <IconWithText label={filter.label} icon={icon} />
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
