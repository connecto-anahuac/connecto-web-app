import { describe, expect, it } from "vitest";
import {
  getNavigationAvailabilitySnapshot,
  subscribeToNavigationAvailability,
} from "./useNavigationAvailability";

class NavigationControllerStub extends EventTarget {
  canGoBack = false;
  canGoForward = false;
}

describe("navigation availability", () => {
  it("treats an unsupported Navigation API as unavailable", () => {
    expect(getNavigationAvailabilitySnapshot()).toBe(0);
  });

  it.each([
    { canGoBack: false, canGoForward: false, snapshot: 0 },
    { canGoBack: true, canGoForward: false, snapshot: 1 },
    { canGoBack: false, canGoForward: true, snapshot: 2 },
    { canGoBack: true, canGoForward: true, snapshot: 3 },
  ])(
    "encodes back=$canGoBack and forward=$canGoForward",
    ({ canGoBack, canGoForward, snapshot }) => {
      const navigation = new NavigationControllerStub();
      navigation.canGoBack = canGoBack;
      navigation.canGoForward = canGoForward;

      expect(getNavigationAvailabilitySnapshot(navigation)).toBe(snapshot);
    },
  );

  it("subscribes to current entry changes and removes the listener", () => {
    const navigation = new NavigationControllerStub();
    const snapshots: number[] = [];
    const unsubscribe = subscribeToNavigationAvailability(
      () => snapshots.push(getNavigationAvailabilitySnapshot(navigation)),
      navigation,
    );

    navigation.canGoBack = true;
    navigation.dispatchEvent(new Event("currententrychange"));
    expect(snapshots).toEqual([1]);

    unsubscribe();
    navigation.canGoForward = true;
    navigation.dispatchEvent(new Event("currententrychange"));
    expect(snapshots).toEqual([1]);
  });
});
