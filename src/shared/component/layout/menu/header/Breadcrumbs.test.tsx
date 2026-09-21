import type { ComponentProps } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Breadcrumbs from "./Breadcrumbs";
import { getBreadcrumbItems } from "./breadcrumbItems";

const mocks = vi.hoisted(() => ({
  pathname: "/students",
}));

vi.mock("next/navigation", () => ({
  usePathname: () => mocks.pathname,
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: ComponentProps<"a">) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("getBreadcrumbItems", () => {
  it.each([
    ["/students", "Alumnos"],
    ["/professors", "Profesores"],
    ["/classes", "Materias"],
    ["/classrooms", "Salones"],
    ["/plans", "Plan de estudios"],
    ["/data", "Data Import"],
    ["/schedule-builder", "Schedule builder"],
  ])("maps %s to its navigation label", (pathname, label) => {
    expect(getBreadcrumbItems(pathname)).toEqual([{ label }]);
  });

  it.each([
    ["/students/123", "Alumnos", "/students", "123"],
    ["/professors/abc", "Profesores", "/professors", "abc"],
    ["/classrooms/A-1", "Salones", "/classrooms", "A-1"],
    ["/plans/ISC-2026", "Plan de estudios", "/plans", "ISC-2026"],
    ["/data/source-1", "Data Import", "/data", "source-1"],
  ])(
    "creates a linked parent and current ID for %s",
    (pathname, parentLabel, parentHref, id) => {
      expect(getBreadcrumbItems(pathname)).toEqual([
        { label: parentLabel, href: parentHref },
        { label: id },
      ]);
    },
  );

  it("decodes an encoded detail ID", () => {
    expect(getBreadcrumbItems("/students/Jos%C3%A9%20P%C3%A9rez")).toEqual([
      { label: "Alumnos", href: "/students" },
      { label: "José Pérez" },
    ]);
  });

  it("keeps an invalid encoded segment instead of throwing", () => {
    expect(getBreadcrumbItems("/students/%E0%A4%A")).toEqual([
      { label: "Alumnos", href: "/students" },
      { label: "%E0%A4%A" },
    ]);
  });

  it("supports the schedule builder child routes", () => {
    expect(
      getBreadcrumbItems("/schedule-builder/offering-course"),
    ).toEqual([
      { label: "Schedule builder", href: "/schedule-builder" },
      { label: "offering course" },
    ]);
    expect(getBreadcrumbItems("/schedule-builder/builder")).toEqual([
      { label: "Schedule builder" },
    ]);
  });

  it("returns no items for the root route", () => {
    expect(getBreadcrumbItems("/")).toEqual([]);
  });

  it("falls back to decoded labels for an unknown route", () => {
    expect(getBreadcrumbItems("/custom/foo%20bar")).toEqual([
      { label: "custom", href: "/custom" },
      { label: "foo bar" },
    ]);
  });
});

describe("Breadcrumbs", () => {
  beforeEach(() => {
    mocks.pathname = "/students/123";
  });

  it("renders linked ancestors and marks the current page", () => {
    const markup = renderToStaticMarkup(<Breadcrumbs />);

    expect(markup).toContain('<nav aria-label="Breadcrumb"');
    expect(markup).toContain('<a href="/students"');
    expect(markup).toContain("Alumnos</a>");
    expect(markup).toContain('aria-current="page"');
    expect(markup).toContain(">123</span>");
    expect(markup).toContain('<span aria-hidden="true">/</span>');
  });

  it("renders nothing on the root route", () => {
    mocks.pathname = "/";

    expect(renderToStaticMarkup(<Breadcrumbs />)).toBe("");
  });
});
