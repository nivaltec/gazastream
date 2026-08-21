import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MediaItem } from 'src/app/models/media-item';
import { MediaPlayerService } from 'src/app/services/media-player-service';

@Component({
  selector: 'app-audio-card',
  templateUrl: './audio-card.component.html',
  styleUrls: ['./audio-card.component.css'],
  standalone: false,
})
export class AudioCardComponent implements OnInit, OnDestroy {
  // ============================================================
  // INPUT
  // ============================================================

  @Input()
  audio!: MediaItem;

  // ============================================================
  // STATE
  // ============================================================

  isPlaying = false;

  // ============================================================
  // SUBSCRIPTIONS
  // ============================================================

  private readonly subscriptions = new Subscription();

  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(
    private readonly playerService: MediaPlayerService,
    private readonly router: Router,
  ) {}

  // ============================================================
  // INIT
  // ============================================================

  ngOnInit(): void {
    // ----------------------------------------------------------
    // CURRENT MEDIA
    // ----------------------------------------------------------

    this.subscriptions.add(
      this.playerService.currentMedia.subscribe((media) => {
        this.updatePlayingState(media, this.playerService.isPlayingValue);
      }),
    );

    // ----------------------------------------------------------
    // PLAYING STATE
    // ----------------------------------------------------------

    this.subscriptions.add(
      this.playerService.isPlaying.subscribe((isPlaying) => {
        this.updatePlayingState(
          this.playerService.currentMediaValue,
          isPlaying,
        );
      }),
    );
  }

  // ============================================================
  // PLAY / PAUSE
  // ============================================================

  togglePlay(event: Event): void {
    event.stopPropagation();

    if (!this.audio?.url) {
      console.warn('Gaza Stream: Audio has no URL:', this.audio);

      return;
    }

    // ----------------------------------------------------------
    // SAME AUDIO
    // ----------------------------------------------------------

    if (this.isCurrentAudio()) {
      if (this.playerService.isPlayingValue) {
        this.playerService.pause();
      } else {
        this.playerService.resume();
      }

      return;
    }

    // ----------------------------------------------------------
    // DIFFERENT AUDIO
    // ----------------------------------------------------------

    this.playerService.play({
      ...this.audio,
    });
  }

  // ============================================================
  // OPEN AUDIO
  // ============================================================

  onOpen(): void {
    if (!this.audio?.id) {
      return;
    }

    this.router.navigate(['/music', this.audio.id], {
      state: {
        audio: this.audio,
      },
    });
  }

  // ============================================================
  // FAVOURITE
  // ============================================================

  toggleFavourite(event: Event): void {
    event.stopPropagation();

    if (!this.audio) {
      return;
    }

    this.audio.isFavourite = !this.audio.isFavourite;
  }

  // ============================================================
  // CURRENT AUDIO
  // ============================================================

  isCurrentAudio(): boolean {
    const current = this.playerService.currentMediaValue;

    if (!current || !this.audio) {
      return false;
    }

    return current.id === this.audio.id && current.type === this.audio.type;
  }

  // ============================================================
  // UPDATE PLAYING STATE
  // ============================================================

  private updatePlayingState(
    media: MediaItem | null,
    isPlaying: boolean,
  ): void {
    this.isPlaying =
      !!media &&
      !!this.audio &&
      media.id === this.audio.id &&
      media.type === this.audio.type &&
      isPlaying;
  }

  // ============================================================
  // DESTROY
  // ============================================================

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
