"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

import NavigationItem, { NavigationItemTone } from "@/shared/component/primitive/NavigationItem";
import type { IconName } from "@/shared/component/primitive/icon";
import { cn } from "@/shared/lib/util";
import { useMenu } from "../useMenu";

type RootNavigationEntry = {
  label: string;
  icon: IconName;
  href: string;
};

type Props = {
  type?: NavigationItemTone;
} & ComponentProps<"nav">;

const ROOT_NAVIGATION_ITEMS: RootNavigationEntry[] = [
  { label: "Alumnos", icon: "twoPersons", href: "/students" },
  { label: "Profesores", icon: "professor", href: "/professors" },
  { label: "Materias", icon: "class", href: "/classes" },
  { label: "Aulas", icon: "door", href: "/classrooms" },
  { label: "Plan de estudios", icon: "curriculum", href: "/plans" },
  { label: "Schedule builder", icon: "schedule", href: "/schedule-builder" },
  { label: "Data Import", icon: "filter", href: "/data" },
];

export function RootNavigationSidebar({
  className,
  type = "root",
  ...props
}: Props) {
  const isSidebarOpen = useMenu((state) => state.isSidebarOpen);
  const pathname = usePathname();

  return (
    <nav
      aria-label="Root navigation"
      className={cn(
        "flex flex-col gap-2.5 px-3 py-1.5 h-full w-fit",
        className,
      )}
      {...props}
    >
      {ROOT_NAVIGATION_ITEMS.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className="w-full"
            aria-current={isActive ? "page" : undefined}
          >
            <NavigationItem
              tone={type}
              icon={item.icon}
              label={item.label}
              className="w-full"
              hasLabel={isSidebarOpen}
              selected={isActive}
            />
          </Link>
        );
      })}
    </nav>
  );
}

export default RootNavigationSidebar;
