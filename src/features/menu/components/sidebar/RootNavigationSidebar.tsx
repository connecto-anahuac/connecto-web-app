"use client";

import type { ComponentProps } from "react";

import NavigationItem from "@/components/NavigationItem";
import type { IconName } from "@/components/icon";
import { cn } from "@/shared/lib/util";
import { useMenu } from "../useMenu";


type RootNavigationEntry = {
  label: string;
  icon: IconName;
};

type Props = ComponentProps<"nav">;


const ROOT_NAVIGATION_ITEMS: RootNavigationEntry[] = [
  { label: "Alumnos", icon: "twoPersons" },
  { label: "Profesores", icon: "professor" },
  { label: "Materias", icon: "class" },
  { label: "Plan de estudios", icon: "curriculum" },
  { label: "Schedule builder", icon: "schedule" },
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
        <NavigationItem
          key={item.label}
          tone="root"
          icon={item.icon}
          label={item.label}
          className="w-full"
          hasLabel={isSidebarOpen}
        />
      ))}
    </nav>
  );
}

export default RootNavigationSidebar;
