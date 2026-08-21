import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MediaIcon } from 'src/app/models/media-icon-enum';
import { MediaItem } from 'src/app/models/media-item';
import { MediaType } from 'src/app/models/media-type-enum';
import { RadioStation } from 'src/app/models/radio-station';
import { MediaPlayerService } from 'src/app/services/media-player-service';
import { RadioService } from 'src/app/services/radio-service';


@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.css'],
  standalone: false,
})
export class RadioComponent implements OnInit, OnDestroy {

  featuredStations: any[] = [];

  recentlyPlayed: MediaItem[] = [];
  selectedStation: RadioStation | null = null;
  isLoading = false;
  errorMessage = '';

  currentTrack: MediaItem | null = null;
  isPlaying = false;

  private readonly destroy$ = new Subject<void>();


  constructor(
    private readonly radioService: RadioService,
    private readonly playerService: MediaPlayerService,
  ) {}

  ngOnInit(): void {
    this.loadStations();

    this.subscribeToPlayer();
  }

  /* ============================================================
     LOAD RADIO STATIONS
     ============================================================ */

  private loadStations(): void {
    this.isLoading = true;

    this.errorMessage = '';

    try {
      this.featuredStations = this.radioService.getStations();

      this.isLoading = false;
    } catch (error) {
      console.error('Gaza Stream: Failed to load radio stations:', error);

      this.featuredStations = [];

      this.errorMessage = 'Unable to load radio stations.';

      this.isLoading = false;
    }
  }

  /* ============================================================
     PLAYER STATE
     ============================================================ */

  private subscribeToPlayer(): void {
    /* ----------------------------------------------------------
       CURRENT MEDIA
    ---------------------------------------------------------- */

    this.playerService.currentMedia

      .pipe(takeUntil(this.destroy$))

      .subscribe((media) => {
        this.currentTrack = media;

        /*
         * Only select a station when
         * the currently playing media
         * is actually radio.
         */

        if (media && media.type === MediaType.Radio) {
          this.selectedStation =
            this.featuredStations.find((station) => station.id === media.id) ??
            null;
        } else {
          this.selectedStation = null;
        }
      });

    /* ----------------------------------------------------------
       PLAYING STATE
    ---------------------------------------------------------- */

    this.playerService.isPlaying

      .pipe(takeUntil(this.destroy$))

      .subscribe((isPlaying) => {
        this.isPlaying = isPlaying;
      });
  }

  /* ============================================================
     PLAY RADIO STATION
     ============================================================ */

  playStation(station: RadioStation): void {
    if (!station?.streamUrl) {
      console.warn(
        `Gaza Stream: No stream URL configured for ${station?.name}`,
      );

      return;
    }

    /* ----------------------------------------------------------
       SAME STATION
    ---------------------------------------------------------- */

    if (this.isStationCurrent(station)) {
      if (this.isPlaying) {
        this.playerService.pause();
      } else {
        this.playerService.resume();
      }

      return;
    }

    /* ----------------------------------------------------------
       CONVERT RADIO TO MEDIA ITEM
    ---------------------------------------------------------- */

    const track: MediaItem = {
      id: station.id,
      title: station.name,
      artist: station.name,
      artwork: station.artwork,
      url: station.streamUrl,
      type: MediaType.Radio,
      isLive: true,
      mediaIcon: MediaIcon.Radio,
    };

    /* ----------------------------------------------------------
       PLAY THROUGH SHARED PLAYER
    ---------------------------------------------------------- */

    this.playerService.play(track);

    /* ----------------------------------------------------------
       SELECT STATION
    ---------------------------------------------------------- */

    this.selectedStation = station;

    /* ----------------------------------------------------------
       RECENTLY PLAYED
    ---------------------------------------------------------- */

    this.addToRecentlyPlayed(track);
  }

  /* ============================================================
     CHECK CURRENT STATION
     ============================================================ */

  isStationCurrent(station: RadioStation): boolean {
    const currentMedia = this.playerService.currentMediaValue;

    return (
      !!currentMedia &&
      currentMedia.type === MediaType.Radio &&
      currentMedia.id === station.id
    );
  }

  /* ============================================================
     CHECK WHETHER STATION IS PLAYING
     ============================================================ */

  isStationPlaying(station: RadioStation): boolean {
    return this.isStationCurrent(station) && this.isPlaying;
  }

  /* ============================================================
     RECENTLY PLAYED
     ============================================================ */

  private addToRecentlyPlayed(track: MediaItem): void {
    this.recentlyPlayed = this.recentlyPlayed.filter(
      (item) => item.id !== track.id,
    );

    this.recentlyPlayed.unshift(track);

    /*
     * Keep latest 10.
     */

    this.recentlyPlayed = this.recentlyPlayed.slice(0, 10);
  }

  /* ============================================================
     FAVOURITES
     ============================================================ */

  addToFavourites(station: RadioStation): void {
    console.log('Gaza Stream: Add radio station to favourites:', station);
  }

  /* ============================================================
     RETRY
     ============================================================ */

  retry(): void {
    this.loadStations();
  }

  /* ============================================================
     DESTROY
     ============================================================ */

  ngOnDestroy(): void {
    this.destroy$.next();

    this.destroy$.complete();
  }
}
