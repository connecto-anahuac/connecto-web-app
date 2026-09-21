"use client";

import { useSyncExternalStore } from "react";

type NavigationController = {
  readonly canGoBack: boolean;
  readonly canGoForward: boolean;
  addEventListener(
    type: "currententrychange",
    listener: EventListener,
  ): void;
  removeEventListener(
    type: "currententrychange",
    listener: EventListener,
  ): void;
};

type NavigationAvailability = {
  canGoBack: boolean;
  canGoForward: boolean;
};

const CAN_GO_BACK = 1;
const CAN_GO_FORWARD = 2;
const UNAVAILABLE_SNAPSHOT = 0;

function getNavigationController(): NavigationController | null {
  if (typeof window === "undefined") return null;

  const navigation = (
    window as Window & { navigation?: Partial<NavigationController> }
  ).navigation;

  if (
    !navigation ||
    typeof navigation.canGoBack !== "boolean" ||
    typeof navigation.canGoForward !== "boolean" ||
    typeof navigation.addEventListener !== "function" ||
    typeof navigation.removeEventListener !== "function"
  ) {
    return null;
  }

  return navigation as NavigationController;
}

export function getNavigationAvailabilitySnapshot(
  navigation: NavigationController | null = getNavigationController(),
) {
  if (!navigation) return UNAVAILABLE_SNAPSHOT;

  return (
    (navigation.canGoBack ? CAN_GO_BACK : 0) |
    (navigation.canGoForward ? CAN_GO_FORWARD : 0)
  );
}

export function subscribeToNavigationAvailability(
  onStoreChange: () => void,
  navigation: NavigationController | null = getNavigationController(),
) {
  if (!navigation) return () => undefined;

  navigation.addEventListener("currententrychange", onStoreChange);

  return () => {
    navigation.removeEventListener("currententrychange", onStoreChange);
  };
}

function getServerSnapshot() {
  return UNAVAILABLE_SNAPSHOT;
}

export function useNavigationAvailability(): NavigationAvailability {
  const snapshot = useSyncExternalStore(
    subscribeToNavigationAvailability,
    getNavigationAvailabilitySnapshot,
    getServerSnapshot,
  );

  return {
    canGoBack: (snapshot & CAN_GO_BACK) !== 0,
    canGoForward: (snapshot & CAN_GO_FORWARD) !== 0,
  };
}
