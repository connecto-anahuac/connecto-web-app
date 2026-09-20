"use client";

import CourseKey from "@/shared/component/primitive/CourseKey";
import PersonIcon from "@/shared/component/primitive/icon/PersonIcon";
import type { OfferingCourse } from "@/features/offeringCourse/types/offering-course";
import { getTotalEligibleStudents } from "@/features/offeringCourse/lib/get-total-eligible-students";
import { cn } from "@/shared/lib/util";
import { ComponentProps, KeyboardEvent, MouseEvent } from "react";
import { Icons } from "@/shared/component/primitive/icon";

type Props = ComponentProps<"div"> & {
  offeringClass: OfferingCourse;
  /** Store-derived total. Falls back to the lightweight-list estimate. */
  estimatedNumber?: number;
  sessionNumber?: number;
  /** Whether this card is the course currently displayed in the panel. */
  isActive: boolean;
  /** Whether this course has already been offered. */
  isOffered: boolean;
  isPending?: boolean;
  onOffer: () => void;
  onOpen: () => void;
  /** Persists a changed session count for an already offered course. */
  onSessionCountChange?: (sessionNumber: number) => void;
  onUnoffer: () => void;
};

export default function OfferingClassCardView({
  offeringClass,
  estimatedNumber,
  sessionNumber: sessionNumberProp,
  isActive,
  isOffered,
  isPending = false,
  onOffer,
  onOpen,
  onSessionCountChange,
  onUnoffer,
  className,
  onClick,
  onKeyDown,
  style,
  ...props
}: Props) {
  const totalEligibleStudents =
    estimatedNumber ??
    ("estimatedNumber" in offeringClass &&
    typeof offeringClass.estimatedNumber === "number"
      ? offeringClass.estimatedNumber
      : getTotalEligibleStudents(offeringClass));
  const sessionNumber =
    sessionNumberProp ??
    ("sessionNumber" in offeringClass &&
    typeof offeringClass.sessionNumber === "number"
      ? offeringClass.sessionNumber
      : 1);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    onClick?.(event);

    if (!event.defaultPrevented && !isPending) {
      onOpen();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);

    if (
      event.defaultPrevented ||
      event.target !== event.currentTarget ||
      isPending
    ) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen();
    }
  };

  const handleOffer = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!isPending) {
      onOffer();
    }
  };

  const handleSessionChange = (
    event: MouseEvent<HTMLButtonElement>,
    nextSessionNumber: number,
  ) => {
    event.stopPropagation();
    if (isPending) return;
    if (nextSessionNumber === 0) {
      onUnoffer();
      return;
    }
    onSessionCountChange?.(nextSessionNumber);
  };

  return (
    <div
      className={cn(
        "relative flex w-64 cursor-pointer flex-col gap-2 rounded-lg bg-[#d6d6d6] p-3 text-OnSurface shadow-sm transition-shadow",
        // isSelected && "ring-2 ring-InverseSurface ring-offset-2 ring-offset-transparent",
        "border-3 border-transparent",
        // clickされたら以下の変化
        isActive && "border-3 border-Primary/50 shadow-md",
        !isActive && "hover:border-Primary/20 hover:shadow-md",
        isPending && "pointer-events-none opacity-70",
        className,
      )}
      {...props}
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      aria-disabled={isPending}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{
        ...style,
        backgroundColor: `var(--${offeringClass.keyCode}-light)`,
      }}
    >
      <div className="flex items-center gap-2">
        <CourseKey
          code={offeringClass.keyCode}
          number={offeringClass.keyNumber}
          className="text-white"
        />
        <div className="ml-auto flex items-center gap-1 text-sm">
          <PersonIcon className="h-4.5 w-4.5" />
          {totalEligibleStudents}
        </div>
      </div>

      <div className="flex h-8 w-full wrap-break-word items-center justify-start text-sm font-medium">
        <span className="w-full line-clamp-2">{offeringClass.name}</span>
      </div>

      {isOffered ? (
        <>
          <div className="flex h-5  items-center gap-1">
            <button
              aria-label="Decrease sessions"
              className="grid h-full w-7.75 place-items-center rounded bg-Primary text-OnPrimary"
              disabled={isPending}
              onClick={(event) =>
                handleSessionChange(event, Math.max(0, sessionNumber - 1))
              }
              type="button"
            >
              <Icons.minus className="size-4" />
            </button>
            <output
              aria-label={`${sessionNumber} sessions`}
              className="grid bg-white/65  h-full w-14 place-items-center rounded border border-OnSurface text-xs font-medium flex-1"
            >
              {sessionNumber}
            </output>

            <button
              aria-label="Increase sessions"
              className="grid h-full w-7.75 place-items-center rounded bg-Primary text-OnPrimary"
              disabled={isPending}
              onClick={(event) => handleSessionChange(event, sessionNumber + 1)}
              type="button"
            >
              <Icons.plus className="size-4" />
            </button>
          </div>
          {/* <div
            aria-label="Course sessions"
            className="flex h-7 w-full items-center justify-between gap-1 rounded-sm bg-InverseSurface p-1 text-xs font-medium text-InverseOnSurface"
          >
            <button
              aria-label="Decrease course sessions"
              className="grid size-5 place-items-center rounded hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-Primary"
              disabled={isPending}
              onClick={(event) =>
                handleSessionChange(event, Math.max(0, sessionNumber - 1))
              }
              type="button"
            >
              −
            </button>
            <output aria-label={`${sessionNumber} sessions`}>
              {sessionNumber}
            </output>
            <button
              aria-label="Increase course sessions"
              className="grid size-5 place-items-center rounded hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-Primary"
              disabled={isPending}
              onClick={(event) => handleSessionChange(event, sessionNumber + 1)}
              type="button"
            >
              +
            </button>
          </div> */}
        </>
      ) : (
        <button
          type="button"
          className="h-fit w-full cursor-pointer rounded-sm bg-InverseSurface p-1.5 text-xs font-medium text-InverseOnSurface disabled:opacity-70"
          disabled={isPending}
          onClick={handleOffer}
        >
          ofertar
        </button>
      )}
    </div>
  );
}
