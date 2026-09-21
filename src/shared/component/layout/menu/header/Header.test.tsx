import type { ComponentProps, ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Header from "./Header";

type NavigationButton = {
  ariaLabel?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: ComponentProps<"button">["type"];
};

type MenuState = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

const mocks = vi.hoisted(() => ({
  pathname: "/students",
  router: {
    back: vi.fn(),
    forward: vi.fn(),
  },
  availability: {
    canGoBack: true,
    canGoForward: true,
  },
  navigationButtons: [] as NavigationButton[],
}));

vi.mock("next/navigation", () => ({
  usePathname: () => mocks.pathname,
  useRouter: () => mocks.router,
}));

vi.mock("./useNavigationAvailability", () => ({
  useNavigationAvailability: () => mocks.availability,
}));

vi.mock("@/shared/component/primitive/ToolTipWrapper", () => ({
  default: ({ children }: { children: ReactNode }) => children,
}));

vi.mock("@/shared/component/primitive/button/IconButton", () => ({
  default: ({
    "aria-label": ariaLabel,
    disabled,
    icon,
    onClick,
    type,
  }: {
    "aria-label"?: string;
    disabled?: boolean;
    icon: string;
    onClick?: () => void;
    type?: ComponentProps<"button">["type"];
  }) => {
    if (icon === "arrow") {
      mocks.navigationButtons.push({ ariaLabel, disabled, onClick, type });
    }

    return (
      <button
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={onClick}
        type={type}
      />
    );
  },
}));

vi.mock("../useMenu", () => ({
  useMenu: <T,>(selector: (state: MenuState) => T) =>
    selector({ isSidebarOpen: true, toggleSidebar: vi.fn() }),
}));

describe("Header history navigation", () => {
  beforeEach(() => {
    mocks.router.back.mockReset();
    mocks.router.forward.mockReset();
    mocks.availability.canGoBack = true;
    mocks.availability.canGoForward = true;
    mocks.navigationButtons.length = 0;
  });

  it.each([
    {
      canGoBack: false,
      canGoForward: false,
      backDisabled: true,
      forwardDisabled: true,
    },
    {
      canGoBack: true,
      canGoForward: false,
      backDisabled: false,
      forwardDisabled: true,
    },
    {
      canGoBack: false,
      canGoForward: true,
      backDisabled: true,
      forwardDisabled: false,
    },
    {
      canGoBack: true,
      canGoForward: true,
      backDisabled: false,
      forwardDisabled: false,
    },
  ])(
    "sets disabled states for back=$canGoBack and forward=$canGoForward",
    ({ canGoBack, canGoForward, backDisabled, forwardDisabled }) => {
      mocks.availability.canGoBack = canGoBack;
      mocks.availability.canGoForward = canGoForward;

      renderToStaticMarkup(<Header />);

      expect(mocks.navigationButtons[0]?.disabled).toBe(backDisabled);
      expect(mocks.navigationButtons[1]?.disabled).toBe(forwardDisabled);
    },
  );

  it("calls router.back from the accessible back button", () => {
    renderToStaticMarkup(<Header />);

    const backButton = mocks.navigationButtons.find(
      (button) => button.ariaLabel === "戻る",
    );

    expect(backButton).toMatchObject({ type: "button" });
    backButton?.onClick?.();
    expect(mocks.router.back).toHaveBeenCalledOnce();
  });

  it("calls router.forward from the accessible forward button", () => {
    renderToStaticMarkup(<Header />);

    const forwardButton = mocks.navigationButtons.find(
      (button) => button.ariaLabel === "進む",
    );

    expect(forwardButton).toMatchObject({ type: "button" });
    forwardButton?.onClick?.();
    expect(mocks.router.forward).toHaveBeenCalledOnce();
  });
});
