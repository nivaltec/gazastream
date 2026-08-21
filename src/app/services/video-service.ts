import { Injectable } from '@angular/core';
import { MediaItem } from '../models/media-item';
import { MediaType } from '../models/media-type-enum';
import { MediaIcon } from '../models/media-icon-enum';
import { VideoProvider } from '../models/video-provider-enum';

@Injectable({
  providedIn: 'root',
})
export class VideoService {

  private readonly videos: MediaItem[] = [

    {
      id: '1',
      title: 'Palestinian Music Sessions',
      artist: 'Gaza Stream',
      description:
        'A collection of contemporary Palestinian music performances.',
      artwork:
        'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1200&auto=format&fit=crop',
      url:
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      type: MediaType.Video,
      provider: VideoProvider.YouTube,
      duration: 324,
      views: 125000,
      releaseYear: 2026,
      mediaIcon: MediaIcon.Video,
    },

    {
      id: '2',
      title: 'Saint Levant Live',
      artist: 'Saint Levant',
      description:
        'Live performance featuring modern Arabic and Palestinian sounds.',
      artwork:
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop',
      url:
        'https://www.youtube.com/watch?v=D4QkxtgGI_A',
      type: MediaType.Video,
      provider: VideoProvider.YouTube,
      duration: 287,
      views: 98000,
      releaseYear: 2026,
      mediaIcon: MediaIcon.Video,
    },

    {
      id: '3',
      title: 'Arabic Music Mix',
      artist: 'Gaza Stream',
      description:
        'A selection of Arabic music and emerging artists.',
      artwork:
        'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=1200&auto=format&fit=crop',
      url:
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      type: MediaType.Video,
      provider: VideoProvider.YouTube,
      duration: 612,
      views: 87000,
      releaseYear: 2026,
      mediaIcon: MediaIcon.Video,
    },

    {
      id: '4',
      title: 'Behind The Music',
      artist: 'Gaza Stream',
      description:
        'Discover the stories and inspiration behind Palestinian music.',
      artwork:
        'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1200&auto=format&fit=crop',
      url:
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      type: MediaType.Video,
      provider: VideoProvider.YouTube,
      duration: 438,
      views: 64000,
      releaseYear: 2025,
      mediaIcon: MediaIcon.Video,
    },

    {
      id: '5',
      title: 'Palestinian Artists',
      artist: 'Gaza Stream',
      description:
        'Introducing artists shaping the modern Palestinian music scene.',
      artwork:
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop',
      url:
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      type: MediaType.Video,
      provider: VideoProvider.YouTube,
      duration: 356,
      views: 52000,
      releaseYear: 2026,
      mediaIcon: MediaIcon.Video,
    },

    {
      id: '6',
      title: 'Gaza Music Showcase',
      artist: 'Gaza Stream',
      description:
        'A showcase celebrating Palestinian musicians and performers.',
      genre: 'Showcase',
      artwork:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&auto=format&fit=crop',
      url:
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      type: MediaType.Video,
      provider: VideoProvider.YouTube,
      duration: 421,
      views: 47000,
      releaseYear: 2026,
      mediaIcon: MediaIcon.Video,
    },

    {
      id: '7',
      title: 'Arabic Hip Hop',
      artist: 'Gaza Stream',
      description:
        'The latest sounds from the Arabic hip-hop scene.',
      artwork:
        'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=1200&auto=format&fit=crop',
      url:
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      type: MediaType.Video,
      provider: VideoProvider.YouTube,
      duration: 295,
      views: 43000,
      releaseYear: 2026,
      mediaIcon: MediaIcon.Video,
    },

    {
      id: '8',
      title: 'Palestinian Folk',
      artist: 'Gaza Stream',
      description:
        'Traditional Palestinian sounds presented for a new generation.',
      artwork:
        'https://images.unsplash.com/photo-1521337581100-8ca9a73a5f79?w=1200&auto=format&fit=crop',
      url:
        'https://www.youtube.com/watch?v=dQXcWgGI_A',
      type: MediaType.Video,
      provider: VideoProvider.YouTube,
      duration: 378,
      views: 38000,
      releaseYear: 2025,
      mediaIcon: MediaIcon.Video,
    },
  ];

