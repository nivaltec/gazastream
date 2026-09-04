import { Injectable } from '@angular/core';
import { MediaItem } from '../models/media-item';
import { MediaType } from '../enums/media-type-enum';
import { MediaIcon } from '../enums/media-icon-enum';
import { VideoProvider } from '../models/video-provider-enum';

@Injectable({
  providedIn: 'root',
})
export class VideoService {

  /* ==========================================================
     VIDEO DATA
     ========================================================== */

  private readonly videos: MediaItem[] = [

    {
      id: '1',
      title: 'MC Gaza - Grime From Gaza',
      artist: 'MC Gaza',
      description:
        'A Gaza-based Palestinian rap performance.',
      artwork:
        'https://img.youtube.com/vi/maxYQn011i4/hqdefault.jpg',
      url:
        'https://www.youtube.com/watch?v=maxYQn011i4',
      type: MediaType.Video,
      provider: VideoProvider.YouTube,
      duration: 0,
      views: 0,
      releaseYear: 2018,
      mediaIcon: MediaIcon.Video,
    },

    {
      id: '2',
      title: 'Dammi Falastini',
      artist: 'Mohammed Assaf',
      description:
        'Mohammed Assaf performing the Palestinian classic Dammi Falastini.',
      artwork:
        'https://img.youtube.com/vi/WgzUvbI7pj0/hqdefault.jpg',
      url:
        'https://www.youtube.com/watch?v=WgzUvbI7pj0',
      type: MediaType.Video,
      provider: VideoProvider.YouTube,
      duration: 0,
      views: 0,
      releaseYear: 2020,
      mediaIcon: MediaIcon.Video,
    },

    {
      id: '3',
      title: 'Mohammed Assaf - Dammi Falastini',
      artist: 'Mohammed Assaf',
      description:
        'Mohammed Assaf performing Dammi Falastini.',
      artwork:
        'https://img.youtube.com/vi/F9czNtvvgvA/hqdefault.jpg',
      url:
        'https://www.youtube.com/watch?v=F9czNtvvgvA',
      type: MediaType.Video,
      provider: VideoProvider.YouTube,
      duration: 0,
      views: 0,
      releaseYear: 2020,
      mediaIcon: MediaIcon.Video,
    },

    {
      id: '4',
      title: 'Today We Sing',
      artist: 'Project Zouqaq',
      description:
        'A music project showcasing young musicians and singers from Gaza.',
      artwork:
        'https://img.youtube.com/vi/arSHRKBXOxU/hqdefault.jpg',
      url:
        'https://www.youtube.com/watch?v=arSHRKBXOxU',
      type: MediaType.Video,
      provider: VideoProvider.YouTube,
      duration: 0,
      views: 0,
      releaseYear: 2020,
      mediaIcon: MediaIcon.Video,
    },

    {
      id: '5',
      title: 'GAZA',
      artist: 'SNIK & Ivan Greko',
      description:
        'Official music video for Gaza by SNIK and Ivan Greko.',
      artwork:
        'https://img.youtube.com/vi/10HbaBKmGkI/hqdefault.jpg',
      url:
        'https://www.youtube.com/watch?v=10HbaBKmGkI',
      type: MediaType.Video,
      provider: VideoProvider.YouTube,
      duration: 0,
      views: 0,
      releaseYear: 2024,
      mediaIcon: MediaIcon.Video,
    },

  ];


  /* ==========================================================
     GET ALL VIDEOS
     ========================================================== */

  getVideos(): MediaItem[] {

    return this.videos.map(video =>
      this.withArtwork(video)
    );

  }


  /* ==========================================================
     GET VIDEO BY ID
     ========================================================== */

  getVideoById(
    id: string
  ): MediaItem | undefined {

    const video =
      this.videos.find(
        item => item.id === id
      );

    return video
      ? this.withArtwork(video)
      : undefined;

  }


  /* ==========================================================
     TRENDING VIDEOS
     ========================================================== */

  getTrendingVideos(
    limit = 4
  ): MediaItem[] {

    return [...this.videos]
      .sort(
        (a, b) =>
          (b.views ?? 0) -
          (a.views ?? 0)
      )
      .slice(0, limit)
      .map(video =>
        this.withArtwork(video)
      );

  }


  /* ==========================================================
     LATEST VIDEOS
     ========================================================== */

  getLatestVideos(
    limit = 6
  ): MediaItem[] {

    return [...this.videos]
      .sort(
        (a, b) =>
          (b.releaseYear ?? 0) -
          (a.releaseYear ?? 0)
      )
      .slice(0, limit)
      .map(video =>
        this.withArtwork(video)
      );

  }


