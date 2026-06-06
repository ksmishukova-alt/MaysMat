/** Экранный сценарий из методического аудита */
export interface ScreenSpec {
  screen: number;
  title: string;
  childAction: string;
  stepKind?: string;
}
