import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';

import {
  Subscription
} from 'rxjs';

import {
  MediaItem
} from 'src/app/models/media-item';

import {
  MediaType
} from 'src/app/enums/media-type-enum';

import {
  MediaPlayerService
} from 'src/app/services/media-player-service';

@Component({
  selector: 'app-video-card',
  standalone: false,
  templateUrl: './video-card.component.html',
  styleUrls: ['./video-card.component.css']
})
export class VideoCardComponent
  implements OnInit, OnChanges, OnDestroy {

  @Input()
  video!: MediaItem;

  isActive = false;
  isPlaying = false;

  /**
   * Used when the artwork URL cannot be loaded.
   */
  artworkError = false;

  private readonly subscriptions =
    new Subscription();

  constructor(
    private readonly mediaPlayerService:
      MediaPlayerService
  ) {}

  ngOnInit(): void {

    this.subscriptions.add(
      this.mediaPlayerService.currentMedia
        .subscribe(media => {

          this.updateState(
            media,
            this.mediaPlayerService.isPlayingValue
          );

        })
    );

    this.subscriptions.add(
      this.mediaPlayerService.isPlaying
        .subscribe(isPlaying => {

          this.updateState(
            this.mediaPlayerService.currentMediaValue,
            isPlaying
          );

        })
    );

  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['video']) {

      this.artworkError = false;

      this.updateState(
        this.mediaPlayerService.currentMediaValue,
        this.mediaPlayerService.isPlayingValue
      );

    }

  }

  /**
   * Play or pause this video.
   */
  playVideo(): void {

    if (!this.video?.url) {

      console.warn(
        'Gaza Stream: Video has no URL:',
        this.video
      );

      return;
    }

    const provider =
      String(
        (this.video as any).videoProvider ??
        (this.video as any).provider ??
        ''
      )
        .trim()
        .toLowerCase();

    const isYouTube =
      provider === 'youtube';

    const isVideo =
      this.video.type === MediaType.Video ||
      isYouTube;

    if (!isVideo) {

      console.warn(
        'Gaza Stream: MediaItem is not a video:',
        this.video
      );

      return;
    }

    /**
     * If this card is already active,
     * toggle pause/resume.
     */
    if (this.isActive) {

      if (
        this.mediaPlayerService.isPlayingValue
      ) {

        this.mediaPlayerService.pause();

      } else {

        this.mediaPlayerService.resume();

      }

      return;
    }

    /**
     * Start a completely different video.
     */
    this.mediaPlayerService.play({
      ...this.video,
      type: MediaType.Video
    });

  }

  /**
   * Artwork failed to load.
   */
  onArtworkError(): void {

    this.artworkError = true;

  }

  /**
   * Play/pause icon.
   */
  get playIcon(): string {

    return this.isPlaying
      ? 'fa-pause'
      : 'fa-play';

  }

  /**
   * Returns the duration in a readable format.
   */
  get durationLabel(): string {

    const duration =
      this.video?.duration;

    if (
      duration === undefined ||
      duration === null ||
      !Number.isFinite(duration) ||
      duration < 0
    ) {

      return '';

    }

    return this.formatDuration(duration);

  }

  /**
   * Artwork URL.
   *
   * The VideoService should normally populate
   * artwork automatically from YouTube.
   *
   * This getter also supports a YouTube fallback
   * directly from the video URL.
   */
  get artworkUrl(): string | null {

    if (
      this.video?.artwork &&
      this.video.artwork.trim()
    ) {

      return this.video.artwork.trim();

    }

    const youtubeId =
      this.getYoutubeVideoId(
        this.video?.url
      );

    if (!youtubeId) {

      return null;

    }

    return (
      `https://img.youtube.com/vi/` +
      `${youtubeId}/hqdefault.jpg`
    );

  }

  /**
   * Detect whether the video has artwork.
   */
  get hasArtwork(): boolean {

    return !!(
      this.artworkUrl &&
      !this.artworkError
    );

  }

  /**
   * Provider label.
   */
  get providerLabel(): string {

    const provider =
      String(
        (this.video as any)?.videoProvider ??
        (this.video as any)?.provider ??
        ''
      )
        .trim()
        .toLowerCase();

    if (provider === 'youtube') {

      return 'YouTube';

    }

    return 'Video';

  }

  /**
   * Provider icon.
   */
  get providerIcon(): string {

    const provider =
      String(
        (this.video as any)?.videoProvider ??
        (this.video as any)?.provider ??
        ''
      )
        .trim()
        .toLowerCase();

    if (provider === 'youtube') {

      return 'fa-brands fa-youtube';

    }

    return 'fa-solid fa-video';

  }

  private updateState(
    media: MediaItem | null,
    isPlaying: boolean
  ): void {

    this.isActive = (
      !!media &&
      !!this.video &&
      media.id === this.video.id &&
      media.type === this.video.type
    );

    this.isPlaying = (
      this.isActive &&
      isPlaying
    );

  }

  private formatDuration(
    seconds: number
  ): string {

    if (
      !Number.isFinite(seconds) ||
      seconds < 0
    ) {

      return '0:00';

    }

    const hours =
      Math.floor(seconds / 3600);

    const minutes =
      Math.floor(
        (seconds % 3600) / 60
      );

    const remainingSeconds =
      Math.floor(seconds % 60)
        .toString()
        .padStart(2, '0');

    if (hours > 0) {

      return (
        `${hours}:` +
        `${minutes.toString().padStart(2, '0')}:` +
        remainingSeconds
      );

    }

    return (
      `${minutes}:` +
      remainingSeconds
    );

  }

  /**
   * Extract YouTube video ID from:
   *
   * https://youtube.com/watch?v=XXXXXXXXXXX
   * https://youtu.be/XXXXXXXXXXX
   * https://youtube.com/embed/XXXXXXXXXXX
   * https://youtube.com/shorts/XXXXXXXXXXX
   */
  private getYoutubeVideoId(
    url?: string
  ): string | null {

    if (!url) {

      return null;

    }

    const value =
      url.trim();

    if (
      /^[a-zA-Z0-9_-]{11}$/.test(value)
    ) {

      return value;

    }

    try {

      const parsed =
        new URL(value);

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

  ngOnDestroy(): void {

    this.subscriptions.unsubscribe();

  }

}
