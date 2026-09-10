"use client";

type Props = { period?: string; resolvedPeriod?: string; onChange: (period: string) => void };

export function PeriodControl({ period, resolvedPeriod, onChange }: Props) {
  return (
    <form className="mb-3 flex items-end gap-2" onSubmit={(event) => {
      event.preventDefault();
      const value = new FormData(event.currentTarget).get("period");
      onChange(typeof value === "string" ? value.trim() : "");
    }}>
      <label className="flex flex-col gap-1 text-xs text-OnSurfaceVariant">
        Periodo
        <input aria-label="Periodo" className="rounded-md border border-DividerMiddle bg-SurfaceContainerLowest px-3 py-2 text-sm text-OnSurface" defaultValue={period ?? ""} key={period} name="period" placeholder={resolvedPeriod ?? "Más reciente"} />
      </label>
      <button className="rounded-md bg-Primary px-3 py-2 text-sm text-OnPrimary" type="submit">Aplicar</button>
    </form>
  );
}
