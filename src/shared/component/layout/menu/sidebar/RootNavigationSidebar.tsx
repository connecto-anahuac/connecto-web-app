"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

import NavigationItem from "@/shared/component/primitive/NavigationItem";
import type { IconName } from "@/shared/component/primitive/icon";
import { cn } from "@/shared/lib/util";
import { useMenu } from "../useMenu";


type RootNavigationEntry = {
  label: string;
  icon: IconName;
  href: string;
};

type Props = ComponentProps<"nav">;


const ROOT_NAVIGATION_ITEMS: RootNavigationEntry[] = [
  { label: "Alumnos", icon: "twoPersons", href: "/students" },
  { label: "Profesores", icon: "professor", href: "/professors" },
  { label: "Materias", icon: "class", href: "/classes" },
  { label: "Aulas", icon: "door", href: "/classrooms" },
  { label: "Plan de estudios", icon: "curriculum", href: "/plans" },
  { label: "Schedule builder", icon: "schedule", href: "/schedule-builder" },
];

export function RootNavigationSidebar({ className, ...props }: Props) {
  const isSidebarOpen = useMenu((state) => state.isSidebarOpen);

  return (
    <nav
      aria-label="Root navigation"
      className={cn("flex flex-col gap-2.5 px-3 py-1.5 h-full w-fit", className)}
      {...props}
    >
      {ROOT_NAVIGATION_ITEMS.map((item) => (
        <Link key={item.href} href={item.href} className="w-full">
          <NavigationItem
            tone="root"
            icon={item.icon}
            label={item.label}
            className="w-full"
            hasLabel={isSidebarOpen}
          />
        </Link>
      ))}
    </nav>
  );
}

export default RootNavigationSidebar;
