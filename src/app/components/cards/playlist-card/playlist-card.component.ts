import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Playlist } from 'src/app/models/playlist';

@Component({
  selector: 'app-playlist-card',
  templateUrl: './playlist-card.component.html',
  styleUrls: ['./playlist-card.component.css'],
  standalone: false,
})
export class PlaylistCardComponent {
  @Input()
  playlist!: Playlist;

  @Input()
  isPlaying = false;

  @Output()
  play = new EventEmitter<Playlist>();

  @Output()
  open = new EventEmitter<Playlist>();

  /* ============================================================
     PLAY
     ============================================================ */

  onPlay(event: Event): void {
    event.stopPropagation();

    this.play.emit(this.playlist);
  }

  /* ============================================================
     OPEN
     ============================================================ */

  onOpen(): void {
    this.open.emit(this.playlist);
  }

  /* ============================================================
     OPEN BUTTON
     ============================================================ */

  onOpenFromButton(event: Event): void {
    event.stopPropagation();

    this.open.emit(this.playlist);
  }
}
