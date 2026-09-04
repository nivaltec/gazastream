
export interface TopContent {
  id: string;
  title: string;
  creator: string;

  type: string;
  label: string;
  icon: string;

  plays: number;
  uniqueListeners: number;
  completionRate: number;

  artwork?: string;
}
