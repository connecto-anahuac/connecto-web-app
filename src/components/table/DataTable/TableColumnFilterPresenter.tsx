import { Icons } from "@/components/icon";
import type { TableColumnFilterPresenterProps } from "./DataTable.types";


//TODO filtermodal
export function TableColumnFilterPresenter<TItem>({
  column,
  config,
  currentValue,
  onClear,
  onEnumValueToggle,
  onInputChange,
  ...props
}: TableColumnFilterPresenterProps<TItem>) {
  if (config.valueType === "enum") {
    const values = Array.isArray(currentValue?.value) ? currentValue.value : [];
    return (
      <div className="min-w-52 rounded-md border border-Outline bg-InverseSurface p-1 text-InverseOnSurface shadow-lg" {...props}>
        <p className="px-2 py-1 text-xs font-semibold">{config.label}</p>
        {(config.options ?? []).map((option) => {
          const selected = values.includes(option.value);
          const Icon = selected ? Icons.visible : Icons.unvisible;
          return (
            <button
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-Primary hover:text-OnPrimary"
              key={option.value}
              onClick={() => onEnumValueToggle(option.value)}
              type="button"
            >
              <Icon className="size-4" />
              {option.label}
            </button>
          );
        })}
        <button
          className="mt-1 w-full rounded-sm px-2 py-1 text-left text-xs hover:bg-Primary hover:text-OnPrimary"
          onClick={onClear}
          type="button"
        >
          Limpiar
        </button>
      </div>
    );
  }

  return (
    <div className="min-w-52 rounded-md border border-Outline bg-InverseSurface p-2 text-InverseOnSurface shadow-lg"
    {...props}>
      <label
        className="mb-1 block text-xs font-semibold"
        htmlFor={`filter-${column.id}`}
      >
        {config.label}
      </label>
      <input
        className="h-8 w-full rounded-sm border border-Outline bg-Surface px-2 text-sm text-OnSurface outline-none focus:ring-1 focus:ring-Primary"
        id={`filter-${column.id}`}
        onChange={(event) => onInputChange(event.target.value)}
        type={config.valueType === "number" ? "number" : "search"}
        value={
          typeof currentValue?.value === "string" ||
          typeof currentValue?.value === "number"
            ? currentValue.value
            : ""
        }
      />
      <button
        className="mt-2 w-full rounded-sm px-2 py-1 text-left text-xs hover:bg-Primary hover:text-OnPrimary"
        onClick={onClear}
        type="button"
      >
        Limpiar
      </button>
    </div>
  );
}
