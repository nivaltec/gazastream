import { Component, OnInit } from '@angular/core';

import { MediaItem } from 'src/app/models/media-item';
import { PodcastService } from 'src/app/services/podcast-service';

interface PodcastGenre {
  name: string;
  icon: string;
  description: string;
  podcasts: MediaItem[];
}

@Component({
  selector: 'app-podcast',
  templateUrl: './podcast.component.html',
  styleUrl: './podcast.component.css',
  standalone: false
})
export class PodcastComponent implements OnInit {

  podcasts: MediaItem[] = [];

  podcastGenres: PodcastGenre[] = [];

  featuredPodcast: MediaItem | null = null;

  constructor(
    private podcastService: PodcastService
  ) {}

  ngOnInit(): void {
    this.loadPodcasts();
  }

  private loadPodcasts(): void {

    const servicePodcasts =
      this.podcastService.getTrendingPodcasts() || [];

    /*
     * Keep the podcasts returned by the service.
     * If there are no podcasts, use demo data so every
     * category is visible.
     */
    this.podcasts =
      servicePodcasts.length > 0
        ? servicePodcasts
        : this.createDemoPodcasts();

    this.featuredPodcast =
      this.podcasts.length > 0
        ? this.podcasts[0]
        : null;

    this.groupPodcastsByGenre();
  }

  private groupPodcastsByGenre(): void {

    const genreDefinitions = [
      {
        name: 'News',
        icon: 'fa-newspaper',
        description:
          'The latest stories, developments and voices from Gaza.'
      },
      {
        name: 'Politics',
        icon: 'fa-landmark',
        description:
          'Political developments, diplomacy and leadership.'
      },
      {
        name: 'World',
        icon: 'fa-globe',
        description:
          'International stories and the wider Middle East.'
      },
      {
        name: 'Humanitarian',
        icon: 'fa-heart',
        description:
          'Humanitarian stories, people and life in Gaza.'
      },
      {
        name: 'Analysis',
        icon: 'fa-chart-line',
        description:
          'In-depth conversations, context and analysis.'
      }
    ];

    /*
     * First group podcasts that already have a genre.
     */
    const groupedGenres =
      genreDefinitions.map(definition => {

        const matchingPodcasts =
          this.podcasts.filter(
            podcast =>
              this.getPodcastGenre(podcast) ===
              definition.name
          );

        return {
          name: definition.name,
          icon: definition.icon,
          description: definition.description,
          podcasts: matchingPodcasts
        };
      });

    /*
     * Make sure every category has content.
     */
    this.podcastGenres =
      groupedGenres.map((genre, index) => {

        if (genre.podcasts.length > 0) {
          return genre;
        }

        return {
          ...genre,
          podcasts: this.createGenreDemoPodcasts(
            genre.name,
            index
          )
        };
      });
  }

  private getPodcastGenre(
    podcast: MediaItem
  ): string {

    const item = podcast as any;

    const genre =
      item.genre ||
      item.category ||
      item.podcastGenre ||
      item.type ||
      '';

    const value =
      String(genre)
        .trim()
        .toLowerCase();

    if (value.includes('polit')) {
      return 'Politics';
    }

    if (
      value.includes('human') ||
      value.includes('aid') ||
      value.includes('relief')
    ) {
      return 'Humanitarian';
    }

    if (
      value.includes('analysis') ||
      value.includes('opinion') ||
      value.includes('explainer')
    ) {
      return 'Analysis';
    }

    if (
      value.includes('world') ||
      value.includes('international') ||
      value.includes('global')
    ) {
      return 'World';
    }

    return 'News';
  }

  private createDemoPodcasts(): MediaItem[] {

    return [
      ...this.createGenreDemoPodcasts('News', 0),
      ...this.createGenreDemoPodcasts('Politics', 1),
      ...this.createGenreDemoPodcasts('World', 2),
      ...this.createGenreDemoPodcasts('Humanitarian', 3),
      ...this.createGenreDemoPodcasts('Analysis', 4)
    ];
  }

