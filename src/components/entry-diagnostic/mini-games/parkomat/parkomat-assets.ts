export const PARKOMAT_ASSETS = {
  bgMobile: "/entry-diagnostic/parkomat/bg-parkomat-390x844.png",
  /** Оба шлагбаума закрыты (mobile) */
  bgMobileBothClosed: "/entry-diagnostic/parkomat/bg-parkomat-390x844.png",
  /** Левый (−) открыт, правый закрыт (mobile) */
  bgMobileMinusOpen: "/entry-diagnostic/parkomat/bg-parkomat-mobile-minus-open.png",
  /** Правый (+) открыт, левый закрыт (mobile) */
  bgMobilePlusOpen: "/entry-diagnostic/parkomat/bg-parkomat-mobile-plus-open.png",
  bgDesktop: "/entry-diagnostic/parkomat/bg-parkomat-1280x900.png",
  /** Оба шлагбаума закрыты (desktop) */
  bgDesktopBothClosed: "/entry-diagnostic/parkomat/bg-parkomat-1280x900.png",
  /** Левый (−) открыт, правый закрыт (desktop) */
  bgDesktopMinusOpen: "/entry-diagnostic/parkomat/bg-parkomat-desktop-minus-open.png",
  /** Правый (+) открыт, левый закрыт (desktop) */
  bgDesktopPlusOpen: "/entry-diagnostic/parkomat/bg-parkomat-desktop-plus-open.png",
  carMascot: "/entry-diagnostic/parkomat/myshmat-car.png",
  header: "/entry-diagnostic/parkomat/header-parkomat.png",
  arrowLeft: "/entry-diagnostic/parkomat/icon-arrow-left.png",
  arrowRight: "/entry-diagnostic/parkomat/icon-arrow-right.png",
  iconMinus: "/entry-diagnostic/parkomat/icon-minus.png",
  iconPlus: "/entry-diagnostic/parkomat/icon-plus.png",
} as const;

export type ParkomatSceneVariant = "both-closed" | "minus-open" | "plus-open";

export function resolveParkomatSceneBg(
  minus: "closed" | "opening" | "open",
  plus: "closed" | "opening" | "open",
  mobile: boolean,
): string {
  const assets = mobile
    ? {
        bothClosed: PARKOMAT_ASSETS.bgMobileBothClosed,
        minusOpen: PARKOMAT_ASSETS.bgMobileMinusOpen,
        plusOpen: PARKOMAT_ASSETS.bgMobilePlusOpen,
      }
    : {
        bothClosed: PARKOMAT_ASSETS.bgDesktopBothClosed,
        minusOpen: PARKOMAT_ASSETS.bgDesktopMinusOpen,
        plusOpen: PARKOMAT_ASSETS.bgDesktopPlusOpen,
      };

  if (minus !== "closed") return assets.minusOpen;
  if (plus !== "closed") return assets.plusOpen;
  return assets.bothClosed;
}

export function resolveParkomatSceneVariant(
  minus: "closed" | "opening" | "open",
  plus: "closed" | "opening" | "open",
): ParkomatSceneVariant {
  if (minus !== "closed") return "minus-open";
  if (plus !== "closed") return "plus-open";
  return "both-closed";
}