  getVideos(): MediaItem[] {
    return [...this.videos];
  }

  getVideoById(id: string): MediaItem | undefined {
    return this.videos.find(
      video => video.id === id
    );
  }

  getTrendingVideos(limit = 4): MediaItem[] {
    return [...this.videos]
      .sort(
        (a, b) =>
          (b.views ?? 0) -
          (a.views ?? 0)
      )
      .slice(0, limit);
  }

  getLatestVideos(limit = 6): MediaItem[] {
    return [...this.videos]
      .sort(
        (a, b) =>
          (b.releaseYear ?? 0) -
          (a.releaseYear ?? 0)
      )
      .slice(0, limit);
  }

  getGenres(): string[] {
    return [
      ...new Set(
        this.videos
          .map(video => video.genre?.trim())
          .filter(
            (genre): genre is string =>
              !!genre
          )
      ),
    ];
  }

  searchVideos(searchTerm: string): MediaItem[] {

    const term =
      searchTerm.trim().toLowerCase();

    if (!term) {
      return this.getVideos();
    }

    return this.videos.filter(video =>
      video.title?.toLowerCase().includes(term) ||
      video.artist?.toLowerCase().includes(term) ||
      video.description?.toLowerCase().includes(term) ||
      video.genre?.toLowerCase().includes(term)
    );
  }

  getFavouriteVideos(): MediaItem[] {
    return this.videos.filter(
      video => video.isFavourite
    );
  }

  toggleFavourite(id: string): void {

    const video =
      this.videos.find(
        item => item.id === id
      );

    if (video) {
      video.isFavourite =
        !video.isFavourite;
    }
  }

  getYoutubeVideoId(
    url?: string
  ): string | null {

    if (!url) {
      return null;
    }

    const value = url.trim();

    if (
      /^[a-zA-Z0-9_-]{11}$/.test(value)
    ) {
      return value;
    }

    try {

      const parsed = new URL(value);

      const hostname =
        parsed.hostname
          .toLowerCase()
          .replace(/^www\./, '');

      if (
        hostname === 'youtube.com' ||
        hostname === 'm.youtube.com'
      ) {

        if (
          parsed.pathname === '/watch'
        ) {
          return this.cleanYoutubeId(
            parsed.searchParams.get('v')
          );
        }

        if (
          parsed.pathname.startsWith('/embed/')
        ) {
          return this.cleanYoutubeId(
            parsed.pathname.split('/')[2]
          );
        }

        if (
          parsed.pathname.startsWith('/shorts/')
        ) {
          return this.cleanYoutubeId(
            parsed.pathname.split('/')[2]
          );
        }
      }

      if (hostname === 'youtu.be') {
        return this.cleanYoutubeId(
          parsed.pathname
            .split('/')
            .filter(Boolean)[0]
        );
      }

    } catch {
      return null;
    }

    return null;
  }

  getYoutubeEmbedUrl(
    video: MediaItem
  ): string | null {

    const videoId =
      this.getYoutubeVideoId(video.url);

    if (!videoId) {
      return null;
    }

    return (
      `https://www.youtube.com/embed/${videoId}` +
      '?enablejsapi=1' +
      '&playsinline=1' +
      '&rel=0'
    );
  }

  getYoutubeThumbnail(
    video: MediaItem
  ): string | null {

    const videoId =
      this.getYoutubeVideoId(video.url);

    if (!videoId) {
      return null;
    }

    return (
      `https://img.youtube.com/vi/` +
      `${videoId}/hqdefault.jpg`
    );
  }

  private cleanYoutubeId(
    id?: string | null
  ): string | null {

    if (!id) {
      return null;
    }

    const cleanId =
      id
        .split('?')[0]
        .split('&')[0]
        .split('#')[0]
        .trim();

    return /^[a-zA-Z0-9_-]{11}$/.test(cleanId)
      ? cleanId
      : null;
  }
}
