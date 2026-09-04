import { Injectable } from '@angular/core';
import { AnalyticsChanges } from '../models/analytics-changes';
import { AudienceAnalytics } from '../models/audience-analytics';
import { ContentAnalytics } from '../models/content-analytics';
import { ContentSummary } from '../models/content-summary';
import { DailyAnalytics } from '../models/daily-analytics';
import { TopContent } from '../models/top-content';

@Injectable({
  providedIn: 'root',
})
export class InsightsService {
  /* ================================================================
     GET DASHBOARD ANALYTICS
     ================================================================ */

  getContentAnalytics(period: number = 30): ContentAnalytics {
    const contentSummary = this.getContentSummary(period);

    const topContent = this.getTopContent(period);

    const dailyAnalytics = this.getDailyAnalytics(period);

    const totals = this.calculateTotals(contentSummary);

    const changes = this.getChanges(period);

    const audience = this.calculateAudience(
      totals.totalListeners,
      topContent,
      period,
    );

    return {
      contentSummary,
      topContent,
      dailyAnalytics,

      totalPlays: totals.totalPlays,

      totalListeners: totals.totalListeners,

      totalWatchTime: totals.totalWatchTime,

      totalFavourites: totals.totalFavourites,

      changes,
      audience,
    };
  }

  /* ================================================================
     CONTENT SUMMARY
     ================================================================ */

  private getContentSummary(period: number): ContentSummary[] {
    const multiplier = this.getPeriodMultiplier(period);

    const base: ContentSummary[] = [
      {
        type: 'podcast',
        label: 'Podcasts',
        icon: 'fa-solid fa-podcast',

        plays: 184250,
        uniqueListeners: 62380,
        watchTimeMinutes: 582400,
        favourites: 12480,

        percentage: 28,
      },

      {
        type: 'music',
        label: 'Music',
        icon: 'fa-solid fa-music',

        plays: 296840,
        uniqueListeners: 98420,
        watchTimeMinutes: 741600,
        favourites: 21340,

        percentage: 45,
      },

      {
        type: 'video',
        label: 'Videos',
        icon: 'fa-solid fa-video',

        plays: 128560,
        uniqueListeners: 54120,
        watchTimeMinutes: 316800,
        favourites: 9870,

        percentage: 19,
      },

      {
        type: 'radio',
        label: 'Radio',
        icon: 'fa-solid fa-radio',

        plays: 52340,
        uniqueListeners: 18360,
        watchTimeMinutes: 182400,
        favourites: 4260,

        percentage: 8,
      },
    ];

    return base.map((item) => ({
      ...item,

      plays: Math.round(item.plays * multiplier),

      uniqueListeners: Math.round(item.uniqueListeners * multiplier),

      watchTimeMinutes: Math.round(item.watchTimeMinutes * multiplier),

      favourites: Math.round(item.favourites * multiplier),
    }));
  }

  /* ================================================================
     TOP CONTENT
     ================================================================ */

  private getTopContent(period: number): TopContent[] {
    const multiplier = this.getPeriodMultiplier(period);

    const content: TopContent[] = [
      {
        id: 'podcast-001',

        title: 'Voices from Gaza — Stories from the Ground',

        creator: 'Gaza Stream Podcast',

        type: 'podcast',
        label: 'Podcast',
        icon: 'fa-solid fa-podcast',

        plays: 84250,
        uniqueListeners: 32840,
        completionRate: 87,

        artwork:
          'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop',
      },

      {
        id: 'music-001',

        title: 'Palestinian Music Sessions',

        creator: 'Gaza Stream Music',

        type: 'music',
        label: 'Music',
        icon: 'fa-solid fa-music',

        plays: 72340,
        uniqueListeners: 38120,
        completionRate: 91,

        artwork:
          'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&auto=format&fit=crop',
      },

      {
        id: 'video-001',

        title: 'Inside Gaza — Daily Update',

        creator: 'Gaza Stream News',

        type: 'video',
        label: 'Video',
        icon: 'fa-solid fa-video',

        plays: 65420,
        uniqueListeners: 29750,
        completionRate: 78,

        artwork:
          'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&auto=format&fit=crop',
      },

      {
        id: 'music-002',

        title: 'Voices of Palestine',

        creator: 'Gaza Stream',

        type: 'music',
        label: 'Music',
        icon: 'fa-solid fa-music',

        plays: 58320,
        uniqueListeners: 27380,
        completionRate: 84,

        artwork:
          'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop',
      },

      {
        id: 'radio-001',

        title: 'Gaza Stream Live Radio',

        creator: 'Gaza Stream Radio',

        type: 'radio',
        label: 'Radio',
        icon: 'fa-solid fa-radio',

        plays: 52340,
        uniqueListeners: 18360,
        completionRate: 73,

        artwork:
          'https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?w=800&auto=format&fit=crop',
      },

      {
        id: 'podcast-002',

        title: 'Palestinian Voices',

        creator: 'Gaza Stream Podcast',

        type: 'podcast',
        label: 'Podcast',
        icon: 'fa-solid fa-podcast',

        plays: 48620,
        uniqueListeners: 19240,
        completionRate: 81,

        artwork:
          'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&auto=format&fit=crop',
      },
    ];

    return content.map((item) => ({
      ...item,

      plays: Math.round(item.plays * multiplier),

      uniqueListeners: Math.round(item.uniqueListeners * multiplier),
    }));
  }

