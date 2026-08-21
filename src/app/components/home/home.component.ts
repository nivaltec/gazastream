import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Genre } from 'src/app/models/genre';
import { MusicService } from 'src/app/services/music-service';
import { VideoService } from 'src/app/services/video-service';
import { PodcastService } from 'src/app/services/podcast-service';
import { MediaPlayerService } from 'src/app/services/media-player-service';
import { MediaItem } from 'src/app/models/media-item';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  // ============================================================
  // DATA
  // ============================================================

  trendingAudio: MediaItem[] = [];
  genres: Genre[] = [];
  videos: any[] = [];
  trendingVideos: any[] = [];
  podcasts: any[] = [];

  // ============================================================
  // PLAYER
  // ============================================================

  isPlaying = false;

  currentMedia: MediaItem | null = null;

  // ============================================================
  // SUBSCRIPTIONS
  // ============================================================

  private readonly subscriptions = new Subscription();

  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(
    private readonly musicService: MusicService,
    private readonly videoService: VideoService,
    private readonly podcastService: PodcastService,
    private readonly playerService: MediaPlayerService,
    private readonly router: Router
  ) {}

  // ============================================================
  // INIT
  // ============================================================

  ngOnInit(): void {
    // ----------------------------------------------------------
    // TRENDING AUDIO
    // ----------------------------------------------------------

    this.trendingAudio = this.musicService.getTrendingTracks();

    // ----------------------------------------------------------
    // POPULAR GENRES
    // ----------------------------------------------------------

    this.genres = this.musicService.getPopularGenres(5);

    // ----------------------------------------------------------
    // VIDEOS
    // ----------------------------------------------------------

    this.videos = this.videoService.getTrendingVideos();

    this.trendingVideos = this.videoService.getTrendingVideos();

    // ----------------------------------------------------------
    // PODCASTS
    // ----------------------------------------------------------

    this.podcasts = this.podcastService.getTrendingPodcasts();

    // ----------------------------------------------------------
    // PLAYER STATE
    // ----------------------------------------------------------

    this.subscribeToPlayer();
  }

  // ============================================================
  // PLAYER STATE
  // ============================================================

  private subscribeToPlayer(): void {
    // ----------------------------------------------------------
    // CURRENT MEDIA
    // ----------------------------------------------------------

    this.subscriptions.add(
      this.playerService.currentMedia.subscribe((media) => {
        this.currentMedia = media;

        this.updatePlayingState(media);
      }),
    );

    // ----------------------------------------------------------
    // PLAYING STATE
    // ----------------------------------------------------------

    this.subscriptions.add(
      this.playerService.isPlaying.subscribe((isPlaying) => {
        this.isPlaying = !!this.currentMedia && isPlaying;
      }),
    );
  }

  // ============================================================
  // UPDATE PLAYING STATE
  // ============================================================

  private updatePlayingState(media: MediaItem | null): void {
    this.isPlaying = !!media && this.playerService.isPlayingValue;
  }

  // ============================================================
  // PLAY FEATURED
  // ============================================================

  playFeatured(): void {
    const track = this.trendingAudio[0];

    if (!track?.url) {
      console.warn('Gaza Stream: Featured track has no media URL.', track);

      return;
    }

    // ----------------------------------------------------------
    // SAME MEDIA
    // ----------------------------------------------------------

    if (this.playerService.currentMediaValue?.id === track.id) {
      if (this.playerService.isPlayingValue) {
        this.playerService.pause();
      } else {
        this.playerService.resume();
      }

      return;
    }

    // ----------------------------------------------------------
    // NEW MEDIA
    // ----------------------------------------------------------

    this.playerService.play(track);
  }

  // ============================================================
  // CHECK FEATURED PLAYING
  // ============================================================

  isFeaturedPlaying(): boolean {
    const track = this.trendingAudio[0];

    if (!track) {
      return false;
    }

    return (
      this.playerService.currentMediaValue?.id === track.id &&
      this.playerService.isPlayingValue
    );
  }

  // ============================================================
  // GENRE NAVIGATION
  // ============================================================

  onGenreSelected(genre: Genre): void {
    if (!genre) {
      return;
    }

    this.router.navigate(['/genre', genre.name]);
  }

  // ============================================================
  // DESTROY
  // ============================================================

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
