import { cn } from "@/shared/lib/util";

type Props = { className?: string };
export default function Filter({ className }: Props) {
  return (
    <div
      className={cn(
        "bg-header rounded-sm   flex gap-0 py-0.5 px-2 items-center ",
        className,
      )}
    >
      <FilterIcon />
      <span className={cn("text-xs font-semibold")}>filter</span>
    </div>
  );
}

const FilterIcon = () => {
  // w-23px p-7.7px
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 23 23"
      fill="none"
    >
        <path
          d="M10.5386 19.1666C10.2671 19.1666 10.0395 19.0747 9.8558 18.8911C9.67212 18.7074 9.58028 18.4798 9.58028 18.2083V12.4583L4.02194 5.36659C3.78236 5.04714 3.74642 4.71172 3.91413 4.36034C4.08184 4.00895 4.37333 3.83325 4.78861 3.83325H18.2053C18.6206 3.83325 18.912 4.00895 19.0798 4.36034C19.2475 4.71172 19.2115 5.04714 18.9719 5.36659L13.4136 12.4583V18.2083C13.4136 18.4798 13.3218 18.7074 13.1381 18.8911C12.9544 19.0747 12.7268 19.1666 12.4553 19.1666H10.5386Z"
          fill="currentColor"
        />
    </svg>
  );
};
