export interface ContentSummary {
  type: string;
  label: string;
  icon: string;

  plays: number;
  uniqueListeners: number;
  watchTimeMinutes: number;
  favourites: number;

  percentage: number;
}
