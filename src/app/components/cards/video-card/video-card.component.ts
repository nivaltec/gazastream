import {
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  Subscription
} from 'rxjs';

import {
  MediaItem
} from 'src/app/models/media-item';

import {
  MediaType
} from 'src/app/models/media-type-enum';

import {
  MediaPlayerService
} from 'src/app/services/media-player-service';


@Component({
  selector: 'app-video-card',

  templateUrl:
    './video-card.component.html',

  styleUrls:
    ['./video-card.component.css'],

  standalone: false
})
export class VideoCardComponent
  implements OnInit, OnDestroy {


  // ============================================================
  // INPUT
  // ============================================================

  @Input()
  video!: MediaItem;


  // ============================================================
  // STATE
  // ============================================================

  isActive = false;

  isPlaying = false;


  // ============================================================
  // SUBSCRIPTIONS
  // ============================================================

  private readonly subscriptions =
    new Subscription();


  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(
    private readonly mediaPlayerService:
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

      this.mediaPlayerService.currentMedia
        .subscribe(media => {

          this.updateState(
            media,
            this.mediaPlayerService.isPlayingValue
          );

        })

    );


    // ----------------------------------------------------------
    // PLAYING STATE
    // ----------------------------------------------------------

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


  // ============================================================
  // PLAY VIDEO
  // ============================================================
playVideo(): void {

  if (!this.video?.url) {

    console.warn(
      'Gaza Stream: Video has no URL:',
      this.video
    );

    return;

  }


  // ============================================================
  // DETERMINE WHETHER THIS IS A VIDEO
  // ============================================================

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


  // ============================================================
  // CURRENT VIDEO
  // ============================================================

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


  // ============================================================
  // START VIDEO
  // ============================================================

  this.mediaPlayerService.play({

    ...this.video,

    type: MediaType.Video

  });

}


  // ============================================================
  // PLAY ICON
  // ============================================================

  get playIcon(): string {

    return this.isPlaying
      ? 'fa-pause'
      : 'fa-play';

  }


  // ============================================================
  // DURATION
  // ============================================================

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


    return this.formatDuration(
      duration
    );

  }


  // ============================================================
  // UPDATE STATE
  // ============================================================

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


  // ============================================================
  // FORMAT DURATION
  // ============================================================

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
      )
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
        remainingSeconds
      );

    }


    return (
      `${minutes}:` +
      remainingSeconds
    );

  }


  // ============================================================
  // DESTROY
  // ============================================================

  ngOnDestroy(): void {

    this.subscriptions.unsubscribe();

  }

}
