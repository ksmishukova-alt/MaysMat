"use client";

import { getAvatarDef, AVATAR_SHEET_BG, type PresetAvatarDef } from "@/data/avatar-catalog";

/** Версия ассетов — сброс кэша браузера */
const AVATAR_ASSET_VERSION = "15";

interface PresetAvatarProps {
  avatarId: string;
  size?: number;
  className?: string;
  ring?: boolean;
}

export function PresetAvatar({
  avatarId,
  size = 48,
  className = "",
  ring = false,
}: PresetAvatarProps) {
  const def = getAvatarDef(avatarId);
  if (!def) {
    return (
      <EmptyCircle size={size} className={className} stroke={1.5} selected={false} />
    );
  }

  return (
    <AvatarCircle def={def} size={size} className={className} ring={ring} />
  );
}

export function PresetAvatarFromDef({
  avatar,
  size = 48,
  className = "",
  selected = false,
}: {
  avatar: PresetAvatarDef;
  size?: number;
  className?: string;
  selected?: boolean;
}) {
  return (
    <AvatarCircle
      def={avatar}
      size={size}
      className={className}
      ring={selected}
      selected={selected}
    />
  );
}

function EmptyCircle({
  size,
  stroke,
  selected,
  className = "",
}: {
  size: number;
  stroke: number;
  selected: boolean;
  className?: string;
}) {
  return (
    <div
      className={`shrink-0 rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        padding: stroke,
        backgroundColor: selected ? "#7C3AED" : "rgba(124, 58, 237, 0.3)",
        boxSizing: "border-box",
      }}
    >
      <div className="h-full w-full rounded-full bg-lavender-100/60" />
    </div>
  );
}

function AvatarCircle({
  def,
  size,
  className = "",
  ring = false,
  selected = false,
}: {
  def: PresetAvatarDef;
  size: number;
  className?: string;
  ring?: boolean;
  selected?: boolean;
}) {
  const stroke = selected ? 2.5 : ring ? 2 : 1.5;
  const strokeColor = selected
    ? "#7C3AED"
    : ring
      ? "rgba(124, 58, 237, 0.55)"
      : "rgba(124, 58, 237, 0.28)";

  return (
    <div
      className={`shrink-0 rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        padding: stroke,
        backgroundColor: strokeColor,
        boxSizing: "border-box",
      }}
      role="img"
      aria-label={def.label}
    >
      <div
        className="relative h-full w-full overflow-hidden rounded-full"
        style={{ backgroundColor: AVATAR_SHEET_BG[def.gender] }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${def.src}?v=${AVATAR_ASSET_VERSION}`}
          alt=""
          className="block h-full w-full object-cover"
          style={{ objectPosition: "center calc(50% + 1mm + 2px)" }}
          draggable={false}
        />
      </div>
    </div>
  );
}