  /* ==========================================================
     GET GENRES
     ========================================================== */

  getGenres(): string[] {

    return [
      ...new Set(
        this.videos
          .map(
            video =>
              video.genre?.trim()
          )
          .filter(
            (
              genre
            ): genre is string =>
              !!genre
          )
      ),
    ];

  }


  /* ==========================================================
     SEARCH VIDEOS
     ========================================================== */

  searchVideos(
    searchTerm: string
  ): MediaItem[] {

    const term =
      searchTerm
        .trim()
        .toLowerCase();

    if (!term) {

      return this.getVideos();

    }

    return this.videos
      .filter(video =>
        video.title
          ?.toLowerCase()
          .includes(term) ||

        video.artist
          ?.toLowerCase()
          .includes(term) ||

        video.description
          ?.toLowerCase()
          .includes(term) ||

        video.genre
          ?.toLowerCase()
          .includes(term)
      )
      .map(video =>
        this.withArtwork(video)
      );

  }


  /* ==========================================================
     FAVOURITES
     ========================================================== */

  getFavouriteVideos(): MediaItem[] {

    return this.videos
      .filter(
        video =>
          video.isFavourite
      )
      .map(video =>
        this.withArtwork(video)
      );

  }


  /* ==========================================================
     TOGGLE FAVOURITE
     ========================================================== */

  toggleFavourite(
    id: string
  ): void {

    const video =
      this.videos.find(
        item =>
          item.id === id
      );

    if (video) {

      video.isFavourite =
        !video.isFavourite;

    }

  }


  /* ==========================================================
     YOUTUBE VIDEO ID
     ========================================================== */

  getYoutubeVideoId(
    url?: string
  ): string | null {

    if (!url) {

      return null;

    }

    const value =
      url.trim();

    /*
     * Direct YouTube ID.
     */

    if (
      /^[a-zA-Z0-9_-]{11}$/.test(
        value
      )
    ) {

      return value;

    }

    try {

      const parsed =
        new URL(value);

      const hostname =
        parsed.hostname
          .toLowerCase()
          .replace(
            /^www\./,
            ''
          );

      /*
       * youtube.com
       */

      if (
        hostname === 'youtube.com' ||
        hostname === 'm.youtube.com'
      ) {

        /*
         * /watch?v=...
         */

        if (
          parsed.pathname === '/watch'
        ) {

          return this.cleanYoutubeId(
            parsed.searchParams.get('v')
          );

        }

        /*
         * /embed/...
         */

        if (
          parsed.pathname.startsWith(
            '/embed/'
          )
        ) {

          return this.cleanYoutubeId(
            parsed.pathname
              .split('/')[2]
          );

        }

        /*
         * /shorts/...
         */

        if (
          parsed.pathname.startsWith(
            '/shorts/'
          )
        ) {

          return this.cleanYoutubeId(
            parsed.pathname
              .split('/')[2]
          );

        }

      }

      /*
       * youtu.be/...
       */

      if (
        hostname === 'youtu.be'
      ) {

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


  /* ==========================================================
     YOUTUBE EMBED URL
     ========================================================== */

  getYoutubeEmbedUrl(
    video: MediaItem
  ): string | null {

    const videoId =
      this.getYoutubeVideoId(
        video.url
      );

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


  /* ==========================================================
     YOUTUBE THUMBNAIL
     ========================================================== */

  getYoutubeThumbnail(
    video: MediaItem
  ): string | null {

    const videoId =
      this.getYoutubeVideoId(
        video.url
      );

    if (!videoId) {

      return null;

    }

    return (
      `https://img.youtube.com/vi/` +
      `${videoId}/hqdefault.jpg`
    );

  }


  /* ==========================================================
     ENSURE ARTWORK
     ========================================================== */

  private withArtwork(
    video: MediaItem
  ): MediaItem {

    /*
     * Keep explicitly supplied artwork.
     */

    if (
      video.artwork &&
      video.artwork.trim()
    ) {

      return {
        ...video,
      };

    }

    /*
     * Automatically generate YouTube artwork.
     */

    const youtubeArtwork =
      this.getYoutubeThumbnail(
        video
      );

    if (youtubeArtwork) {

      return {
        ...video,
        artwork: youtubeArtwork,
      };

    }

    /*
     * No artwork available.
     * VideoCardComponent will use its fallback.
     */

    return {
      ...video,
    };

  }


  /* ==========================================================
     CLEAN YOUTUBE ID
     ========================================================== */

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

    return /^[a-zA-Z0-9_-]{11}$/.test(
      cleanId
    )
      ? cleanId
      : null;

  }

}
