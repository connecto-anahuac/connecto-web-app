
export const operators = ["equals", "contains", "moreThan", "lessThan", "orMore", "andLess", "in", "between"] as const;
export type Operator = (typeof operators)[number];

export const editor = ["text" , "number" , "select" , "multiSelect" , "date"] as const;
export type Editor = (typeof editor)[number];


const inputTypes = ["free", "option"] as const;
type InputType = (typeof inputTypes)[number];


type BaseFilterDefinition<T> = {
  key: string;
  label: string;

  editor: Editor;
  operators: Operator[];
};

// =============================

type FreeFilterDefinition<T> = BaseFilterDefinition<T> & {
  inputType: "free";

  parse: (value: string) => T;
};

type OptionFilterDefinition<T> = BaseFilterDefinition<T> & {
  inputType: "option";

  options: {
    label: string;
    value: T;
  }[];
};

export type FilterDefinition<T = unknown> =
  | FreeFilterDefinition<T>
  | OptionFilterDefinition<T>;

export type FilterValue =
  | string
  | number
  | boolean
  | Date
  | string[]
  | number[]
  | null;

export type FilterState = Record<string, FilterValue>;
