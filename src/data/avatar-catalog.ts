export type AvatarGender = "boy" | "girl";
export type AvatarRarity = "common" | "rare";

export interface PresetAvatarDef {
  id: string;
  gender: AvatarGender;
  label: string;
  src: string;
  rarity: AvatarRarity;
}

interface AvatarEntry {
  label: string;
  rarity?: AvatarRarity;
}

const BOY_ENTRIES: AvatarEntry[] = [
  { label: "Звёздный" },
  { label: "Солнечный" },
  { label: "Умник" },
  { label: "Космонавт" },
  { label: "Геймер" },
  { label: "Моряк" },
  { label: "Кепка" },
  { label: "Молния" },
  { label: "Феникс", rarity: "rare" },
  { label: "Комета", rarity: "rare" },
  { label: "Титан", rarity: "rare" },
  { label: "Легенда", rarity: "rare" },
];

const GIRL_ENTRIES: AvatarEntry[] = [
  { label: "Звёздная" },
  { label: "Розовая" },
  { label: "Цветочек" },
  { label: "Сердечко" },
  { label: "Бирюза" },
  { label: "Полоска" },
  { label: "Комбез" },
  { label: "Голубая" },
  { label: "Лунная", rarity: "rare" },
  { label: "Радуга", rarity: "rare" },
  { label: "Искра", rarity: "rare" },
  { label: "Аура", rarity: "rare" },
];

function buildAvatars(
  gender: AvatarGender,
  folder: string,
  entries: AvatarEntry[],
): PresetAvatarDef[] {
  return entries.map((entry, i) => ({
    id: `${gender}-${i + 1}`,
    gender,
    label: entry.label,
    src: `/avatars/${folder}/${folder}-${i + 1}.png`,
    rarity: entry.rarity ?? "common",
  }));
}

export const PRESET_AVATARS: PresetAvatarDef[] = [
  ...buildAvatars("boy", "boys", BOY_ENTRIES),
  ...buildAvatars("girl", "girls", GIRL_ENTRIES),
];

export const DEFAULT_AVATAR_ID = "girl-1";

/** Бесплатные аватары с самого начала (по одному–два на пол) */
export const FREE_AVATAR_IDS = new Set<string>([
  "girl-1",
  "girl-2",
  "boy-1",
  "boy-2",
]);

export function isFreeAvatar(id: string): boolean {
  return FREE_AVATAR_IDS.has(id);
}

export function isRareAvatar(id: string): boolean {
  return getAvatarDef(id)?.rarity === "rare";
}

/** Фон листа аватаров — подкладывается под PNG, чтобы не просвечивала обводка */
export const AVATAR_SHEET_BG: Record<AvatarGender, string> = {
  girl: "#FDE9A4",
  boy: "#FCE49C",
};

export function getAvatarDef(id: string): PresetAvatarDef | undefined {
  return PRESET_AVATARS.find((a) => a.id === id);
}

export function avatarSrc(id: string): string | undefined {
  return getAvatarDef(id)?.src;
}
