import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute
} from '@angular/router';

import {
  Subject,
  takeUntil
} from 'rxjs';

import {
  MediaItem
} from 'src/app/models/media-item';

import {
  Playlist
} from 'src/app/models/playlist';

import {
  MediaPlayerService
} from 'src/app/services/media-player-service';

import {
  PlaylistService
} from 'src/app/services/playlist-service';


@Component({
  selector: 'app-play-list',

  templateUrl:
    './play-list.component.html',

  styleUrls:
    ['./play-list.component.css'],

  standalone: false
})
export class PlaylistComponent
  implements OnInit, OnDestroy {


  // ============================================================
  // PLAYLIST
  // ============================================================

  playlist: Playlist | null = null;


  // ============================================================
  // TRACKS
  // ============================================================

  tracks: MediaItem[] = [];


  // ============================================================
  // STATE
  // ============================================================

  isLoading = true;

  isRefreshing = false;

  errorMessage = '';


  // ============================================================
  // CURRENT MEDIA
  // ============================================================

  selectedTrack: MediaItem | null = null;


  // ============================================================
  // ADD SONG MODAL
  // ============================================================

  /**
   * Controls the Add Song modal.
   *
   * false = modal hidden
   * true  = modal visible
   */
  showAddItemModal = false;


  // ============================================================
  // ROUTE PLAYLIST ID
  // ============================================================

  private playlistId: string | null = null;


  // ============================================================
  // DESTROY
  // ============================================================

  private readonly destroy$ =
    new Subject<void>();


  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(

    private readonly route:
      ActivatedRoute,

    private readonly playlistService:
      PlaylistService,

    private readonly playerService:
      MediaPlayerService

  ) {}


  // ============================================================
  // INIT
  // ============================================================

  ngOnInit(): void {

    // ==========================================================
    // ROUTE
    // ==========================================================

    this.route.paramMap

      .pipe(
        takeUntil(
          this.destroy$
        )
      )

      .subscribe(params => {

        const id =
          params.get('id');


        // ------------------------------------------------------
        // NO PLAYLIST ID
        // ------------------------------------------------------

        if (!id) {

          this.playlistId =
            null;

          this.playlist =
            null;

          this.tracks =
            [];

          this.errorMessage =
            'Playlist not found.';

          this.isLoading =
            false;

          return;

        }


        // ------------------------------------------------------
        // STORE ID
        // ------------------------------------------------------

        this.playlistId =
          id;


        // ------------------------------------------------------
        // CLOSE MODAL WHEN NAVIGATING
        // ------------------------------------------------------

        this.closeAddItem();


        // ------------------------------------------------------
        // LOAD PLAYLIST
        // ------------------------------------------------------

        this.loadPlaylist(
          id
        );

      });


    // ==========================================================
    // CURRENT MEDIA
    // ==========================================================

    this.playerService.currentMedia

      .pipe(
        takeUntil(
          this.destroy$
        )
      )

      .subscribe(media => {

        this.selectedTrack =
          media;

      });

  }


  // ============================================================
  // LOAD PLAYLIST
  // ============================================================

  private loadPlaylist(
    playlistId: string,
    showLoader = true
  ): void {

    if (!playlistId) {
      return;
    }


    // ----------------------------------------------------------
    // LOADING STATE
    // ----------------------------------------------------------

    if (showLoader) {

      this.isLoading =
        true;

    }

    else {

      this.isRefreshing =
        true;

    }


    this.errorMessage =
      '';


    // ----------------------------------------------------------
    // INITIAL LOAD
    // ----------------------------------------------------------

    if (showLoader) {

      this.playlist =
        null;

      this.tracks =
        [];

    }


    // ----------------------------------------------------------
    // GET PLAYLIST
    // ----------------------------------------------------------

    this.playlistService

      .getPlaylistWithTracks(
        playlistId
      )

      .pipe(
        takeUntil(
          this.destroy$
        )
      )

      .subscribe({

        // ======================================================
        // SUCCESS
        // ======================================================

        next: result => {

          // ----------------------------------------------------
          // PLAYLIST NOT FOUND
          // ----------------------------------------------------

          if (!result) {

            this.playlist =
              null;

            this.tracks =
              [];

            this.errorMessage =
              'Playlist not found.';

            this.isLoading =
              false;

            this.isRefreshing =
              false;

            return;

          }


          // ----------------------------------------------------
          // PLAYLIST
          // ----------------------------------------------------

          this.playlist =
            result.playlist;


          // ----------------------------------------------------
          // TRACKS
          // ----------------------------------------------------

          this.tracks =
            result.tracks ?? [];


          // ----------------------------------------------------
          // STATE
          // ----------------------------------------------------

          this.isLoading =
            false;

          this.isRefreshing =
            false;

        },


        // ======================================================
        // ERROR
        // ======================================================

        error: error => {

          console.error(
            'Gaza Stream: Failed to load playlist:',
            error
          );


          // ----------------------------------------------------
          // INITIAL LOAD ERROR
          // ----------------------------------------------------

          if (showLoader) {

            this.playlist =
              null;

            this.tracks =
              [];

            this.errorMessage =
              'Unable to load playlist.';

          }


          // ----------------------------------------------------
          // STATE
          // ----------------------------------------------------

          this.isLoading =
            false;

          this.isRefreshing =
            false;

        }

      });

  }


  // ============================================================
  // REFRESH
  // ============================================================

  refresh(): void {

    if (!this.playlistId) {
      return;
    }


    this.loadPlaylist(
      this.playlistId
    );

  }


  // ============================================================
  // IS USER PLAYLIST
  // ============================================================

  /**
   * Temporary behaviour:
   *
   * Every playlist is currently treated as a user playlist.
   *
   * Once your PlaylistService has the correct ownership logic,
   * replace this with:
   *
   * return this.playlistService.isUserPlaylist(
   *   this.playlist.id
   * );
   */
  get isUserPlaylist(): boolean {

    if (!this.playlist?.id) {
      return false;
    }


    return true;

  }


  // ============================================================
  // IS BUILT-IN PLAYLIST
  // ============================================================

  get isBuiltInPlaylist(): boolean {

    if (!this.playlist?.id) {
      return false;
    }


    return this.playlistService
      .isBuiltInPlaylist(
        this.playlist.id
      );

  }


  // ============================================================
  // EXISTING TRACK IDS
  // ============================================================

  /**
   * IDs of tracks already inside this playlist.
   *
   * These are passed to the Add Song modal so that songs
   * already in the playlist can be disabled/filtered.
   */
  get existingTrackIds(): string[] {

    return this.tracks

      .map(
        track =>
          track.id
      )

      .filter(
        (
          id
        ): id is string =>
          !!id
      );

  }


  // ============================================================
  // OPEN ADD SONG MODAL
  // ============================================================

// ============================================================
// OPEN ADD SONG MODAL
// ============================================================

openAddItem(): void {
  if (!this.playlist?.id) {
    return;
  }

  if (!this.isUserPlaylist) {
    return;
  }

  this.showAddItemModal = true;
}
  // ============================================================
  // CLOSE ADD SONG MODAL
  // ============================================================

  closeAddItem(): void {

    this.showAddItemModal =
      false;

  }


  // ============================================================
  // PLAYLIST ITEM ADDED
  // ============================================================

  onPlaylistItemAdded(
    media: MediaItem
  ): void {

    if (!media) {
      return;
    }

    // ----------------------------------------------------------
    // CLOSE MODAL
    // ----------------------------------------------------------

    this.closeAddItem();


    // ----------------------------------------------------------
    // REFRESH PLAYLIST
    // ----------------------------------------------------------

    if (!this.playlistId) {
      return;
    }


    this.loadPlaylist(
      this.playlistId,
      false
    );

  }


  // ============================================================
  // PLAY ALL
  // ============================================================

  playAll(): void {

    if (!this.tracks.length) {
      return;
    }


    const firstTrack =
      this.tracks[0];


    this.playTrack(
      firstTrack
    );

  }


  // ============================================================
  // SHUFFLE
  // ============================================================

  shufflePlaylist(): void {

    if (!this.tracks.length) {
      return;
    }


    const randomIndex =
      Math.floor(
        Math.random() *
        this.tracks.length
      );


    const randomTrack =
      this.tracks[randomIndex];


    this.playTrack(
      randomTrack
    );

  }


  // ============================================================
  // PLAY TRACK
  // ============================================================

  playTrack(
    track: MediaItem
  ): void {

    if (!track) {
      return;

    }


    // ----------------------------------------------------------
    // MEDIA URL
    // ----------------------------------------------------------

    if (!track.url) {
      return;

    }


    // ----------------------------------------------------------
    // SAME TRACK
    // ----------------------------------------------------------

    if (
      this.isCurrentTrack(
        track
      )
    ) {

      // --------------------------------------------------------
      // PAUSE
      // --------------------------------------------------------

      if (
        this.playerService
          .isPlayingValue
      ) {

        this.playerService.pause();

      }


      // --------------------------------------------------------
      // RESUME
      // --------------------------------------------------------

      else {

        this.playerService.resume();

      }


      return;

    }


    // ----------------------------------------------------------
    // PLAY THROUGH GLOBAL PLAYER
    // ----------------------------------------------------------

    this.playerService.play({
      ...track
    });

  }


  // ============================================================
  // IS CURRENT TRACK
  // ============================================================

  isCurrentTrack(
    track: MediaItem
  ): boolean {

    if (!track) {
      return false;
    }


    const current =
      this.playerService
        .currentMediaValue;


    if (!current) {
      return false;
    }


    return (

      current.id ===
        track.id &&

      current.type ===
        track.type

    );

  }


  // ============================================================
  // IS TRACK PLAYING
  // ============================================================

  isTrackPlaying(
    track: MediaItem
  ): boolean {

    if (!track) {
      return false;
    }


    return (

      this.isCurrentTrack(
        track
      ) &&

      this.playerService
        .isPlayingValue

    );

  }


  // ============================================================
  // TRACK COUNT
  // ============================================================

  get trackCount(): number {

    return this.tracks.length;

  }


  // ============================================================
  // PLAYLIST TITLE
  // ============================================================

  get playlistTitle(): string {

    return (

      this.playlist?.name ??
      'Playlist'

    );

  }


  // ============================================================
  // PLAYLIST DESCRIPTION
  // ============================================================

  get playlistDescription(): string {

    return (

      this.playlist?.description ??
      'Your favourite music in one place.'

    );

  }


  // ============================================================
  // PLAYLIST ARTWORK
  // ============================================================

  get playlistArtwork(): string {

    return (

      this.playlist?.artwork ??
      'assets/images/playlist-cover.jpg'

    );

  }


  // ============================================================
  // DESTROY
  // ============================================================

  ngOnDestroy(): void {

    // ----------------------------------------------------------
    // CLOSE MODAL
    // ----------------------------------------------------------

    this.showAddItemModal =
      false;


    // ----------------------------------------------------------
    // COMPLETE SUBSCRIPTIONS
    // ----------------------------------------------------------

    this.destroy$.next();

    this.destroy$.complete();

  }

}
