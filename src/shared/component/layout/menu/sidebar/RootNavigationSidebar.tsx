"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

import NavigationItem, {
  NavigationItemTone,
} from "@/shared/component/primitive/NavigationItem";
import type { IconName } from "@/shared/component/primitive/icon";
import { cn } from "@/shared/lib/util";
import { useMenu } from "../useMenu";

type RootNavigationEntry = {
  label: string;
  icon: IconName;
  href: string;
};

type RootNavigationSection = {
  label: string;
  entries: RootNavigationEntry[];
};

type Props = {
  type?: NavigationItemTone;
} & ComponentProps<"nav">;

const ROOT_NAVIGATION_SECTIONS: RootNavigationSection[] = [
  {
    label: "Datos",
    entries: [
      { label: "Alumnos", icon: "twoPersons", href: "/students" },
      { label: "Profesores", icon: "professor", href: "/professors" },
      { label: "Materias", icon: "class", href: "/classes" },
      { label: "Salones", icon: "door", href: "/classrooms" },
      { label: "Plan de estudios", icon: "curriculum", href: "/plans" },
    ],
  },
  {
    label: "Workflow",
    entries: [
      {
        label: "Schedule builder",
        icon: "schedule",
        href: "/schedule-builder",
      },
    ],
  },
  {
    label: "Admin",
    entries: [{ label: "Data Import", icon: "filter", href: "/data" }],
  },
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
      className={cn("flex h-full w-fit flex-col gap-6 px-3 py-1.5", className)}
      {...props}
    >
      {ROOT_NAVIGATION_SECTIONS.map((section) => (
        <div
          key={section.label}
          role="group"
          aria-label={section.label}
          className="flex w-full flex-col gap-1"
        >
          {isSidebarOpen && (
            <div className="text-xs font-medium text-OnSurface/60">
              {section.label}
            </div>
          )}
          <div className="flex w-full flex-col gap-2.5">
            {section.entries.map((item) => {
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
          </div>
        </div>
      ))}
    </nav>
  );
}

export default RootNavigationSidebar;
