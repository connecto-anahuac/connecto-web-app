
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type SelectOption<TValue extends string = string> = {
	label: string;
	value: TValue;
};

type UseSelectBoxParams<TValue extends string = string> = {
	isMulti?: boolean;
	options: SelectOption<TValue>[];
	defaultValue?: TValue | TValue[] | null;
};

type UseSelectBoxResult = {
	isOpen: boolean;
	hoveredIndex: number;
	selectedValues: string[];
	selectedLabel: string;
	openMenu: () => void;
	closeMenu: () => void;
	toggleMenu: () => void;
	setHoveredIndex: (index: number) => void;
	isSelected: (value: string) => boolean;
	selectValue: (value: string) => void;
	containerRef: React.RefObject<HTMLDivElement | null>;
};

function normalizeDefaultValues<TValue extends string = string>(
	defaultValue: UseSelectBoxParams<TValue>["defaultValue"],
): string[] {
	if (Array.isArray(defaultValue)) {
		return defaultValue.map(String);
	}

	if (defaultValue === null || defaultValue === undefined || defaultValue === "") {
		return [];
	}

	return [String(defaultValue)];
}

export function useSelectBox<TValue extends string = string>({
	isMulti = false,
	options,
	defaultValue,
}: UseSelectBoxParams<TValue>): UseSelectBoxResult {
	const normalizedDefaultValues = useMemo(() => normalizeDefaultValues(defaultValue), [defaultValue]);
	const containerRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [hoveredIndex, setHoveredIndex] = useState(0);
	const [selectedValues, setSelectedValues] = useState<string[]>(normalizedDefaultValues);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const handlePointerDown = (event: MouseEvent) => {
			if (!containerRef.current?.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handlePointerDown);

		return () => {
			document.removeEventListener("mousedown", handlePointerDown);
		};
	}, [isOpen]);

    //selectedValuesの表示用String
    const selectedLabel = useMemo(() => {
        console.log("selectedValues", selectedValues);
		if (selectedValues.length === 0) {
			return "";
		}

		return options
			.filter((option) => selectedValues.includes(String(option.value)))
			.map((option) => option.label)
			.join(", ");
	}, [options, selectedValues]);

	const openMenu = () => {
		if (options.length === 0) {
			setIsOpen(true);
			setHoveredIndex(0);
			return;
		}

		if (isMulti) {
			setHoveredIndex(0);
		} else {
			const selectedIndex = options.findIndex((option) => selectedValues.includes(String(option.value)));
			setHoveredIndex(selectedIndex >= 0 ? selectedIndex : 0);
		}

		setIsOpen(true);
	};

	const closeMenu = () => {
		setIsOpen(false);
	};

	const toggleMenu = () => {
		if (isOpen) {
			closeMenu();
			return;
		}

		openMenu();
	};

	const isSelected = (value: string) => selectedValues.includes(value);

	const selectValue = (value: string) => {
		setSelectedValues((currentValues) => {
			if (!isMulti) {
				return [value];
			}

			if (currentValues.includes(value)) {
				return currentValues.filter((currentValue) => currentValue !== value);
			}

			return [...currentValues, value];
		});

		if (!isMulti) {
			closeMenu();
		}
	};

	return {
		isOpen,
		hoveredIndex,
		selectedValues,
		selectedLabel,
		openMenu,
		closeMenu,
		toggleMenu,
		setHoveredIndex,
		isSelected,
		selectValue,
		containerRef,
	};
}
