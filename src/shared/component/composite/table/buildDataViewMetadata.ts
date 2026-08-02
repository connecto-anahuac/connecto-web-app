import type {
  DataFieldConfig,
  DataViewConfig,
  DataViewMetadata,
  DataFieldOption,
} from "./dataView.types";

function addDynamicOption(
  options: Map<string, DataFieldOption>,
  option: DataFieldOption,
) {
  const current = options.get(option.value);
  if (!current) {
    options.set(option.value, option);
    return;
  }

  options.set(option.value, {
    ...current,
    searchTexts: [
      ...new Set([...current.searchTexts, ...option.searchTexts]),
    ],
  });
}

function buildDataFieldOptions<TItem>(
  column: DataFieldConfig<TItem>,
  items: readonly TItem[],
): readonly DataFieldOption[] {
  if (column.options !== undefined) {
    //TODO staticoption accessor, format使いたい
    return column.options.map((option) => ({
      ...option,
      searchTexts: [option.label, option.value],
    }));
  }

  if (!column.dynamicOption) return [];

  const options = new Map<string, DataFieldOption>();
  for (const item of items) {
    const rawValue = column.accessor(item);
    if (rawValue === null) continue;

    addDynamicOption(options, {
      value: String(rawValue),
      label: column.format(item),
      searchTexts: column.searchTexts?.(item) ?? [],
    });
  }

  return [...options.values()];
}

/**  現状、オプションの動的生成のみ
 *   static optionもまとめてここに入れられる
 */
export function buildDataViewMetadata<TItem>(
  config: DataViewConfig<TItem>,
  items: readonly TItem[],
): DataViewMetadata {
  return {
    optionsByFieldId: Object.fromEntries(
      config.fields.map((column) => [
        column.fieldId,
        buildDataFieldOptions(column, items),
      ]),
    ),
  };
}

export function getDataViewColumnSearchTexts<TItem>(
  column: DataFieldConfig<TItem>,
  metadata: DataViewMetadata,
  item: TItem,
): readonly string[] {
  const rawValue = column.accessor(item);
  const option = metadata.optionsByFieldId[column.fieldId]?.find(
    (candidate) => candidate.value === String(rawValue),
  );

  //TODO default -> rawvalue, if searchtets exists, remove rawvalue,label

  return [
    rawValue === null ? "" : String(rawValue),
    option?.label ?? column.format(item),
    ...(option?.searchTexts ?? column.searchTexts?.(item) ?? []),
  ];
}

export function runFilterDataFieldOptions(
  options: readonly DataFieldOption[],
  query: string,
): readonly DataFieldOption[] {
  const normalizedQuery = query.toLocaleLowerCase();
  return options.filter((option) =>
    [option.value, option.label, ...option.searchTexts].some((text) =>
      text.toLocaleLowerCase().includes(normalizedQuery),
    ),
  );
}
