"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

import NavigationItem, {
  NavigationItemTone,
} from "@/shared/component/primitive/NavigationItem";
import type { IconName } from "@/shared/component/primitive/icon";
import { cn } from "@/shared/lib/util";
import { useSubMenu } from "../useMenu";
import PanelControllButton from "@/shared/component/primitive/button/PanelControllButton";

export type NavigationEntry = {
  label: string;
  icon: IconName;
  href: string;
};

type Props = {
  type?: NavigationItemTone;
  title: string;
 navigationEntries:NavigationEntry[];
} & ComponentProps<"nav">;



export function SubNavigationSidebar({
  className,
  type = "sub",
  title,
  navigationEntries,
  ...props
}: Props) {
  const isSidebarOpen = useSubMenu((state) => state.isSidebarOpen);
  const toggleSidebar = useSubMenu((state) => state.toggleSidebar);
  const pathname = usePathname();

  return (
    <nav
      aria-label="Sub navigation"
      className={cn(
        "flex flex-col gap-2.5 px-3 py-1.5 h-full w-fit",
        "border-r border-DividerMiddle",
        className,
      )}
      {...props}
    >
      <div className="flex gap-2 h-11 items-center justify-between">
        <div className={cn("font-semibold text-xs", !isSidebarOpen && "hidden")}>{title}</div>
        <PanelControllButton
          size="lg"
          appearance="text"
          intent="lightInk"
          isOpen={isSidebarOpen}
          onClick={toggleSidebar}
        />
      </div>
      {navigationEntries.map((item) => {
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

export default SubNavigationSidebar;
