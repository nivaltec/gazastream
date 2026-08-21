import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MediaItem } from 'src/app/models/media-item';
import { MediaPlayerService } from 'src/app/services/media-player-service';
import { MusicService } from 'src/app/services/music-service';

@Component({
  selector: 'app-audio-details',

  templateUrl: './audio-details.component.html',

  styleUrls: ['./audio-details.component.css'],

  standalone: false,
})
export class AudioDetailsComponent implements OnInit, OnDestroy {
  // ============================================================
  // AUDIO
  // ============================================================

  audio: MediaItem | null = null;

  // ============================================================
  // PLAYER STATE
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
    private readonly route: ActivatedRoute,

    private readonly router: Router,

    private readonly musicService: MusicService,

    public readonly playerService: MediaPlayerService,
  ) {}

  // ============================================================
  // INIT
  // ============================================================

  ngOnInit(): void {
    // ----------------------------------------------------------
    // ROUTE
    // ----------------------------------------------------------

    this.subscriptions.add(
      this.route.paramMap.subscribe((params) => {
        const id = params.get('id');

        if (!id) {
          this.audio = null;

          this.isPlaying = false;

          return;
        }

        this.audio = this.musicService.getTrackById(id) ?? null;

        this.updatePlayingState();
      }),
    );

    // ----------------------------------------------------------
    // CURRENT MEDIA
    // ----------------------------------------------------------

    this.subscriptions.add(
      this.playerService.currentMedia.subscribe(() => {
        this.updatePlayingState();
      }),
    );

    // ----------------------------------------------------------
    // PLAYING STATE
    // ----------------------------------------------------------

    this.subscriptions.add(
      this.playerService.isPlaying.subscribe(() => {
        this.updatePlayingState();
      }),
    );
  }

  // ============================================================
  // UPDATE PLAYING STATE
  // ============================================================

  private updatePlayingState(): void {
    if (!this.audio) {
      this.isPlaying = false;

      return;
    }

    const currentMedia = this.playerService.currentMediaValue;

    this.isPlaying =
      !!currentMedia &&
      currentMedia.id === this.audio.id &&
      this.playerService.isPlayingValue;
  }

  // ============================================================
  // PLAY / PAUSE
  // ============================================================

  togglePlay(): void {
    if (!this.audio?.url) {
      return;
    }

    // ----------------------------------------------------------
    // CURRENT AUDIO
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

    this.playerService.play(this.audio);
  }

  // ============================================================
  // PLAY
  // ============================================================

  play(): void {
    if (!this.audio?.url) {
      return;
    }

    this.playerService.play(this.audio);
  }

  // ============================================================
  // PAUSE
  // ============================================================

  pause(): void {
    if (!this.isCurrentAudio()) {
      return;
    }

    this.playerService.pause();
  }

  // ============================================================
  // RESUME
  // ============================================================

  resume(): void {
    if (!this.isCurrentAudio()) {
      return;
    }

    this.playerService.resume();
  }

  // ============================================================
  // CURRENT AUDIO
  // ============================================================

  isCurrentAudio(): boolean {
    if (!this.audio) {
      return false;
    }

    const currentMedia = this.playerService.currentMediaValue;

    return !!currentMedia && currentMedia.id === this.audio.id;
  }

  // ============================================================
  // FAVOURITE
  // ============================================================

  toggleFavourite(): void {
    if (!this.audio) {
      return;
    }

    this.musicService.toggleFavourite(this.audio.id);

    this.audio = this.musicService.getTrackById(this.audio.id) ?? null;
  }

  // ============================================================
  // GO BACK
  // ============================================================

  goBack(): void {
    this.router.navigate(['/']);
  }

  // ============================================================
  // DESTROY
  // ============================================================

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
