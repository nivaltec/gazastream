import { Injectable } from '@angular/core';
import { MediaItem } from '../models/media-item';
import { MediaType } from '../models/media-type-enum';
import { MediaIcon } from '../models/media-icon-enum';
import { Genre } from '../models/genre';

@Injectable({
  providedIn: 'root',
})
export class MusicService {

  private readonly tracks: MediaItem[] = [

    {
      id: 'test-1',
      title: 'Afrobeats Sunrise',
      artist: 'Gaza Stream Test Artist',
      album: 'African Sounds',
      genre: 'Afrobeats',
      artwork:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
      url:
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      duration: 372,
      releaseYear: 2026,
      isFavourite: false,
      type: MediaType.Audio,
      mediaIcon: MediaIcon.Audio,
    },

    {
      id: 'test-2',
      title: 'Arabic Nights',
      artist: 'Gaza Stream Test Artist',
      album: 'Arabic Vibes',
      genre: 'Arabic',
      artwork:
        'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800',
      url:
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      duration: 372,
      releaseYear: 2026,
      isFavourite: false,
      type: MediaType.Audio,
      mediaIcon: MediaIcon.Audio,
    },

    {
      id: 'test-3',
      title: 'Desert Dreams',
      artist: 'Gaza Stream Test Artist',
      album: 'Arabic Vibes',
      genre: 'Arabic Pop',
      artwork:
        'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800',
      url:
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      duration: 372,
      releaseYear: 2026,
      isFavourite: false,
      type: MediaType.Audio,
      mediaIcon: MediaIcon.Audio,
    },

    {
      id: 'test-4',
      title: 'Palestine',
      artist: 'Gaza Stream Test Artist',
      album: 'Palestinian Sounds',
      genre: 'Palestinian',
      artwork:
        'https://images.unsplash.com/photo-1521337581100-8ca9a73a5f79?w=800',
      url:
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      duration: 372,
      releaseYear: 2026,
      isFavourite: false,
      type: MediaType.Audio,
      mediaIcon: MediaIcon.Audio,
    },

    {
      id: 'test-5',
      title: 'Urban Flow',
      artist: 'Gaza Stream Test Artist',
      album: 'Hip Hop',
      genre: 'Hip Hop',
      artwork:
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
      url:
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
      duration: 372,
      releaseYear: 2026,
      isFavourite: false,
      type: MediaType.Audio,
      mediaIcon: MediaIcon.Audio,
    },

    {
      id: 'test-6',
      title: 'Smooth Evening',
      artist: 'Gaza Stream Test Artist',
      album: 'R&B Sessions',
      genre: 'R&B',
      artwork:
        'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800',
      url:
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
      duration: 372,
      releaseYear: 2026,
      isFavourite: false,
      type: MediaType.Audio,
      mediaIcon: MediaIcon.Audio,
    },

    {
      id: 'test-7',
      title: 'African Rhythm',
      artist: 'Gaza Stream Test Artist',
      album: 'African Sounds',
      genre: 'Afrobeats',
      artwork:
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
      url:
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
      duration: 372,
      releaseYear: 2026,
      isFavourite: false,
      type: MediaType.Audio,
      mediaIcon: MediaIcon.Audio,
    },

    {
      id: 'test-8',
      title: 'Gaza Nights',
      artist: 'Gaza Stream Test Artist',
      album: 'Palestinian Sounds',
      genre: 'Palestinian',
      artwork:
        'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=800',
      url:
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
      duration: 372,
      releaseYear: 2026,
      isFavourite: false,
      type: MediaType.Audio,
      mediaIcon: MediaIcon.Audio,
    },

    {
      id: 'test-9',
      title: 'Desert Echoes',
      artist: 'Gaza Stream Test Artist',
      album: 'Palestinian Sounds',
      genre: 'Palestinian',
      artwork:
        'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=800',
      url:
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
      duration: 372,
      releaseYear: 2026,
      isFavourite: false,
      type: MediaType.Audio,
      mediaIcon: MediaIcon.Audio,
    },

    {
      id: 'test-10',
      title: 'Palestinian Dreams',
      artist: 'Gaza Stream Test Artist',
      album: 'Palestinian Sounds',
      genre: 'Palestinian',
      artwork:
        'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=800',
      url:
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
      duration: 372,
      releaseYear: 2026,
      isFavourite: false,
      type: MediaType.Audio,
      mediaIcon: MediaIcon.Audio,
    },

    {
      id: 'test-11',
      title: 'Gaza Sunset',
      artist: 'Gaza Stream Test Artist',
      album: 'Palestinian Sounds',
      genre: 'Palestinian',
      artwork:
        'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=800',
      url:
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
      duration: 372,
      releaseYear: 2026,
      isFavourite: false,
      type: MediaType.Audio,
      mediaIcon: MediaIcon.Audio,
    },

    {
      id: 'test-12',
      title: 'Palestinian Soul',
      artist: 'Gaza Stream Test Artist',
      album: 'Palestinian Sounds',
      genre: 'Palestinian',
      artwork:
        'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=800',
      url:
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
      duration: 372,
      releaseYear: 2026,
      isFavourite: false,
      type: MediaType.Audio,
      mediaIcon: MediaIcon.Audio,
    },
  ];

  getTracks(): MediaItem[] {
    return [...this.tracks];
  }

  getTrackById(id: string): MediaItem | undefined {
    return this.tracks.find(track => track.id === id);
  }

  getTracksByGenre(genre: string): MediaItem[] {
    const term = genre.trim().toLowerCase();

    if (!term) {
      return [];
    }

    return this.tracks.filter(
      track => track.genre?.trim().toLowerCase() === term
    );
  }

  getGenres(): string[] {
    return [
      ...new Set(
        this.tracks
          .map(track => track.genre?.trim())
          .filter(
            (genre): genre is string =>
              !!genre
          )
      ),
    ];
  }

  getTrendingTracks(limit = 10): MediaItem[] {
  return this.tracks.slice(0, limit);
}

toggleFavourite(id: string): void {
  const track = this.tracks.find(item => item.id === id);

  if (track) {
    track.isFavourite = !track.isFavourite;
  }
}

getPopularGenres(limit = 4): Genre[] {
  const counts = new Map<string, number>();
  const artworkMap = new Map<string, string>();

  this.tracks.forEach(track => {
    const genre = track.genre?.trim();

    if (!genre) {
      return;
    }

    const key = genre.toLowerCase();

    counts.set(
      key,
      (counts.get(key) ?? 0) + 1
    );

    if (!artworkMap.has(key) && track.artwork) {
      artworkMap.set(key, track.artwork);
    }
  });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, trackCount]) => {
      const name = this.tracks.find(
        track => track.genre?.trim().toLowerCase() === key
      )?.genre?.trim() ?? key;

      return {
        id: key,
        name,
        artwork: artworkMap.get(key) ?? '',
        trackCount
      };
    });
}

}
