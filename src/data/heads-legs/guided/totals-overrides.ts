/** Явные итоги из условия, когда авто-разбор не справляется (слова вместо цифр и т.п.) */
export const TOTALS_OVERRIDES: Record<
  string,
  { totalObjects?: number; totalFeature?: number }
> = {
  "2.1": { totalObjects: 11, totalFeature: 225 },
};
