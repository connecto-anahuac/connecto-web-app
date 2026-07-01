import type { ContactAction } from "@/features/home/types";

export function SidebarUserIcon({ active = false }: { active?: boolean }) {
  return (
    <span className={active ? "text-white" : "text-white/70"}>
      <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
        <path
          d="M4 19.5A3.5 3.5 0 0 1 7.5 16H16.5A3.5 3.5 0 0 1 20 19.5V20H4V19.5ZM12 13A4.5 4.5 0 1 0 12 4A4.5 4.5 0 0 0 12 13Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

export function SidebarToggleIcon() {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" fill="none">
      <path d="M7 6L13 12L7 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 6L17 12L11 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg aria-hidden="true" className="size-6 text-connecto-muted" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="6.25" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16L20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function FilterIcon() {
  return (
    <svg aria-hidden="true" className="size-6 text-connecto-muted" viewBox="0 0 24 24" fill="none">
      <path d="M4 6H20L14 13V18L10 20V13L4 6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export function SortIcon() {
  return (
    <svg aria-hidden="true" className="size-8 text-connecto-ink" viewBox="0 0 24 24" fill="none">
      <path d="M8 6H18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6 12H15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4 18H12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function PlanViewIcon() {
  return (
    <svg aria-hidden="true" className="size-6" viewBox="0 0 24 24" fill="none">
      <path d="M4 18V6L12 10L20 6V18L12 14L4 18Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export function ListViewIcon() {
  return (
    <svg aria-hidden="true" className="size-6" viewBox="0 0 24 24" fill="none">
      <path d="M9 7H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 12H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 17H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="5" cy="7" r="1.25" fill="currentColor" />
      <circle cx="5" cy="12" r="1.25" fill="currentColor" />
      <circle cx="5" cy="17" r="1.25" fill="currentColor" />
    </svg>
  );
}

export function ProfileAvatarIcon() {
  return (
    <svg aria-hidden="true" className="size-24" viewBox="0 0 24 24" fill="none">
      <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor" opacity="0.18" />
      <path d="M4 21C4.87973 17.5578 8.10673 15 12 15C15.8933 15 19.1203 17.5578 20 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="7" r="4.1" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function ContactIcon({ type }: { type: ContactAction }) {
  if (type === "school") {
    return (
      <svg aria-hidden="true" className="size-6 text-connecto-ink" viewBox="0 0 24 24" fill="none">
        <path d="M12 4L3 8.5L12 13L19.363 9.318V15H21V8.5L12 4Z" fill="currentColor" />
        <path d="M6.5 11.2V14.5C6.5 16.433 9.186 18 12 18C14.814 18 17.5 16.433 17.5 14.5V11.2L12 14L6.5 11.2Z" fill="currentColor" opacity="0.75" />
      </svg>
    );
  }

  if (type === "chat") {
    return (
      <svg aria-hidden="true" className="size-6 text-connecto-ink" viewBox="0 0 24 24" fill="none">
        <path d="M12.04 4C7.61 4 4 7.207 4 11.16C4 12.75 4.585 14.236 5.59 15.45L4.54 19.28L8.54 18.23C9.607 18.754 10.796 19.02 12.04 19.02C16.47 19.02 20.08 15.813 20.08 11.86C20.08 7.907 16.47 4 12.04 4Z" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="size-6 text-connecto-ink" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5.5 8L12 12.75L18.5 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}