  private createGenreDemoPodcasts(
    genre: string,
    index: number
  ): MediaItem[] {

    const content: any = {

      News: [
        {
          title: 'Gaza Daily Briefing',
          description:
            'The latest developments and breaking stories from Gaza.',
          artist: 'Gaza Stream News',
          artwork:
            'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80'
        },
        {
          title: 'The Gaza Update',
          description:
            'A daily look at the most important stories.',
          artist: 'Gaza Stream',
          artwork:
            'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80'
        },
        {
          title: 'Morning News Roundup',
          description:
            'Start the day with the latest headlines.',
          artist: 'Gaza Stream',
          artwork:
            'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=800&q=80'
        }
      ],

      Politics: [
        {
          title: 'Gaza Politics Today',
          description:
            'Political developments and diplomatic efforts.',
          artist: 'Gaza Stream Politics',
          artwork:
            'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=800&q=80'
        },
        {
          title: 'Inside Diplomacy',
          description:
            'Understanding negotiations and international diplomacy.',
          artist: 'Gaza Stream',
          artwork:
            'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=800&q=80'
        },
        {
          title: 'Leaders & Decisions',
          description:
            'The people and decisions shaping the region.',
          artist: 'Gaza Stream',
          artwork:
            'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=800&q=80'
        }
      ],

      World: [
        {
          title: 'Gaza & The World',
          description:
            'How global events are affecting Gaza and the region.',
          artist: 'Gaza Stream World',
          artwork:
            'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=800&q=80'
        },
        {
          title: 'Middle East Focus',
          description:
            'Regional developments and international reaction.',
          artist: 'Gaza Stream',
          artwork:
            'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=800&q=80'
        },
        {
          title: 'Global Voices',
          description:
            'Perspectives from around the world.',
          artist: 'Gaza Stream',
          artwork:
            'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80'
        }
      ],

      Humanitarian: [
        {
          title: 'Human Stories',
          description:
            'Real stories from people living through extraordinary times.',
          artist: 'Gaza Stream Humanitarian',
          artwork:
            'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80'
        },
        {
          title: 'Aid & Relief',
          description:
            'Humanitarian work, aid and relief efforts.',
          artist: 'Gaza Stream',
          artwork:
            'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80'
        },
        {
          title: 'Voices From Gaza',
          description:
            'Personal stories and voices from Gaza.',
          artist: 'Gaza Stream',
          artwork:
            'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=800&q=80'
        }
      ],

      Analysis: [
        {
          title: 'Gaza Explained',
          description:
            'Context and analysis behind the headlines.',
          artist: 'Gaza Stream Analysis',
          artwork:
            'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
        },
        {
          title: 'Beyond The Headlines',
          description:
            'A deeper look at the stories shaping Gaza.',
          artist: 'Gaza Stream',
          artwork:
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
        },
        {
          title: 'The Big Picture',
          description:
            'Expert conversations and deeper perspectives.',
          artist: 'Gaza Stream',
          artwork:
            'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80'
        }
      ]
    };

    const items =
      content[genre] || content.News;

    return items.map(
      (item: any, itemIndex: number) => {

        return {
          ...item,

          id:
            `demo-${genre.toLowerCase()}-${index}-${itemIndex}`,

          genre: genre,

          type: 'Podcast'
        } as MediaItem;
      }
    );
  }

  getGenreIcon(
    genre: string
  ): string {

    switch (genre) {

      case 'Politics':
        return 'fa-landmark';

      case 'World':
        return 'fa-globe';

      case 'Humanitarian':
        return 'fa-heart';

      case 'Analysis':
        return 'fa-chart-line';

      default:
        return 'fa-newspaper';
    }
  }

  getGenreClass(
    genre: string
  ): string {

    return genre
      .toLowerCase()
      .replace(/\s+/g, '-');
  }

  trackByPodcast(
    index: number,
    podcast: MediaItem
  ): unknown {

    const item = podcast as any;

    return (
      item.id ??
      item.Id ??
      item.title ??
      item.name ??
      index
    );
  }

  handleImageError(
    event: Event
  ): void {

    const image =
      event.target as HTMLImageElement;

    if (!image) {
      return;
    }

    image.src =
      'assets/images/podcast-placeholder.jpg';
  }

  getGenreCount(
    genre: PodcastGenre
  ): number {

    return genre.podcasts.length;
  }
}
