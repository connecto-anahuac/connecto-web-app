"use client";

import type { ComponentProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/shared/lib/util";
import { getBreadcrumbItems } from "./breadcrumbItems";

type Props = ComponentProps<"nav">;

export default function Breadcrumbs({ className, ...props }: Props) {
  const pathname = usePathname();
  const items = getBreadcrumbItems(pathname);

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("min-w-0", className)}
      {...props}
    >
      <ol className="flex min-w-0 items-center gap-2 text-xs text-OnSurfaceVariant">
        {items.map((item, index) => {
          const isCurrentPage = index === items.length - 1;

          return (
            <li
              key={item.href ?? `${item.label}-${index}`}
              className="flex min-w-0 items-center gap-2"
            >
              {index > 0 && <span aria-hidden="true">/</span>}
              {item.href ? (
                <Link
                  href={item.href}
                  className="min-w-0 truncate hover:underline focus-visible:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isCurrentPage ? "page" : undefined}
                  className="min-w-0 truncate font-semibold"
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
