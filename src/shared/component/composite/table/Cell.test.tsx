import { describe, expect, it } from "vitest";
import Cell from "./Cell";

describe("Cell", () => {
  it("accepts block-level renderer content without a span wrapper", () => {
    const result = Cell({ children: <div>Rich cell</div> });

    expect(result.type).toBe("div");
    expect(result.props.children.type).toBe("div");
  });
});
