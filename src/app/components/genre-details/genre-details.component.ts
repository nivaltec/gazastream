import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Genre } from 'src/app/models/genre';
import { MediaItem } from 'src/app/models/media-item';
import { MusicService } from 'src/app/services/music-service';

@Component({
  selector: 'app-genre-details',
  templateUrl: './genre-details.component.html',
  styleUrl: './genre-details.component.css',
  standalone: false,
})
export class GenreDetailsComponent implements OnInit {

  genreName = '';
  genre: Genre | null = null;
  tracks: MediaItem[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly musicService: MusicService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const genreName = params.get('genreName');

      if (!genreName) {
        return;
      }

      this.genreName = genreName;

      this.tracks = this.musicService
        .getTracks()
        .filter(
          (track) =>
            track.genre?.trim().toLowerCase() ===
            genreName.trim().toLowerCase(),
        );

      this.genre = {
        id: genreName,
        name: genreName,
        artwork:  this.tracks[0]?.artwork ?? '',
        trackCount: this.tracks.length,
      };
    });
  }
}
