import { Injectable } from '@angular/core';
import { MediaItem } from '../models/media-item';
import { MediaType } from '../models/media-type-enum';
import { VideoProvider } from '../models/video-provider-enum';
import { MediaIcon } from '../models/media-icon-enum';

@Injectable({
  providedIn: 'root',
})
export class PodcastService {

  private readonly podcasts: MediaItem[] = [

    {
      id: 'podcast-1',
      title: 'Voices of Palestine',
      artist: 'Gaza Stream',
      description:
        'Stories, conversations and perspectives from Palestinian voices.',
      genre: 'Culture',
      artwork:
        'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1200&auto=format&fit=crop',
      url:
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      type: MediaType.Audio,
      duration: 1840,
      releaseYear: 2026,
      isFavourite: false,
      mediaIcon: MediaIcon.Podcast,
    },

    {
      id: 'podcast-2',
      title: 'The Palestinian Music Scene',
      artist: 'Gaza Stream',
      description:
        'Exploring Palestinian artists, music and the sounds shaping a new generation.',
      genre: 'Music',
      artwork:
        'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=1200&auto=format&fit=crop',
      url:
        'https://www.youtube.com/watch?v=M7lc1UVf-VE',
      type: MediaType.Video,
      provider: VideoProvider.YouTube,
      duration: 2215,
      releaseYear: 2026,
      isFavourite: false,
      mediaIcon: MediaIcon.Podcast,
    },

    {
      id: 'podcast-3',
      title: 'Stories From Gaza',
      artist: 'Gaza Stream',
      description:
        'Personal stories, experiences and conversations from Gaza.',
      genre: 'Stories',
      artwork:
        'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1200&auto=format&fit=crop',
      url:
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      type: MediaType.Audio,
      duration: 1960,
      releaseYear: 2026,
      isFavourite: false,
      mediaIcon: MediaIcon.Podcast,
    },

    {
      id: 'podcast-4',
      title: 'Arabic Culture Today',
      artist: 'Gaza Stream',
      description:
        'A look at Arabic culture, creativity, music and modern life.',
      genre: 'Culture',
      artwork:
        'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1200&auto=format&fit=crop',
      url:
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      type: MediaType.Video,
      provider: VideoProvider.YouTube,
      duration: 2430,
      releaseYear: 2025,
      isFavourite: false,
      mediaIcon: MediaIcon.Podcast,
    },

    {
      id: 'podcast-5',
      title: 'Artists & Creators',
      artist: 'Gaza Stream',
      description:
        'Conversations with musicians, artists and creators from Palestine.',
      genre: 'Artists',
      artwork:
        'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=1200&auto=format&fit=crop',
      url:
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
      type: MediaType.Audio,
      duration: 2075,
      releaseYear: 2026,
      isFavourite: false,
      mediaIcon: MediaIcon.Podcast,
    },

    {
      id: 'podcast-6',
      title: 'The Arabic Hip Hop Podcast',
      artist: 'Gaza Stream',
      description:
        'Discussing Arabic hip hop, underground music and emerging artists.',
      genre: 'Hip Hop',
      artwork:
        'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=1200&auto=format&fit=crop',
      url:
        'https://www.youtube.com/watch?v=M7lc1UVf-VE',
      type: MediaType.Video,
      provider: VideoProvider.YouTube,
      duration: 1895,
      releaseYear: 2026,
      isFavourite: false,
      mediaIcon: MediaIcon.Podcast,
    },

    {
      id: 'podcast-7',
      title: 'Palestinian Heritage',
      artist: 'Gaza Stream',
      description:
        'Exploring Palestinian heritage, traditions and cultural identity.',
      genre: 'Heritage',
      artwork:
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop',
      url:
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
      type: MediaType.Audio,
      duration: 2310,
      releaseYear: 2025,
      isFavourite: false,
      mediaIcon: MediaIcon.Podcast,
    },

    {
      id: 'podcast-8',
      title: 'New Voices',
      artist: 'Gaza Stream',
      description:
        'Introducing emerging Palestinian voices, musicians and creators.',
      genre: 'Interviews',
      artwork:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&auto=format&fit=crop',
      url:
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      type: MediaType.Video,
      provider: VideoProvider.YouTube,
      duration: 1750,
      releaseYear: 2026,
      isFavourite: false,
      mediaIcon: MediaIcon.Podcast,
    },
  ];

  getPodcasts(): MediaItem[] {
    return [...this.podcasts];
  }

  getPodcastById(id: string): MediaItem | undefined {
    return this.podcasts.find(
      podcast => podcast.id === id
    );
  }

  getPodcastMedia(podcast: MediaItem): MediaItem[] {
    if (!podcast) {
      return [];
    }

    return this.podcasts.filter(media => {

      const sameArtist =
        !podcast.artist ||
        media.artist === podcast.artist;

      const sameAlbum =
        !podcast.album ||
        media.album === podcast.album;

      const audioOrVideo =
        media.type === MediaType.Audio ||
        media.type === MediaType.Video;

      return (
        sameArtist &&
        sameAlbum &&
        audioOrVideo
      );
    });
  }

  getTrendingPodcasts(limit = 6): MediaItem[] {
  return [...this.podcasts]
    .sort(
      (a, b) =>
        (b.views ?? 0) -
        (a.views ?? 0)
    )
    .slice(0, limit);
}

}
