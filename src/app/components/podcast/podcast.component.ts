import { Component, OnInit } from '@angular/core';
import { MediaItem } from 'src/app/models/media-item';
import { PodcastService } from 'src/app/services/podcast-service';

@Component({
  selector: 'app-podcast',
  templateUrl: './podcast.component.html',
  styleUrl: './podcast.component.css',
  standalone: false
})
export class PodcastComponent implements OnInit {

  podcasts: MediaItem[] = [];

  constructor(private podcastService: PodcastService) {}

  ngOnInit(): void {
    this.loadPodcasts();
  }

  private loadPodcasts(): void {
    this.podcasts =  this.podcastService.getTrendingPodcasts();
  }

}
