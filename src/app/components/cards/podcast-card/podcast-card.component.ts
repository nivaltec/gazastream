import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MediaItem } from 'src/app/models/media-item';

@Component({
  selector: 'app-podcast-card',
  templateUrl: './podcast-card.component.html',
  styleUrls: ['./podcast-card.component.css'],
  standalone: false,
})
export class PodcastCardComponent {
  @Input()
  podcast!: MediaItem;

  constructor(private readonly router: Router) {}

  openPodcast(): void {
    if (!this.podcast?.id) {
      return;
    }

    this.router.navigate(['/podcast', this.podcast.id]);
  }
}
