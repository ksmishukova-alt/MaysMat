export type ParkomatLayout = "mobile" | "tablet" | "desktop";

export type ParkomatSceneVariant = "both-closed" | "minus-open" | "plus-open";

type GateState = "closed" | "opening" | "open";

const SCENE_BY_LAYOUT = {
  mobile: {
    bothClosed: "/entry-diagnostic/parkomat/bg-parkomat-mobile-both-closed.png",
    minusOpen: "/entry-diagnostic/parkomat/bg-parkomat-mobile-minus-open.png",
    plusOpen: "/entry-diagnostic/parkomat/bg-parkomat-mobile-plus-open.png",
  },
  tablet: {
    bothClosed: "/entry-diagnostic/parkomat/bg-parkomat-tablet-both-closed.png",
    minusOpen: "/entry-diagnostic/parkomat/bg-parkomat-tablet-minus-open.png",
    plusOpen: "/entry-diagnostic/parkomat/bg-parkomat-tablet-plus-open.png",
  },
  desktop: {
    bothClosed: "/entry-diagnostic/parkomat/bg-parkomat-desktop-both-closed.png",
    minusOpen: "/entry-diagnostic/parkomat/bg-parkomat-desktop-minus-open.png",
    plusOpen: "/entry-diagnostic/parkomat/bg-parkomat-desktop-plus-open.png",
  },
} as const;

/** @deprecated используйте SCENE_BY_LAYOUT */
export const PARKOMAT_ASSETS = {
  bgMobile: SCENE_BY_LAYOUT.mobile.bothClosed,
  bgMobileBothClosed: SCENE_BY_LAYOUT.mobile.bothClosed,
  bgMobileMinusOpen: SCENE_BY_LAYOUT.mobile.minusOpen,
  bgMobilePlusOpen: SCENE_BY_LAYOUT.mobile.plusOpen,
  bgDesktop: SCENE_BY_LAYOUT.desktop.bothClosed,
  bgDesktopBothClosed: SCENE_BY_LAYOUT.desktop.bothClosed,
  bgDesktopMinusOpen: SCENE_BY_LAYOUT.desktop.minusOpen,
  bgDesktopPlusOpen: SCENE_BY_LAYOUT.desktop.plusOpen,
  carMascot: "/entry-diagnostic/parkomat/myshmat-car.png",
  header: "/entry-diagnostic/parkomat/header-parkomat.png",
  arrowLeft: "/entry-diagnostic/parkomat/icon-arrow-left.png",
  arrowRight: "/entry-diagnostic/parkomat/icon-arrow-right.png",
  iconMinus: "/entry-diagnostic/parkomat/icon-minus.png",
  iconPlus: "/entry-diagnostic/parkomat/icon-plus.png",
} as const;

export function resolveParkomatLayout(viewportWidth: number): ParkomatLayout {
  if (viewportWidth < 768) return "mobile";
  if (viewportWidth < 1024) return "tablet";
  return "desktop";
}

export function resolveParkomatSceneBg(
  minus: GateState,
  plus: GateState,
  layout: ParkomatLayout,
): string {
  const assets = SCENE_BY_LAYOUT[layout];
  if (minus !== "closed") return assets.minusOpen;
  if (plus !== "closed") return assets.plusOpen;
  return assets.bothClosed;
}

export function resolveParkomatSceneVariant(minus: GateState, plus: GateState): ParkomatSceneVariant {
  if (minus !== "closed") return "minus-open";
  if (plus !== "closed") return "plus-open";
  return "both-closed";
}
