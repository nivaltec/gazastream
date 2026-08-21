import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Playlist } from '../models/playlist';
import { MediaItem } from '../models/media-item';
import { MusicService } from './music-service';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  // ============================================================
  // API
  // ============================================================

  apiUrl: any;

  // ============================================================
  // USER PLAYLISTS
  // ============================================================

  /**
   * User-created playlists.
   *
   * These are currently kept in memory after being
   * returned from the API.
   *
   * When playlist retrieval is moved completely to
   * the backend, this collection can be removed.
   */
  private readonly userPlaylists: Playlist[] = [];

  // ============================================================
  // PLAYLIST TRACKS
  // ============================================================

  /**
   * Tracks belonging to user-created playlists.
   *
   * Key   = playlist ID
   * Value = MediaItem[]
   */
  private readonly playlistTracks = new Map<string, MediaItem[]>();

  // ============================================================
  // BUILT-IN PLAYLIST IDS
  // ============================================================

  /**
   * Built-in playlists are curated by Gaza Stream
   * and cannot be modified by the user.
   */
  private readonly builtInPlaylistIds = new Set<string>([
    'afrobeats',
    'arabic-vibes',
    'palestinian-sounds',
    'hip-hop',
    'rnb',
    'all-music',
  ]);

  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(
    private readonly musicService: MusicService,
    private readonly http: HttpClient,
  ) {}

  // ============================================================
  // CREATE PLAYLIST
  // ============================================================

  createPlaylist(playlist: FormData): Observable<Playlist> {
    return this.http.post<Playlist>(`${this.apiUrl}/playlists`, playlist).pipe(
      tap((createdPlaylist) => {
        this.registerCreatedPlaylist(createdPlaylist);
      }),
    );
  }

  // ============================================================
  // GET PLAYLISTS
  // ============================================================

  getPlaylists(limit = 20): Observable<Playlist[]> {
    const playlists = [...this.buildPlaylists(), ...this.userPlaylists];

    return of(playlists.slice(0, limit));
  }

  // ============================================================
  // GET PLAYLIST BY ID
  // ============================================================

  getPlaylistById(id: string): Observable<Playlist | null> {
    if (!id) {
      return of(null);
    }

    const playlists = [...this.buildPlaylists(), ...this.userPlaylists];

    const playlist = playlists.find(
      (item) => item.id?.toLowerCase() === id.toLowerCase(),
    );

    return of(playlist ?? null);
  }

  // ============================================================
  // GET PLAYLIST TRACKS
  // ============================================================

  getPlaylistTracks(playlistId: string): Observable<MediaItem[]> {
    if (!playlistId) {
      return of([]);
    }

    // ----------------------------------------------------------
    // USER PLAYLIST
    // ----------------------------------------------------------

    if (this.playlistTracks.has(playlistId)) {
      return of([...(this.playlistTracks.get(playlistId) ?? [])]);
    }

    // ----------------------------------------------------------
    // BUILT-IN PLAYLIST
    // ----------------------------------------------------------

    return of(this.getTracksForPlaylist(playlistId));
  }

  // ============================================================
  // GET PLAYLIST WITH TRACKS
  // ============================================================

  getPlaylistWithTracks(playlistId: string): Observable<{
    playlist: Playlist;
    tracks: MediaItem[];
  } | null> {
    if (!playlistId) {
      return of(null);
    }

    const playlists = [...this.buildPlaylists(), ...this.userPlaylists];

    const playlist = playlists.find(
      (item) => item.id?.toLowerCase() === playlistId.toLowerCase(),
    );

    if (!playlist) {
      return of(null);
    }

    let tracks: MediaItem[];

    // ----------------------------------------------------------
    // USER PLAYLIST
    // ----------------------------------------------------------

    if (this.playlistTracks.has(playlist.id!)) {
      tracks = [...(this.playlistTracks.get(playlist.id!) ?? [])];
    }

    // ----------------------------------------------------------
    // BUILT-IN PLAYLIST
    // ----------------------------------------------------------
    else {
      tracks = this.getTracksForPlaylist(playlist.id!);
    }

    /*
     * Keep the displayed count synchronized
     * with the actual tracks.
     *
     * Built-in playlists are generated from
     * MusicService, so their count is calculated
     * dynamically.
     */
    playlist.trackCount = tracks.length;

    return of({
      playlist,

      tracks,
    });
  }

  // ============================================================
  // GET AVAILABLE MEDIA
  // ============================================================

  /**
   * The playlist modal uses this method to get
   * everything that can be added to a playlist.
   *
   * MusicService remains the single source of truth
   * for available MediaItems.
   */
  getAvailableMedia(): Observable<MediaItem[]> {
    return of([...this.musicService.getTracks()]);
  }

  // ============================================================
  // CHECK USER PLAYLIST
  // ============================================================

  isUserPlaylist(playlistId: string): boolean {
    if (!playlistId) {
      return false;
    }

    /*
     * A built-in playlist can NEVER be
     * considered a user playlist.
     */
    if (this.isBuiltInPlaylist(playlistId)) {
      return false;
    }

    return this.userPlaylists.some(
      (playlist) => playlist.id?.toLowerCase() === playlistId.toLowerCase(),
    );
  }

  // ============================================================
  // CHECK BUILT-IN PLAYLIST
  // ============================================================

  isBuiltInPlaylist(playlistId: string): boolean {
    if (!playlistId) {
      return false;
    }

    return this.builtInPlaylistIds.has(playlistId.toLowerCase());
  }

  // ============================================================
  // ADD TRACK TO PLAYLIST
  // ============================================================

  addTrackToPlaylist(
    playlistId: string,
    track: MediaItem,
  ): Observable<MediaItem[]> {
    // ----------------------------------------------------------
    // VALIDATION
    // ----------------------------------------------------------

    if (!playlistId || !track?.id) {
      return of([]);
    }

    // ----------------------------------------------------------
    // BUILT-IN PLAYLISTS ARE READ ONLY
    // ----------------------------------------------------------

    if (this.isBuiltInPlaylist(playlistId)) {
      console.warn(`Gaza Stream: Playlist "${playlistId}" is read-only.`);

      return of(this.getTracksForPlaylist(playlistId));
    }

    // ----------------------------------------------------------
    // USER PLAYLIST MUST EXIST
    // ----------------------------------------------------------

    const playlist = this.userPlaylists.find(
      (item) => item.id?.toLowerCase() === playlistId.toLowerCase(),
    );

    if (!playlist) {
      console.warn(`Gaza Stream: User playlist "${playlistId}" was not found.`);

      return of([]);
    }

    // ----------------------------------------------------------
    // CREATE TRACK COLLECTION
    // ----------------------------------------------------------

    if (!this.playlistTracks.has(playlist.id!)) {
      this.playlistTracks.set(playlist.id!, []);
    }

    const tracks = this.playlistTracks.get(playlist.id!) ?? [];

    // ----------------------------------------------------------
    // DUPLICATE CHECK
    // ----------------------------------------------------------

    const alreadyExists = tracks.some(
      (existingTrack) => existingTrack.id === track.id,
    );

    if (alreadyExists) {
      console.info('Gaza Stream: Track already exists in playlist:', track.id);

      return of([...tracks]);
    }

    // ----------------------------------------------------------
    // ADD MEDIA ITEM
    // ----------------------------------------------------------

    tracks.push({
      ...track,
    });

    // ----------------------------------------------------------
    // SYNCHRONIZE TRACK COUNT
    // ----------------------------------------------------------

    playlist.trackCount = tracks.length;

    // ----------------------------------------------------------
    // SAVE UPDATED TRACK COLLECTION
    // ----------------------------------------------------------

    this.playlistTracks.set(playlist.id!, tracks);

    return of([...tracks]);
  }

  // ============================================================
  // REMOVE TRACK FROM PLAYLIST
  // ============================================================

  removeTrackFromPlaylist(
    playlistId: string,
    trackId: string,
  ): Observable<MediaItem[]> {
    if (!playlistId || !trackId) {
      return of([]);
    }

    // ----------------------------------------------------------
    // BUILT-IN PLAYLISTS ARE READ ONLY
    // ----------------------------------------------------------

    if (this.isBuiltInPlaylist(playlistId)) {
      console.warn(`Gaza Stream: Playlist "${playlistId}" is read-only.`);

      return of(this.getTracksForPlaylist(playlistId));
    }

    // ----------------------------------------------------------
    // FIND USER PLAYLIST
    // ----------------------------------------------------------

    const playlist = this.userPlaylists.find(
      (item) => item.id?.toLowerCase() === playlistId.toLowerCase(),
    );

    if (!playlist) {
      return of([]);
    }

    // ----------------------------------------------------------
    // GET TRACKS
    // ----------------------------------------------------------

    const tracks = this.playlistTracks.get(playlist.id!) ?? [];

    // ----------------------------------------------------------
    // REMOVE
    // ----------------------------------------------------------

    const updatedTracks = tracks.filter((track) => track.id !== trackId);

    // ----------------------------------------------------------
    // SAVE
    // ----------------------------------------------------------

    this.playlistTracks.set(playlist.id!, updatedTracks);

    // ----------------------------------------------------------
    // SYNCHRONIZE COUNT
    // ----------------------------------------------------------

    playlist.trackCount = updatedTracks.length;

    return of([...updatedTracks]);
  }

  // ============================================================
  // REGISTER USER PLAYLIST
  // ============================================================

  registerCreatedPlaylist(playlist: Playlist): void {
    if (!playlist?.id) {
      return;
    }

    // ----------------------------------------------------------
    // DON'T REGISTER BUILT-IN PLAYLIST
    // ----------------------------------------------------------

    if (this.isBuiltInPlaylist(playlist.id)) {
      console.warn(`Gaza Stream: "${playlist.id}" is a built-in playlist.`);

      return;
    }

    // ----------------------------------------------------------
    // CHECK EXISTING
    // ----------------------------------------------------------

    const exists = this.userPlaylists.some(
      (item) => item.id?.toLowerCase() === playlist.id!.toLowerCase(),
    );

    if (exists) {
      return;
    }

    // ----------------------------------------------------------
    // REGISTER
    // ----------------------------------------------------------

    const registeredPlaylist: Playlist = {
      ...playlist,

      trackCount: playlist.trackCount ?? 0,
    };

    this.userPlaylists.unshift(registeredPlaylist);

    // ----------------------------------------------------------
    // INITIALIZE TRACKS
    // ----------------------------------------------------------

    this.playlistTracks.set(registeredPlaylist.id!, []);
  }

  // ============================================================
  // BUILT-IN PLAYLISTS
  // ============================================================

  private buildPlaylists(): Playlist[] {
    const tracks = this.musicService.getTracks();

    return [
      // --------------------------------------------------------
      // AFROBEATS
      // --------------------------------------------------------

      {
        id: 'afrobeats',

        name: 'Afrobeats',

        description: 'A collection of energetic African sounds and rhythms.',

        artwork:
          tracks.find((track) =>
            (track.genre ?? '').toLowerCase().includes('afrobeats'),
          )?.artwork ?? this.getArtwork(1),

        icon: 'fa-solid fa-music',

        route: '/playlist/afrobeats',

        trackCount: this.getTracksForPlaylist('afrobeats').length,
      },

      // --------------------------------------------------------
      // ARABIC VIBES
      // --------------------------------------------------------

      {
        id: 'arabic-vibes',

        name: 'Arabic Vibes',

        description: 'Modern Arabic sounds, melodies and artists.',

        artwork:
          tracks.find((track) =>
            (track.genre ?? '').toLowerCase().includes('arabic'),
          )?.artwork ?? this.getArtwork(2),

        icon: 'fa-solid fa-music',

        route: '/playlist/arabic-vibes',

        trackCount: this.getTracksForPlaylist('arabic-vibes').length,
      },

      // --------------------------------------------------------
      // PALESTINIAN SOUNDS
      // --------------------------------------------------------

      {
        id: 'palestinian-sounds',

        name: 'Palestinian Sounds',

        description: 'Music inspired by Palestinian culture and artists.',

        artwork:
          tracks.find((track) =>
            (track.genre ?? '').toLowerCase().includes('palestinian'),
          )?.artwork ?? this.getArtwork(3),

        icon: 'fa-solid fa-star-and-crescent',

        route: '/playlist/palestinian-sounds',

        trackCount: this.getTracksForPlaylist('palestinian-sounds').length,
      },

      // --------------------------------------------------------
      // HIP HOP
      // --------------------------------------------------------

      {
        id: 'hip-hop',

        name: 'Hip Hop',

        description: 'Hip hop, rap and urban sounds.',

        artwork:
          tracks.find((track) =>
            (track.genre ?? '').toLowerCase().includes('hip-hop'),
          )?.artwork ?? this.getArtwork(4),

        icon: 'fa-solid fa-microphone',

        route: '/playlist/hip-hop',

        trackCount: this.getTracksForPlaylist('hip-hop').length,
      },

      // --------------------------------------------------------
      // R&B
      // --------------------------------------------------------

      {
        id: 'rnb',

        name: 'R&B',

        description: 'Smooth R&B and soulful sounds.',

        artwork:
          tracks.find((track) =>
            (track.genre ?? '').toLowerCase().includes('rnb'),
          )?.artwork ?? this.getArtwork(5),

        icon: 'fa-solid fa-heart',

        route: '/playlist/rnb',

        trackCount: this.getTracksForPlaylist('rnb').length,
      },

      // --------------------------------------------------------
      // ALL MUSIC
      // --------------------------------------------------------

      {
        id: 'all-music',

        name: 'All Music',

        description: 'Everything currently available on Gaza Stream.',

        artwork: this.getArtwork(6),

        icon: 'fa-solid fa-layer-group',

        route: '/playlist/all-music',

        trackCount: tracks.length,
      },
    ];
  }

  // ============================================================
  // FILTER BUILT-IN TRACKS
  // ============================================================

  private getTracksForPlaylist(playlistId: string): MediaItem[] {
    const tracks = this.musicService.getTracks();

    switch (playlistId.toLowerCase()) {
      // --------------------------------------------------------
      // AFROBEATS
      // --------------------------------------------------------

      case 'afrobeats':
        return tracks.filter((track) =>
          (track.genre ?? '').toLowerCase().includes('afrobeats'),
        );

      // --------------------------------------------------------
      // ARABIC
      // --------------------------------------------------------

      case 'arabic-vibes':
        return tracks.filter((track) =>
          (track.genre ?? '').toLowerCase().includes('arabic'),
        );

      // --------------------------------------------------------
      // PALESTINIAN
      // --------------------------------------------------------

      case 'palestinian-sounds':
        return tracks.filter((track) =>
          (track.genre ?? '').toLowerCase().includes('palestinian'),
        );

      // --------------------------------------------------------
      // HIP HOP
      // --------------------------------------------------------

      case 'hip-hop':
        return tracks.filter((track) =>
          (track.genre ?? '').toLowerCase().includes('hip-hop'),
        );

      // --------------------------------------------------------
      // R&B
      // --------------------------------------------------------

      case 'rnb':
        return tracks.filter((track) =>
          (track.genre ?? '').toLowerCase().includes('rnb'),
        );

      // --------------------------------------------------------
      // ALL MUSIC
      // --------------------------------------------------------

      case 'all-music':
        return [...tracks];

      // --------------------------------------------------------
      // UNKNOWN
      // --------------------------------------------------------

      default:
        return [];
    }
  }

  // ============================================================
  // ARTWORK
  // ============================================================

  private getArtwork(index: number): string {
    const artworks = [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',

      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800',

      'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800',

      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',

      'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800',

      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    ];

    return artworks[(index - 1) % artworks.length];
  }
}
