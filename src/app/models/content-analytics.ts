import { AnalyticsChanges } from "./analytics-changes";
import { AudienceAnalytics } from "./audience-analytics";
import { ContentSummary } from "./content-summary";
import { DailyAnalytics } from "./daily-analytics";
import { TopContent } from "./top-content";

export interface ContentAnalytics {
  contentSummary: ContentSummary[];
  topContent: TopContent[];
  dailyAnalytics: DailyAnalytics[];

  totalPlays: number;
  totalListeners: number;
  totalWatchTime: number;
  totalFavourites: number;

  changes: AnalyticsChanges;
  audience: AudienceAnalytics;
}
