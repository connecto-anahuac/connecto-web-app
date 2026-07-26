"use client";

import { useCallback, useMemo } from "react";
import { useFilterStoreProvider } from "@/features/search/components/Provider/useFilterStore";
import type { FilterPreset, FilterPresetConfig } from "./filterPreset.type";
import {
  getFilterPresetNextCondition,
  isFilterPresetSelected,
} from "./filterPreset.type";

/**
 * Converts declarative preset configurations into controlled chip props backed
 * by the current FilterProvider store.
 */
export function useBindingFilterPresets<TFilterKey extends string>(
  presetConfigs: readonly FilterPresetConfig<TFilterKey>[],
): FilterPreset[] {
  const conditions = useFilterStoreProvider((state) => state.conditions);
  const upsertCondition = useFilterStoreProvider((state) => state.upsertCondition);
  const removeCondition = useFilterStoreProvider((state) => state.removeCondition);

  const togglePreset = useCallback(
    (preset: FilterPresetConfig<TFilterKey>) => {
      const nextCondition = getFilterPresetNextCondition(preset, conditions);
      if (!nextCondition) {
        removeCondition(preset.filterKey);
        return;
      }

      upsertCondition(nextCondition);
    },
    [conditions, removeCondition, upsertCondition],
  );

  return useMemo(
    () =>
      presetConfigs.map((preset) => ({
        label: preset.label,
        isSelected: isFilterPresetSelected(preset, conditions),
        onToggle: () => togglePreset(preset),
      })),
    [conditions, presetConfigs, togglePreset],
  );
}
