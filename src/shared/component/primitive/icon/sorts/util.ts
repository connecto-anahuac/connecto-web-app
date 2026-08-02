import { IconName } from "..";

export function getSortIcon(
  sort: "asc" | "desc" ,
  type: string | "number",
):IconName {
  if (type === "number") {
    return sort === "asc"
      ? ("numberAscending" as const)
      : ("numberDescending" as const);
  }
  return sort === "asc"
    ? ("textAscending" as const)
    : ("textDescending" as const);
}