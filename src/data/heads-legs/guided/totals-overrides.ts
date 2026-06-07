/** Явные итоги из условия, когда авто-разбор не справляется (слова вместо цифр и т.п.) */
export const TOTALS_OVERRIDES: Record<
  string,
  { totalObjects?: number; totalFeature?: number }
> = {
  "2.1": { totalObjects: 11, totalFeature: 225 },
  "3.2": { totalFeature: 18 },
  "5.2": { totalObjects: 44, totalFeature: 108 },
  "5.6": { totalObjects: 17, totalFeature: 32 },
};
