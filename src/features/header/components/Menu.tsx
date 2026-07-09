"use client";

/* 
color

bg
border
foreground
divider
container
oncontainer

*/

import PersonIcon from "@/components/icon/PersonIcon";
import ScheduleIcon from "@/components/icon/ScheduleIcon";
import ToolFillIcon from "@/components/icon/ToolFillIcon";
import { cn } from "@/shared/lib/util";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MENU_ITEMS = [
  {
    href: "/data",
    label: "Data",
    icon: ToolFillIcon,
  },
  {
    href: "/schedule-builder",
    label: "Schedule Builder",
    icon: ScheduleIcon,
  },
  {
    href: "/students",
    label: "Students",
    icon: PersonIcon,
  },
];

export default function Menu() {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "bg-header border-solid border h-header-height border-divider rounded-lg min-w-40 text-header-foreground p-4 flex gap-4 items-center",
      )}
    >
      <div className={cn("flex gap-2.5 items-center") }>
        <span className={cn("text-sm font-semibold")}>三</span>
        <span className={cn("text-xs font-semibold")}>Connecto</span>
      </div>

      <div className="h-full w-0.5 bg-divider" />
      <nav className={cn("flex items-center gap-2")} aria-label="Header menu">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-3 py-1 text-xs transition-colors hover:bg-header-container flex items-center gap-1.5",
                isActive
                  ? "font-bold text-OnSurface "
                  : "font-semibold text-header-foreground/70 hover:text-header-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 transition-colors",
                  isActive ? "text-header-foreground" : "text-header-foreground/70",
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
