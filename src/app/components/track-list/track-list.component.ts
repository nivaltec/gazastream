import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';

import {
  Subject,
  takeUntil
} from 'rxjs';

import {
  MediaItem
} from 'src/app/models/media-item';

import {
  MediaPlayerService
} from 'src/app/services/media-player-service';


@Component({
  selector: 'app-track-list',

  templateUrl:
    './track-list.component.html',

  styleUrls:
    ['./track-list.component.css'],

  standalone: false
})
export class TrackListComponent
  implements OnInit, OnDestroy {


  // ============================================================
  // INPUT
  // ============================================================

  @Input()
  tracks: MediaItem[] = [];


  // ============================================================
  // OUTPUT
  // ============================================================

  @Output()
  trackPlay =
    new EventEmitter<MediaItem>();


  // ============================================================
  // STATE
  // ============================================================

  currentTrack:
    MediaItem | null = null;


  isPlaying =
    false;


  // ============================================================
  // DESTROY
  // ============================================================

  private readonly destroy$ =
    new Subject<void>();


  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(
    private readonly playerService:
      MediaPlayerService
  ) {}


  // ============================================================
  // INIT
  // ============================================================

  ngOnInit(): void {

    this.subscribeToPlayer();

  }


  // ============================================================
  // PLAYER SUBSCRIPTIONS
  // ============================================================

  private subscribeToPlayer(): void {

    // ----------------------------------------------------------
    // CURRENT MEDIA
    // ----------------------------------------------------------

    this.playerService.currentMedia

      .pipe(
        takeUntil(this.destroy$)
      )

      .subscribe(media => {

        this.currentTrack =
          media;


        this.updatePlayingState();

      });


    // ----------------------------------------------------------
    // PLAYING STATE
    // ----------------------------------------------------------

    this.playerService.isPlaying

      .pipe(
        takeUntil(this.destroy$)
      )

      .subscribe(isPlaying => {

        this.isPlaying =
          isPlaying;


        this.updatePlayingState();

      });

  }


  // ============================================================
  // UPDATE PLAYING STATE
  // ============================================================

  private updatePlayingState(): void {

    const currentMedia =
      this.playerService
        .currentMediaValue;


    if (!currentMedia) {

      this.currentTrack =
        null;

      this.isPlaying =
        false;

      return;

    }


    this.currentTrack =
      currentMedia;


    this.isPlaying =
      this.playerService
        .isPlayingValue;

  }


  // ============================================================
  // PLAY TRACK
  // ============================================================

  playTrack(
    track: MediaItem,
    event?: Event
  ): void {

    event?.stopPropagation();


    if (
      !track?.url
    ) {

      console.warn(
        'Gaza Stream: Track has no media URL.',
        track
      );

      return;

    }


    // ----------------------------------------------------------
    // SAME TRACK
    // ----------------------------------------------------------

    if (
      this.isCurrentTrack(track)
    ) {

      if (
        this.playerService
          .isPlayingValue
      ) {

        this.playerService.pause();

      } else {

        this.playerService.resume();

      }

      return;

    }


    // ----------------------------------------------------------
    // DIFFERENT TRACK
    // ----------------------------------------------------------

    this.playerService.play(
      {
        ...track
      }
    );


    // ----------------------------------------------------------
    // OUTPUT
    // ----------------------------------------------------------

    this.trackPlay.emit(
      track
    );

  }


  // ============================================================
  // CHECK CURRENT TRACK
  // ============================================================

  isCurrentTrack(
    track: MediaItem
  ): boolean {

    const currentMedia =
      this.playerService
        .currentMediaValue;


    return !!currentMedia &&
      currentMedia.id === track.id &&
      currentMedia.type === track.type;

  }


  // ============================================================
  // CHECK PLAYING
  // ============================================================

  isTrackPlaying(
    track: MediaItem
  ): boolean {

    return (
      this.isCurrentTrack(track) &&
      this.playerService.isPlayingValue
    );

  }


  // ============================================================
  // FORMAT DURATION
  // ============================================================

  formatDuration(
    duration?: number
  ): string {

    if (
      duration === undefined ||
      duration === null ||
      !Number.isFinite(duration) ||
      duration <= 0
    ) {

      return '--:--';

    }


    const totalSeconds =
      Math.floor(duration);


    const minutes =
      Math.floor(
        totalSeconds / 60
      );


    const seconds =
      totalSeconds % 60;


    return (
      `${minutes}:` +
      `${seconds
        .toString()
        .padStart(2, '0')}`
    );

  }


  // ============================================================
  // DESTROY
  // ============================================================

  ngOnDestroy(): void {

    this.destroy$.next();

    this.destroy$.complete();

  }

}
