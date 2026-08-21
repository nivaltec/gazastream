import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MediaItem } from 'src/app/models/media-item';
import { Playlist } from 'src/app/models/playlist';
import { MediaPlayerService } from 'src/app/services/media-player-service';
import { PlaylistService } from 'src/app/services/playlist-service';

@Component({
  selector: 'app-catelog',
  templateUrl: './catelog.component.html',
  styleUrl: './catelog.component.css',
  standalone: false,
})
export class CatelogComponent implements OnInit, OnDestroy {
  /* ============================================================
     PLAYLISTS
     ============================================================ */

  playlists: Playlist[] = [];

  /* ============================================================
     PAGE STATE
     ============================================================ */

  isLoading = true;

  errorMessage = '';

  /* ============================================================
     CREATE PLAYLIST MODAL
     ============================================================ */

  showCreatePlaylist = false;

  /* ============================================================
     PLAYBACK STATE
     ============================================================ */

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
         * Nothing currently playing.
         */

        if (!media) {
          this.currentPlaylistTrack = null;

          this.playingPlaylistId = null;

          return;
        }

        /*
         * Keep the current track
         * if it belongs to the playlist
         * currently being played.
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
         * No additional state is required here.
         *
         * isPlaylistPlaying() reads the
         * current MediaPlayerService state.
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
        },

        error: (error: any) => {
          console.error('Failed to load playlists:', error);

          this.playlists = [];

          this.errorMessage = 'Unable to load playlists.';

          this.isLoading = false;
        },
      });
  }

  /* ============================================================
     CREATE PLAYLIST
     ============================================================ */

  openCreatePlaylist(): void {
    this.showCreatePlaylist = true;
  }

  /* ============================================================
     CLOSE CREATE PLAYLIST
     ============================================================ */

  closeCreatePlaylist(): void {
    this.showCreatePlaylist = false;
  }

  /* ============================================================
     PLAYLIST CREATED
     ============================================================ */

  onPlaylistCreated(playlist: Playlist): void {
    if (!playlist) {
      return;
    }

    /*
     * Add the newly created playlist
     * to the beginning of the collection.
     */

    this.playlists = [playlist, ...this.playlists];

    /*
     * Clear any previous error.
     */

    this.errorMessage = '';

    /*
     * Close the modal.
     */

    this.showCreatePlaylist = false;
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

    /* ----------------------------------------------------------
       START LOADING
    ---------------------------------------------------------- */

    this.loadingPlaylistId = playlist.id;

    /* ----------------------------------------------------------
       LOAD TRACKS
    ---------------------------------------------------------- */

    this.playlistService

      .getPlaylistTracks(playlist.id)

      .pipe(takeUntil(this.destroy$))

      .subscribe({
        next: (tracks: MediaItem[]) => {
          this.loadingPlaylistId = null;

          /*
           * Playlist contains no tracks.
           */

          if (!tracks?.length) {
            console.warn('Playlist contains no tracks:', playlist.name);

            this.playingPlaylistId = null;

            this.currentPlaylistTrack = null;

            return;
          }

          /*
           * Start with first track.
           */

          const track = tracks[0];

          this.currentPlaylistTrack = track;

          this.playingPlaylistId = playlist.id;

          /*
           * Send track to global player.
           */

          this.playerService.play(track);

          console.log('Playing playlist:', playlist.name);
        },

        error: (error: any) => {
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
      /*
       * PLAYING → PAUSE
       */

      if (this.playerService.isPlayingValue) {
        this.playerService.pause();

        return;
      }

      /*
       * PAUSED → RESUME
       */

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