  /* ================================================================
     DAILY ANALYTICS
     ================================================================ */

  private getDailyAnalytics(period: number): DailyAnalytics[] {
    const results: DailyAnalytics[] = [];

    const today = new Date();

    const numberOfDays = Math.min(Math.max(period, 7), 365);

    /*
     * Keep the chart readable.
     *
     * 7 days   -> 7 points
     * 30 days  -> 30 points
     * 90 days  -> 30 points
     * 365 days -> 30 points
     */

    const points = numberOfDays > 30 ? 30 : numberOfDays;

    const step = numberOfDays / points;

    for (let index = 0; index < points; index++) {
      const daysAgo = Math.round((points - 1 - index) * step);

      const date = new Date(today);

      date.setDate(today.getDate() - daysAgo);

      const seasonal = Math.sin(index * 0.72) * 0.15;

      const weekly = Math.sin(index * 1.8) * 0.08;

      const variation = ((index * 37) % 17) / 100;

      const playsBase =
        numberOfDays <= 7
          ? 18500
          : numberOfDays <= 30
            ? 21000
            : numberOfDays <= 90
              ? 23500
              : 26000;

      const listenersBase =
        numberOfDays <= 7
          ? 7200
          : numberOfDays <= 30
            ? 8100
            : numberOfDays <= 90
              ? 9200
              : 10400;

      const plays = Math.round(playsBase * (1 + seasonal + weekly + variation));

      const listeners = Math.round(
        listenersBase * (1 + seasonal * 0.7 + weekly + variation * 0.6),
      );

      results.push({
        date: date.toISOString(),

        plays,
        listeners,
      });
    }

    return results;
  }

  /* ================================================================
     TOTALS
     ================================================================ */

  private calculateTotals(summary: ContentSummary[]) {
    return {
      totalPlays: summary.reduce((total, item) => total + item.plays, 0),

      totalListeners: summary.reduce(
        (total, item) => total + item.uniqueListeners,
        0,
      ),

      totalWatchTime: summary.reduce(
        (total, item) => total + item.watchTimeMinutes,
        0,
      ),

      totalFavourites: summary.reduce(
        (total, item) => total + item.favourites,
        0,
      ),
    };
  }

  /* ================================================================
     CHANGES
     ================================================================ */

  private getChanges(period: number): AnalyticsChanges {
    switch (period) {
      case 7:
        return {
          plays: 12.8,
          listeners: 8.6,
          favourites: 6.4,
        };

      case 30:
        return {
          plays: 18.4,
          listeners: 14.2,
          favourites: 11.8,
        };

      case 90:
        return {
          plays: 24.7,
          listeners: 19.8,
          favourites: 16.9,
        };

      case 365:
        return {
          plays: 31.2,
          listeners: 27.5,
          favourites: 22.6,
        };

      default:
        return {
          plays: 18.4,
          listeners: 14.2,
          favourites: 11.8,
        };
    }
  }

  /* ================================================================
     AUDIENCE
     ================================================================ */

  private calculateAudience(
    totalListeners: number,
    topContent: TopContent[],
    period: number,
  ): AudienceAnalytics {
    const total = totalListeners || 1;

    const returning = Math.round(total * 0.64);

    const newAudience = total - returning;

    const averageCompletion = topContent.length
      ? topContent.reduce((total, item) => total + item.completionRate, 0) /
        topContent.length
      : 0;

    return {
      returningListeners: Math.round((returning / total) * 100),

      newListeners: Math.round((newAudience / total) * 100),

      averageSessions: Number((2.7 + period / 100).toFixed(1)),

      completionRate: Math.round(averageCompletion),
    };
  }

  /* ================================================================
     PERIOD MULTIPLIER
     ================================================================ */

  private getPeriodMultiplier(period: number): number {
    switch (period) {
      case 7:
        return 0.24;

      case 30:
        return 1;

      case 90:
        return 2.85;

      case 365:
        return 11.4;

      default:
        return 1;
    }
  }

  /* ================================================================
     GET SINGLE CONTENT REPORT
     ================================================================ */

  getContentReport(
    contentId: string,
    period: number = 30,
  ): TopContent | undefined {
    return this.getTopContent(period).find((item) => item.id === contentId);
  }
}
