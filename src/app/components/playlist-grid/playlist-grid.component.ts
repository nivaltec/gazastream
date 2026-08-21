import {Component,EventEmitter,Input,Output} from '@angular/core';
import { Playlist } from 'src/app/models/playlist';

@Component({
  selector: 'app-playlist-grid',
  templateUrl: './playlist-grid.component.html',
  styleUrls: ['./playlist-grid.component.css'],
  standalone: false
})
export class PlaylistGridComponent {

  @Input()
  playlists: Playlist[] = [];


  @Output()
  playlistPlay = new EventEmitter<Playlist>();


  @Output()
  playlistOpen = new EventEmitter<Playlist>();


  playPlaylist(playlist: Playlist): void {

    this.playlistPlay.emit(playlist);

  }


  openPlaylist(playlist: Playlist): void {

    this.playlistOpen.emit(playlist);

  }

}