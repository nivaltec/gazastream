import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { Playlist } from 'src/app/models/playlist';
import { PlaylistService } from 'src/app/services/playlist-service';
import { MediaPlayerService } from 'src/app/services/media-player-service';
import { MediaItem } from 'src/app/models/media-item';

@Component({
  selector: 'app-playlists',

  templateUrl: './playlists.component.html',

  styleUrls: ['./playlists.component.css'],

  standalone: false,
})
export class PlaylistsComponent implements OnInit, OnDestroy {
  /* ============================================================
     PLAYLISTS
     ============================================================ */

  playlists: Playlist[] = [];

  /* ============================================================
     STATE
     ============================================================ */

  isLoading = true;

  errorMessage = '';

  playingPlaylistId: string | null = null;

  loadingPlaylistId: string | null = null;

  /* ============================================================
     CURRENT PLAYLIST TRACK
     ============================================================ */

  currentPlaylistTrack: MediaItem | null = null;

  /* ============================================================
     DESTROY
     ============================================================ */

  private readonly destroy$ = new Subject<void>();

  /* ============================================================
     CONSTRUCTOR
     ============================================================ */

  constructor(
    private readonly playlistService: PlaylistService,

    private readonly playerService: MediaPlayerService,

    private readonly router: Router,
  ) {}

  /* ============================================================
     INIT
     ============================================================ */

  ngOnInit(): void {
    this.loadPlaylists();

    this.subscribeToPlayer();
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
        /*
         * No media is currently loaded.
         */

        if (!media) {
          this.currentPlaylistTrack = null;

          this.playingPlaylistId = null;

          return;
        }

        /*
         * Only keep track of media that
         * belongs to the current playlist.
         */

        if (this.currentPlaylistTrack?.id === media.id) {
          this.currentPlaylistTrack = media;
        }
      });

    /* ----------------------------------------------------------
       PLAYING STATE
    ---------------------------------------------------------- */

    this.playerService.isPlaying

      .pipe(takeUntil(this.destroy$))

      .subscribe(() => {
        /*
         * We intentionally don't change
         * playingPlaylistId here.
         *
         * isPlaylistPlaying() reads the
         * actual MediaPlayerService state.
         */
      });
  }

  /* ============================================================
     LOAD PLAYLISTS
     ============================================================ */

  loadPlaylists(): void {
    this.isLoading = true;

    this.errorMessage = '';

    this.playlistService

      .getPlaylists()

      .pipe(takeUntil(this.destroy$))

      .subscribe({
        next: (playlists: Playlist[]) => {
          this.playlists = playlists ?? [];

          this.isLoading = false;

          if (!this.playlists.length) {
            this.errorMessage = 'No playlists available.';
          }
        },

        error: (error) => {
          console.error('Failed to load playlists:', error);
          this.playlists = [];
          this.errorMessage = 'Unable to load playlists.';
          this.isLoading = false;
        },
      });
  }

  /* ============================================================
     OPEN PLAYLIST
     ============================================================ */

  openPlaylist(playlist: Playlist): void {
    if (!playlist?.id) {
      return;
    }

    this.router.navigate(['/playlist', playlist.id]);
  }

  /* ============================================================
     PLAY PLAYLIST
     ============================================================ */

  playPlaylist(playlist: Playlist): void {
    if (!playlist?.id) {
      return;
    }

    /* ----------------------------------------------------------
       SAME PLAYLIST CURRENTLY PLAYING
    ---------------------------------------------------------- */

    if (
      this.playingPlaylistId === playlist.id &&
      this.playerService.isPlayingValue
    ) {
      this.playerService.pause();

      return;
    }

    /* ----------------------------------------------------------
       PREVENT DUPLICATE REQUESTS
    ---------------------------------------------------------- */

    if (this.loadingPlaylistId === playlist.id) {
      return;
    }

    /* ----------------------------------------------------------
       RESUME EXISTING PLAYLIST TRACK
    ---------------------------------------------------------- */

    if (this.playingPlaylistId === playlist.id && this.currentPlaylistTrack) {
      this.playerService.play(this.currentPlaylistTrack);

      return;
    }

    this.loadingPlaylistId = playlist.id;

    /* ----------------------------------------------------------
       LOAD PLAYLIST TRACKS
    ---------------------------------------------------------- */

    this.playlistService

      .getPlaylistTracks(playlist.id)

      .pipe(takeUntil(this.destroy$))

      .subscribe({
        next: (tracks: MediaItem[]) => {
          this.loadingPlaylistId = null;

          if (!tracks?.length) {
            this.playingPlaylistId = null;
            this.currentPlaylistTrack = null;
            return;
          }

          /* ----------------------------------------------------
             FIRST TRACK
          ---------------------------------------------------- */

          const track = tracks[0];

          this.currentPlaylistTrack = track;

          this.playingPlaylistId = playlist.id;

          /* ----------------------------------------------------
             PLAY
          ---------------------------------------------------- */
          this.playerService.play(track);
        },

        error: (error) => {
          this.loadingPlaylistId = null;
          this.playingPlaylistId = null;
          this.currentPlaylistTrack = null;
          console.error('Failed to load playlist tracks:', error);
        },
      });
  }

  /* ============================================================
     TOGGLE PLAYLIST
     ============================================================ */

  togglePlaylist(playlist: Playlist): void {
    if (!playlist?.id) {
      return;
    }

    /* ----------------------------------------------------------
       SAME PLAYLIST
    ---------------------------------------------------------- */

    if (this.playingPlaylistId === playlist.id) {
      /* --------------------------------------------------------
         PLAYING → PAUSE
      -------------------------------------------------------- */

      if (this.playerService.isPlayingValue) {
        this.playerService.pause();

        return;
      }

      /* --------------------------------------------------------
         PAUSED → RESUME
      -------------------------------------------------------- */

      if (this.currentPlaylistTrack) {
        this.playerService.play(this.currentPlaylistTrack);

        return;
      }
    }

    /* ----------------------------------------------------------
       DIFFERENT PLAYLIST
    ---------------------------------------------------------- */

    this.playPlaylist(playlist);
  }

  /* ============================================================
     CHECK PLAYING
     ============================================================ */

  isPlaylistPlaying(playlist: Playlist): boolean {
    if (!playlist?.id) {
      return false;
    }

    const currentMedia = this.playerService.currentMediaValue;

    return (
      this.playingPlaylistId === playlist.id &&
      this.currentPlaylistTrack?.id === currentMedia?.id &&
      this.playerService.isPlayingValue
    );
  }

  /* ============================================================
     CHECK LOADING
     ============================================================ */

  isPlaylistLoading(playlist: Playlist): boolean {
    if (!playlist?.id) {
      return false;
    }

    return this.loadingPlaylistId === playlist.id;
  }

  /* ============================================================
     REFRESH
     ============================================================ */

  refresh(): void {
    this.loadPlaylists();
  }

  /* ============================================================
     DESTROY
     ============================================================ */

  ngOnDestroy(): void {
    this.destroy$.next();

    this.destroy$.complete();
  }
}
