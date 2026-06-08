import { createThemedMiniGame } from "./createThemedMiniGame";

export const PojmatMiniGame = createThemedMiniGame(
  "pojmat",
  "🎯",
  "bg-purple-50 text-purple-900",
  "cards",
);
export const ParkomatMiniGame = createThemedMiniGame(
  "parkomat",
  "🅿️",
  "bg-blue-50 text-blue-900",
  "row",
);
export const RazryadMiniGame = createThemedMiniGame(
  "razryad",
  "🔧",
  "bg-orange-50 text-orange-900",
  "grid",
);
export const WarehouseMiniGame = createThemedMiniGame(
  "warehouse",
  "📦",
  "bg-green-50 text-green-900",
  "grid",
);
export const BubblesMiniGame = createThemedMiniGame(
  "bubbles",
  "🫧",
  "bg-cyan-50 text-cyan-900",
  "cards",
);
export const StationMiniGame = createThemedMiniGame(
  "station",
  "🚉",
  "bg-indigo-50 text-indigo-900",
  "row",
);
export const ParadeMiniGame = createThemedMiniGame(
  "parade",
  "🎺",
  "bg-yellow-50 text-yellow-900",
  "row",
);
export const MouseRouteMiniGame = createThemedMiniGame(
  "mouse-route",
  "🐭",
  "bg-lavender-50 text-gray-800",
  "row",
);
export const TimePathMiniGame = createThemedMiniGame(
  "time-path",
  "⏱️",
  "bg-sky-50 text-sky-900",
  "grid",
);
export const FenceTileMiniGame = createThemedMiniGame(
  "fence-tile",
  "🧱",
  "bg-stone-50 text-stone-800",
  "grid",
);
export const CheeseShareMiniGame = createThemedMiniGame(
  "cheese-share",
  "🧀",
  "bg-amber-50 text-amber-900",
  "cards",
);
export const PercentomatMiniGame = createThemedMiniGame(
  "percentomat",
  "💯",
  "bg-pink-50 text-pink-900",
  "grid",
);
export const AdvocateMiniGame = createThemedMiniGame(
  "advocate",
  "⚖️",
  "bg-violet-50 text-violet-900",
  "cards",
);
export const CodeChestMiniGame = createThemedMiniGame(
  "code-chest",
  "🔐",
  "bg-amber-50 text-amber-950",
  "grid",
);
export const CatchRepeatMiniGame = createThemedMiniGame(
  "catch-repeat",
  "🔁",
  "bg-teal-50 text-teal-900",
  "row",
);
export const CountingRoadMiniGame = createThemedMiniGame(
  "counting-road",
  "🛤️",
  "bg-emerald-50 text-emerald-900",
  "row",
);

export const ALL_MINI_GAME_COMPONENTS = {
  pojmat: PojmatMiniGame,
  parkomat: ParkomatMiniGame,
  razryad: RazryadMiniGame,
  warehouse: WarehouseMiniGame,
  bubbles: BubblesMiniGame,
  station: StationMiniGame,
  parade: ParadeMiniGame,
  "mouse-route": MouseRouteMiniGame,
  "time-path": TimePathMiniGame,
  "fence-tile": FenceTileMiniGame,
  "cheese-share": CheeseShareMiniGame,
  percentomat: PercentomatMiniGame,
  advocate: AdvocateMiniGame,
  "code-chest": CodeChestMiniGame,
  "catch-repeat": CatchRepeatMiniGame,
  "counting-road": CountingRoadMiniGame,
} as const;
