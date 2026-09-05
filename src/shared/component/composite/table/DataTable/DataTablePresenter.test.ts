import { describe, expect, it } from "vitest";
import type { DataViewConfig } from "@/shared/types/dataView.types";
import { getFormattedCellTitle } from "./DataTablePresenter";

type Row = { name: string };

const config: DataViewConfig<Row, "name"> = {
  fields: [
    {
      fieldId: "name",
      label: "Name",
      icon: "person",
      valueType: "text",
      accessor: (row) => row.name,
      format: (row) => `Student: ${row.name}`,
    },
  ],
};

describe("getFormattedCellTitle", () => {
  it("uses the configured text formatter rather than an accessor value", () => {
    expect(getFormattedCellTitle(config, "name", { name: "Ada" })).toBe(
      "Student: Ada",
    );
  });
});
