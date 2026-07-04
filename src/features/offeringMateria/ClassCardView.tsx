"use client";

import { cn } from "@/lib/util";
import { ComponentProps, KeyboardEvent, MouseEvent, useState } from "react";
import PersonIcon from "@/components/icon/PersonIcon";
import CourseKey from "@/components/CourseKey";
import { OfferingMaterial } from "./entity";
import { getTotalEligibleStudents } from "./get_total_eligible_students";

type Props = ComponentProps<"div"> & {
  offeringClass: OfferingMaterial;
  isSelected: boolean;
  isPending?: boolean;
  onToggle: () => void;
};

export default function OfferingClassCardView({
  offeringClass,
  isSelected,
  isPending = false,
  onToggle,
  className,
  onClick,
  onKeyDown,
  style,
  ...props
}: Props) {
  const totalEligibleStudents = getTotalEligibleStudents(offeringClass);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    onClick?.(event);

    if (event.defaultPrevented || isPending) {
      return;
    }

    onToggle();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);

    if (event.defaultPrevented || event.target !== event.currentTarget || isPending) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle();
    }
  };

  return (
    <div
      className={cn(
        "relative flex w-64 cursor-pointer flex-col gap-2 rounded-lg bg-[#d6d6d6] p-3 text-OnSurface shadow-sm transition-shadow",
        isSelected && "ring-2 ring-InverseSurface ring-offset-2 ring-offset-transparent",
        isPending && "pointer-events-none opacity-70",
        className,
      )}
      {...props}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-disabled={isPending}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{ ...style, backgroundColor: `var(--${offeringClass.keyCode}-light)` }}
    >
      <div className="flex items-center gap-2">
        <CourseKey code={offeringClass.keyCode} number={offeringClass.keyNumber} />
        {/* <CourseValues
          className="ml-auto"
          leftValue={offeringClass.credits.toString()}
          rightValue={offeringClass.hours.toString()}
        /> */}
        <div className="ml-auto flex items-center gap-1 text-sm">
          <PersonIcon className="w-4.5 h-4.5 " />
          {totalEligibleStudents}
        </div>
      </div>

      <div className="h-8 text-sm font-medium w-full wrap-break-word flex items-center justify-start">
        <span className="w-full line-clamp-2 ">{offeringClass.name}</span>
      </div>
      {/* <div className="bg-divider h-px w-full"></div> */}
      {isSelected ? (
        <SessionCounter initialValue={1} disabled={isPending} />
      ) : (
        <button
          type="button"
          className="h-fit w-full rounded-sm bg-InverseSurface p-1.5 text-xs font-medium text-InverseOnSurface"
        >
          ofertar
        </button>
      )}
    </div>
  );
}


type SessionCounterProps = {
  initialValue?: number;
  disabled?: boolean;
};

function SessionCounter({ initialValue = 1, disabled = false }: SessionCounterProps) {
  const [value, setValue] = useState(initialValue);

  const handleDecrease = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setValue((currentValue) => Math.max(0, currentValue - 1));
  };

  const handleIncrease = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setValue((currentValue) => currentValue + 1);
  };

  return (
    <div className="mt-auto flex items-center gap-1">
      <button
        type="button"
        aria-label="Decrease sessions"
        disabled={disabled}
        className="h-23px w-8 rounded-sm bg-InverseSurface text-base leading-none font-medium text-InverseOnSurface"
        onClick={handleDecrease}
      >
        -
      </button>

      <div className="h-23px flex flex-1 items-center justify-center rounded-sm border border-InverseSurface px-2 text-center text-xs font-medium text-OnSurface">
        {value}
      </div>

      <button
        type="button"
        aria-label="Increase sessions"
        disabled={disabled}
        className="h-23px w-8 rounded-sm bg-InverseSurface text-base leading-none font-medium text-InverseOnSurface"
        onClick={handleIncrease}
      >
        +
      </button>
    </div>
  );
}