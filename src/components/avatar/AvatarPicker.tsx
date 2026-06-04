"use client";

import { useState } from "react";
import { PresetAvatarFromDef } from "@/components/avatar/PresetAvatar";
import { PRESET_AVATARS, type AvatarGender } from "@/data/avatar-catalog";
import { getAvatarId, isAvatarUnlocked, setAvatarId } from "@/lib/avatar";
import { useProgress } from "@/lib/use-progress";

const GRID_SIZE = 68;
const CELL_SIZE = 108;

export function AvatarPicker() {
  const progress = useProgress();
  const currentId = getAvatarId(progress);
  const [tab, setTab] = useState<AvatarGender>(() => {
    const current = PRESET_AVATARS.find((a) => a.id === currentId);
    return current?.gender ?? "girl";
  });

  const items = PRESET_AVATARS.filter((a) => a.gender === tab);

  return (
    <div>
      <div className="mb-6 flex gap-2">
        {(["girl", "boy"] as const).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setTab(g)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              tab === g
                ? "bg-brand-purple text-white"
                : "bg-lavender-100 text-gray-600 hover:bg-lavender-200"
            }`}
          >
            {g === "girl" ? "Девочки" : "Мальчики"}
          </button>
        ))}
      </div>

      <div className="mt-4 overflow-x-auto overflow-y-visible pb-1 pt-4">
        <div className="mx-auto grid w-max grid-cols-6 gap-[25px]">
          {items.map((avatar) => {
            const selected = avatar.id === currentId;
            const unlocked = isAvatarUnlocked(avatar.id, progress);
            const isRare = avatar.rarity === "rare";

            return (
              <button
                key={avatar.id}
                type="button"
                disabled={!unlocked}
                onClick={() => setAvatarId(avatar.id)}
                style={{ width: CELL_SIZE, height: CELL_SIZE }}
                className={`relative flex flex-col items-center justify-center gap-2 rounded-xl p-2 transition ${
                  !unlocked ? "cursor-not-allowed" : "hover:bg-lavender-50"
                } ${
                  selected && unlocked
                    ? "bg-lavender-50 shadow-[0_0_0_3px_#7C3AED,0_0_20px_rgba(124,58,237,0.45)]"
                    : ""
                }`}
                aria-pressed={selected && unlocked}
                aria-disabled={!unlocked}
                aria-label={
                  unlocked
                    ? avatar.label
                    : `${avatar.label}${isRare ? ", редкий" : ""} — заблокирован`
                }
              >
                {isRare && !(selected && unlocked) && (
                  <span
                    className="absolute right-1 top-1 text-[10px] leading-none text-amber-500"
                    aria-hidden
                    title="Редкий"
                  >
                    ★
                  </span>
                )}

                {selected && unlocked && (
                  <span
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-purple text-[11px] font-bold text-white shadow-sm"
                    aria-hidden
                  >
                    ✓
                  </span>
                )}

                <div
                  className={`relative shrink-0 ${unlocked ? "" : "opacity-45 saturate-50"}`}
                >
                  <PresetAvatarFromDef
                    avatar={avatar}
                    size={GRID_SIZE}
                    selected={selected && unlocked}
                  />
                  {!unlocked && (
                    <div
                      className="pointer-events-none absolute inset-0 flex items-center justify-center"
                      aria-hidden
                    >
                      <span className="text-lg drop-shadow-md">🔒</span>
                    </div>
                  )}
                </div>

                <span
                  className={`w-full truncate text-center text-[11px] font-medium leading-tight ${
                    selected && unlocked
                      ? "text-brand-purple"
                      : unlocked
                        ? "text-gray-600"
                        : isRare
                          ? "text-amber-600/70"
                          : "text-gray-400"
                  }`}
                >
                  {avatar.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
