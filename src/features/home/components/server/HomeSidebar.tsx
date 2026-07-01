import Link from "next/link";

import type { NavItem } from "@/features/home/types";
import { SidebarToggleIcon, SidebarUserIcon } from "@/features/home/components/server/icons";

type HomeSidebarProps = {
  items: NavItem[];
};

export function HomeSidebar({ items }: HomeSidebarProps) {
  return (
    <aside className="home-sidebar-w bg-connecto-sidebar px-6 py-5 text-white lg:min-h-screen lg:px-4 lg:py-4">
      <div className="mb-8 flex items-center justify-between lg:justify-end">
        <div className="text-sm font-semibold tracking-[0.24em] text-white/70 lg:hidden">
          CONNECTO
        </div>
        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-full text-white/80 transition hover:bg-white/8 hover:text-white"
          aria-label="Collapse navigation"
        >
          <SidebarToggleIcon />
        </button>
      </div>

      <nav className="flex flex-wrap gap-3 lg:flex-col lg:gap-5 lg:px-6">
        {items.map((item) => (
          <Link
            key={item.label}
            href="/"
            className={item.active
              ? "flex items-center gap-2 text-lg font-semibold text-white"
              : "flex items-center gap-2 text-base text-white/80 transition hover:text-white"
            }
          >
            <SidebarUserIcon active={item.active} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}