import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  DomSanitizer,
  SafeResourceUrl
} from '@angular/platform-browser';

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
  selector: 'app-media-player',
  templateUrl: './media-player.component.html',
  styleUrls: ['./media-player.component.css'],
  standalone: false
})
export class MediaPlayerComponent
  implements OnInit, OnDestroy {

  // ============================================================
  // STATE
  // ============================================================

  currentMedia: MediaItem | null = null;

  isPlaying = false;

  currentTime = 0;

  duration = 0;

  volume = 1;

  isMuted = false;

  progress = 0;

  youtubeEmbedUrl: SafeResourceUrl | null = null;


  // ============================================================
  // SUBSCRIPTIONS
  // ============================================================

  private readonly subscriptions =
    new Subscription();


  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(
    private readonly sanitizer: DomSanitizer,

    public readonly playerService:
      MediaPlayerService
  ) {}


  // ============================================================
  // INIT
  // ============================================================

  ngOnInit(): void {

    // ----------------------------------------------------------
    // CURRENT MEDIA
    // ----------------------------------------------------------

    this.subscriptions.add(

      this.playerService.currentMedia
        .subscribe(media => {

          this.currentMedia = media;

          this.youtubeEmbedUrl =
            this.createYouTubeUrl(
              media?.url
            );

          this.updateProgress();

        })

    );


    // ----------------------------------------------------------
    // PLAYING
    // ----------------------------------------------------------

    this.subscriptions.add(

      this.playerService.isPlaying
        .subscribe(playing => {

          this.isPlaying =
            !!this.currentMedia &&
            playing;

        })

    );


    // ----------------------------------------------------------
    // CURRENT TIME
    // ----------------------------------------------------------

    this.subscriptions.add(

      this.playerService.currentTime
        .subscribe(time => {

          this.currentTime =
            Number.isFinite(time)
              ? time
              : 0;

          this.updateProgress();

        })

    );


    // ----------------------------------------------------------
    // DURATION
    // ----------------------------------------------------------

    this.subscriptions.add(

      this.playerService.duration
        .subscribe(duration => {

          this.duration =
            Number.isFinite(duration)
              ? duration
              : 0;

          this.updateProgress();

        })

    );


    // ----------------------------------------------------------
    // VOLUME
    // ----------------------------------------------------------

    this.subscriptions.add(

      this.playerService.volume
        .subscribe(volume => {

          this.volume =
            Number.isFinite(volume)
              ? Math.min(
                  1,
                  Math.max(
                    0,
                    volume
                  )
                )
              : 1;

          this.isMuted =
            this.volume <= 0;

        })

    );

  }


  // ============================================================
  // VIDEO
  // ============================================================

  get isVideo(): boolean {

    return (
      this.currentMedia?.type ===
      MediaType.Video
    );

  }


  // ============================================================
  // YOUTUBE URL
  // ============================================================

  private createYouTubeUrl(
    url: string | undefined
  ): SafeResourceUrl | null {

    if (!url) {
      return null;
    }

    const videoId =
      this.extractYouTubeId(url);

    if (!videoId) {
      return null;
    }

    const embedUrl =
      `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0`;

    return this.sanitizer
      .bypassSecurityTrustResourceUrl(
        embedUrl
      );

  }


  // ============================================================
  // YOUTUBE ID
  // ============================================================

  private extractYouTubeId(
    url: string
  ): string | null {

    try {

      const parsed =
        new URL(url);

      const hostname =
        parsed.hostname
          .toLowerCase()
          .replace(
            /^www\./,
            ''
          );


      // --------------------------------------------------------
      // youtu.be
      // --------------------------------------------------------

      if (
        hostname === 'youtu.be'
      ) {

        return parsed.pathname
          .substring(1)
          .split('/')[0]
          .trim() || null;

      }


      // --------------------------------------------------------
      // youtube.com
      // --------------------------------------------------------

      if (
        hostname === 'youtube.com' ||
        hostname === 'm.youtube.com'
      ) {

        // /watch?v=VIDEO_ID

        if (
          parsed.pathname === '/watch'
        ) {

          return (
            parsed.searchParams
              .get('v')
              ?.trim() || null
          );

        }


        // /embed/VIDEO_ID

        if (
          parsed.pathname
            .startsWith('/embed/')
        ) {

          return parsed.pathname
            .split('/')[2]
            ?.trim() || null;

        }


        // /shorts/VIDEO_ID

        if (
          parsed.pathname
            .startsWith('/shorts/')
        ) {

          return parsed.pathname
            .split('/')[2]
            ?.trim() || null;

        }

      }

    } catch {

      return null;

    }

    return null;

  }


  // ============================================================
  // PLAY / PAUSE
  // ============================================================

  togglePlay(): void {

    if (!this.currentMedia) {
      return;
    }

    if (this.isPlaying) {

      this.playerService.pause();

      return;
    }

    this.playerService.resume();

  }


  // ============================================================
  // SEEK
  // ============================================================

  seek(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    const percentage =
      Number(input.value);

    if (!Number.isFinite(percentage)) {
      return;
    }

    this.playerService.seekToPercentage(
      Math.min(
        100,
        Math.max(
          0,
          percentage
        )
      )
    );

  }


  // ============================================================
  // VOLUME
  // ============================================================

  changeVolume(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    const value =
      Number(input.value);

    if (!Number.isFinite(value)) {
      return;
    }

    this.playerService.setVolume(
      Math.min(
        1,
        Math.max(
          0,
          value
        )
      )
    );

  }


  // ============================================================
  // MUTE
  // ============================================================

  toggleMute(): void {

    if (this.isMuted) {

      this.playerService.setVolume(
        this.volume > 0
          ? this.volume
          : 1
      );

      return;
    }

    this.playerService.setVolume(0);

  }


  // ============================================================
  // CLOSE
  // ============================================================

  close(): void {

    this.playerService.clear();

  }


  // ============================================================
  // PROGRESS
  // ============================================================

  private updateProgress(): void {

    if (
      !this.duration ||
      !Number.isFinite(this.duration) ||
      this.duration <= 0
    ) {

      this.progress = 0;

      return;

    }

    this.progress =
      Math.min(
        100,
        Math.max(
          0,
          (
            this.currentTime /
            this.duration
          ) * 100
        )
      );

  }


  // ============================================================
  // FORMAT TIME
  // ============================================================

  formatTime(seconds: number): string {

    if (
      !Number.isFinite(seconds) ||
      seconds < 0
    ) {

      return '0:00';

    }

    const hours =
      Math.floor(
        seconds / 3600
      );

    const minutes =
      Math.floor(
        (seconds % 3600) / 60
      );

    const remainingSeconds =
      Math.floor(
        seconds % 60
      );

    const formattedSeconds =
      remainingSeconds
        .toString()
        .padStart(
          2,
          '0'
        );

    if (hours > 0) {

      return (
        `${hours}:` +
        `${minutes
          .toString()
          .padStart(2, '0')}:` +
        formattedSeconds
      );

    }

    return (
      `${minutes}:` +
      formattedSeconds
    );

  }

closeVideo(): void {
  this.playerService.pause();
  this.youtubeEmbedUrl = null;
  this.playerService.clear();
}

  // ============================================================
  // DESTROY
  // ============================================================

  ngOnDestroy(): void {

    this.subscriptions.unsubscribe();

  }

}
