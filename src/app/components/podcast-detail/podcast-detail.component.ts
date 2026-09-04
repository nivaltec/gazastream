import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MediaItem } from 'src/app/models/media-item';
import { MediaType } from 'src/app/enums/media-type-enum';
import { PodcastService } from 'src/app/services/podcast-service';

type PodcastFilter = 'all' | 'audio' | 'video';

@Component({
  selector: 'app-podcast-detail',
  templateUrl: './podcast-detail.component.html',
  styleUrls: ['./podcast-detail.component.css'],
  standalone: false,
})
export class PodcastDetailComponent implements OnInit, OnDestroy {

  podcast?: MediaItem;
  podcastMedia: MediaItem[] = [];
  filteredMedia: MediaItem[] = [];
  activeFilter: PodcastFilter = 'all';

  isLoading = true;
  public readonly MediaType = MediaType;
  private routeSubscription?: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly podcastService: PodcastService,
  ) {}


  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (!id) {
        return;
      }

      this.loadPodcast(id);
    });
  }

  // ============================================================
  // LOAD PODCAST
  // ============================================================

  private loadPodcast(id: string): void {
    this.isLoading = true;

    this.podcast = this.podcastService.getPodcastById(id);

    if (!this.podcast) {
      this.podcastMedia = [];

      this.filteredMedia = [];

      this.isLoading = false;

      return;
    }

    /*
     * Get every audio/video item belonging
     * to this podcast.
     */

    this.podcastMedia = this.podcastService.getPodcastMedia(this.podcast);

    this.applyFilter();

    this.isLoading = false;
  }

  // ============================================================
  // FILTER
  // ============================================================

  setFilter(filter: PodcastFilter): void {
    this.activeFilter = filter;

    this.applyFilter();
  }

  private applyFilter(): void {
    if (this.activeFilter === 'audio') {
      this.filteredMedia = this.podcastMedia.filter(
        (media) => media.type === MediaType.Audio,
      );

      return;
    }

    if (this.activeFilter === 'video') {
      this.filteredMedia = this.podcastMedia.filter(
        (media) => media.type === MediaType.Video,
      );

      return;
    }

    this.filteredMedia = [...this.podcastMedia];
  }

  // ============================================================
  // COUNTS
  // ============================================================

  get audioCount(): number {
    return this.podcastMedia.filter((media) => media.type === MediaType.Audio)
      .length;
  }

  get videoCount(): number {
    return this.podcastMedia.filter((media) => media.type === MediaType.Video)
      .length;
  }

  // ============================================================
  // DESTROY
  // ============================================================

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }
}
