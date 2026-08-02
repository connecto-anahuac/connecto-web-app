import { describe, expect, it } from "vitest";
import type { DataViewConfig } from "../../../types/dataView.types";
import {
  buildDataViewMetadata,
  runFilterDataFieldOptions,
} from "./buildDataViewMetadata";

type Row = {
  period: { raw: string; label: string } | null;
};

const rows: Row[] = [
  { period: { raw: "2025-1", label: "Primavera 2025" } },
  { period: { raw: "2025-1", label: "Primavera 2025" } },
  { period: { raw: "2025-2", label: "Otoño 2025" } },
  { period: null },
];

function createConfig(
  overrides: Partial<DataViewConfig<Row>["fields"][number]> = {},
): DataViewConfig<Row> {
  return {
    fields: [
      {
        fieldId: "period",
        label: "Periodo",
        icon: "schedule",
        valueType: "enum",
        accessor: (item) => item.period?.raw ?? null,
        format: (item) => item.period?.label ?? "",
        searchTexts: (item) =>
          item.period ? [item.period.label, item.period.raw] : [],
        dynamicOption: true,
        ...overrides,
      },
    ],
  };
}

describe("buildDataViewMetadata", () => {
  it("builds dynamic options from accessor, format, and searchTexts", () => {
    const metadata = buildDataViewMetadata(createConfig(), rows);

    expect(metadata.optionsByFieldId.period).toEqual([
      {
        value: "2025-1",
        label: "Primavera 2025",
        searchTexts: ["Primavera 2025", "2025-1"],
      },
      {
        value: "2025-2",
        label: "Otoño 2025",
        searchTexts: ["Otoño 2025", "2025-2"],
      },
    ]);
  });

  it("uses static options without generating dynamic options", () => {
    const metadata = buildDataViewMetadata(
      createConfig({
        options: [{ label: "Periodo fijo", value: "fixed" }],
      }),
      rows,
    );

    expect(metadata.optionsByFieldId.period).toEqual([
      {
        label: "Periodo fijo",
        value: "fixed",
        searchTexts: ["Periodo fijo", "fixed"],
      },
    ]);
  });

  it("treats an empty static option list as an explicit override", () => {
    const metadata = buildDataViewMetadata(createConfig({ options: [] }), rows);

    expect(metadata.optionsByFieldId.period).toEqual([]);
  });

  it("searches options by value, label, and searchTexts", () => {
    const options = buildDataViewMetadata(createConfig(), rows)
      .optionsByFieldId.period!;

    expect(runFilterDataFieldOptions(options, "2025-1")).toHaveLength(1);
    expect(runFilterDataFieldOptions(options, "Primavera")).toHaveLength(1);
  });
});
