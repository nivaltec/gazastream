import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MediaIcon } from 'src/app/models/media-icon-enum';
import { MediaItem } from 'src/app/models/media-item';
import { MediaType } from 'src/app/models/media-type-enum';
import { MediaPlayerService } from 'src/app/services/media-player-service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrl: './favourites.component.css',
  standalone: false,
})
export class FavouritesComponent implements OnInit, OnDestroy {
  // ============================================================
  // MEDIA TYPE
  // ============================================================

  readonly MediaType = MediaType;

  // ============================================================
  // FAVOURITES
  // ============================================================

  favourites: MediaItem[] = [];

  // ============================================================
  // PLAYER STATE
  // ============================================================

  currentTrack: MediaItem | null = null;

  isPlaying = false;

  // ============================================================
  // DESTROY
  // ============================================================

  private readonly destroy$ = new Subject<void>();

  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(private readonly playerService: MediaPlayerService) {}

  // ============================================================
  // INIT
  // ============================================================

  ngOnInit(): void {
    this.loadFavourites();

    this.subscribeToPlayer();
  }

  // ============================================================
  // PLAYER SUBSCRIPTIONS
  // ============================================================

  private subscribeToPlayer(): void {
    this.playerService.currentMedia
      .pipe(takeUntil(this.destroy$))
      .subscribe((media) => {
        this.currentTrack = media;

        this.updatePlayingState(media);
      });

    this.playerService.isPlaying
      .pipe(takeUntil(this.destroy$))
      .subscribe((isPlaying) => {
        this.isPlaying = !!this.currentTrack && isPlaying;
      });
  }

  // ============================================================
  // PLAYING STATE
  // ============================================================

  private updatePlayingState(media: MediaItem | null): void {
    this.isPlaying = !!media && this.playerService.isPlayingValue;
  }

  // ============================================================
  // LOAD FAVOURITES
  // ============================================================

  private loadFavourites(): void {
    /*
     * Replace with your API/local-storage
     * implementation when connected.
     */

    this.favourites = [
      // --------------------------------------------------------
      // AUDIO
      // --------------------------------------------------------

      {
        id: '1',

        title: 'Sample Track One',

        artist: 'Gaza Artist',

        album: 'Gaza Stream',

        genre: 'Afrobeat',

        artwork: 'assets/images/audio/track-1.jpg',

        url: 'assets/audio/track-1.mp3',

        duration: 214,

        isFavourite: true,

        releaseYear: 2026,

        type: MediaType.Audio,

        mediaIcon: MediaIcon.Audio,
      },

      // --------------------------------------------------------
      // VIDEO
      // --------------------------------------------------------

      {
        id: '2',

        title: 'Gaza Music Live',

        artist: 'Gaza Artist',

        artwork: 'assets/images/video/video-1.jpg',

        url: 'https://www.youtube.com/watch?v=example',

        duration: 312,

        isFavourite: true,

        releaseYear: 2026,

        type: MediaType.Video,

        mediaIcon: MediaIcon.Video,
      },

      // --------------------------------------------------------
      // RADIO
      // --------------------------------------------------------

      {
        id: '3',

        title: 'Gaza Stream Radio',

        artist: 'Gaza Stream',

        artwork: 'assets/images/radio/radio-1.jpg',

        url: 'https://example.com/radio-stream',

        isFavourite: true,

        type: MediaType.Radio,

        mediaIcon: MediaIcon.Radio,
      },
    ];
  }

  // ============================================================
  // PLAY
  // ============================================================

  playTrack(track: MediaItem, event?: Event): void {
    event?.stopPropagation();

    if (!track?.url) {
      console.warn('Gaza Stream: Favourite has no media URL:', track);

      return;
    }

    // ----------------------------------------------------------
    // SAME MEDIA
    // ----------------------------------------------------------

    if (this.isCurrentTrack(track)) {
      if (this.playerService.isPlayingValue) {
        this.playerService.pause();
      } else {
        this.playerService.resume();
      }

      return;
    }

    // ----------------------------------------------------------
    // DIFFERENT MEDIA
    // ----------------------------------------------------------

    this.playerService.play({
      ...track,
    });
  }

  // ============================================================
  // CURRENT MEDIA
  // ============================================================

  isCurrentTrack(track: MediaItem): boolean {
    if (!track) {
      return false;
    }

    const current = this.playerService.currentMediaValue;

    return !!current && current.id === track.id && current.type === track.type;
  }

  // ============================================================
  // PLAYING
  // ============================================================

  isTrackPlaying(track: MediaItem): boolean {
    return this.isCurrentTrack(track) && this.playerService.isPlayingValue;
  }

  // ============================================================
  // MEDIA TYPE LABEL
  // ============================================================

  getMediaTypeLabel(media: MediaItem): string {
    switch (media.type) {
      case MediaType.Audio:
        return 'Audio';

      case MediaType.Video:
        return 'Video';

      case MediaType.Radio:
        return 'Radio';

      default:
        return 'Media';
    }
  }

  // ============================================================
  // MEDIA ICON
  // ============================================================

  getMediaIcon(media: MediaItem): string {
    switch (media.type) {
      case MediaType.Audio:
        return 'fa-solid fa-music';

      case MediaType.Video:
        return 'fa-solid fa-video';

      case MediaType.Radio:
        return 'fa-solid fa-radio';

      default:
        return media.mediaIcon || 'fa-solid fa-play';
    }
  }

  // ============================================================
  // DURATION
  // ============================================================

  formatDuration(seconds: number): string {
    if (!seconds || seconds < 0) {
      return '—';
    }

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // ============================================================
  // REMOVE FAVOURITE
  // ============================================================

  removeFavourite(track: MediaItem, event?: Event): void {
    event?.stopPropagation();

    if (!track) {
      return;
    }

    track.isFavourite = false;

    this.favourites = this.favourites.filter(
      (item) => !(item.id === track.id && item.type === track.type),
    );
  }

  // ============================================================
  // TRACK BY
  // ============================================================

  trackByMedia(index: number, media: MediaItem): string {
    return `${media.type}-${media.id}`;
  }

  // ============================================================
  // DESTROY
  // ============================================================

  ngOnDestroy(): void {
    this.destroy$.next();

    this.destroy$.complete();
  }
}
