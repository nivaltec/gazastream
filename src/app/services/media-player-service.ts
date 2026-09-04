import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { MediaItem } from '../models/media-item';
import { MediaType } from '../enums/media-type-enum';


@Injectable({
  providedIn: 'root'
})
export class MediaPlayerService {


  // ============================================================
  // STATE
  // ============================================================

  private readonly currentMediaSubject =
    new BehaviorSubject<MediaItem | null>(null);

  private readonly isPlayingSubject =
    new BehaviorSubject<boolean>(false);

  private readonly currentTimeSubject =
    new BehaviorSubject<number>(0);

  private readonly durationSubject =
    new BehaviorSubject<number>(0);

  private readonly volumeSubject =
    new BehaviorSubject<number>(1);

  private readonly mediaTypeSubject =
    new BehaviorSubject<MediaType | null>(null);


  // ============================================================
  // PUBLIC OBSERVABLES
  // ============================================================

  readonly currentMedia =
    this.currentMediaSubject.asObservable();

  readonly isPlaying =
    this.isPlayingSubject.asObservable();

  readonly currentTime =
    this.currentTimeSubject.asObservable();

  readonly duration =
    this.durationSubject.asObservable();

  readonly volume =
    this.volumeSubject.asObservable();

  readonly mediaType =
    this.mediaTypeSubject.asObservable();


  // ============================================================
  // ACTIVE PLAYER
  // ============================================================

  private activePlayer:
    HTMLMediaElement | null = null;


  // ============================================================
  // PLAYBACK SESSION
  // ============================================================

  private playbackId = 0;


  // ============================================================
  // CURRENT VALUES
  // ============================================================

  get currentMediaValue(): MediaItem | null {

    return this.currentMediaSubject.value;

  }


  get isPlayingValue(): boolean {

    return this.isPlayingSubject.value;

  }


  get currentTimeValue(): number {

    return this.currentTimeSubject.value;

  }


  get durationValue(): number {

    return this.durationSubject.value;

  }


  get volumeValue(): number {

    return this.volumeSubject.value;

  }


  get mediaTypeValue(): MediaType | null {

    return this.mediaTypeSubject.value;

  }


  get currentMediaId(): string | null {

    const media =
      this.currentMediaValue;

    return media
      ? String(media.id)
      : null;

  }


  // ============================================================
  // PLAY
  // ============================================================

  play(media: MediaItem): void {

    if (!media?.url) {

      console.error(
        'MediaPlayerService: Media has no URL.',
        media
      );

      return;

    }


    // ----------------------------------------------------------
    // DETERMINE MEDIA TYPE
    // ----------------------------------------------------------

    const mediaType =
      this.detectMediaType(media);


    // ----------------------------------------------------------
    // NORMALIZE MEDIA
    // ----------------------------------------------------------

    const normalizedMedia: MediaItem = {

      ...media,

      type: mediaType

    };


    // ----------------------------------------------------------
    // SAME MEDIA
    // ----------------------------------------------------------

    if (
      this.isCurrentMedia(
        normalizedMedia
      )
    ) {

      if (!this.isPlayingValue) {

        this.resume();

      }

      return;

    }


    // ----------------------------------------------------------
    // NEW PLAYBACK SESSION
    // ----------------------------------------------------------

    const id =
      ++this.playbackId;


    // ----------------------------------------------------------
    // STOP CURRENT PLAYER
    // ----------------------------------------------------------

    this.destroyActivePlayer();


    // ----------------------------------------------------------
    // UPDATE STATE
    // ----------------------------------------------------------

    this.setState(
      normalizedMedia,
      mediaType
    );


    // ----------------------------------------------------------
    // AUDIO / RADIO
    // ----------------------------------------------------------

    if (
      mediaType === MediaType.Audio ||
      mediaType === MediaType.Radio
    ) {

      this.createHtml5Audio(
        normalizedMedia,
        id
      );

      return;

    }


    // ----------------------------------------------------------
    // VIDEO
    // ----------------------------------------------------------

    if (
      mediaType === MediaType.Video
    ) {

      /*
       * YouTube / HTML5 video will be handled
       * by the global MediaPlayerComponent.
       *
       * Do NOT create another player here.
       */

      return;

    }

  }


  // ============================================================
  // DETECT MEDIA TYPE
  // ============================================================

  private detectMediaType(
    media: MediaItem
  ): MediaType {

    // ----------------------------------------------------------
    // EXPLICIT TYPE
    // ----------------------------------------------------------

    if (
      media.type !== undefined &&
      media.type !== null
    ) {

      return media.type;

    }


    // ----------------------------------------------------------
    // YOUTUBE
    // ----------------------------------------------------------

    if (
      this.isYouTubeMedia(media)
    ) {

      return MediaType.Video;

    }


    // ----------------------------------------------------------
    // VIDEO EXTENSIONS
    // ----------------------------------------------------------

    if (
      this.isVideoUrl(media.url)
    ) {

      return MediaType.Video;

    }


    // ----------------------------------------------------------
    // RADIO
    // ----------------------------------------------------------

    if (
      this.isRadioMedia(media)
    ) {

      return MediaType.Radio;

    }


    // ----------------------------------------------------------
    // DEFAULT
    // ----------------------------------------------------------

    return MediaType.Audio;

  }


  // ============================================================
  // YOUTUBE DETECTION
  // ============================================================

  private isYouTubeMedia(
    media: MediaItem
  ): boolean {

    const provider =
      String(
        media.provider ?? ''
      )
        .trim()
        .toLowerCase();


    if (
      provider === 'youtube'
    ) {

      return true;

    }


    return this.isYouTubeUrl(
      media.url
    );

  }


  // ============================================================
  // YOUTUBE URL
  // ============================================================

  private isYouTubeUrl(
    url: string | undefined
  ): boolean {

    if (!url) {

      return false;

    }


    try {

      const parsed =
        new URL(url);


      const hostname =
        parsed.hostname
          .toLowerCase()
          .replace(
            /^www\./,
            ''
          );


      return (
        hostname === 'youtube.com' ||
        hostname === 'm.youtube.com' ||
        hostname === 'youtu.be'
      );

    } catch {

      return false;

    }

  }


  // ============================================================
  // VIDEO URL
  // ============================================================

  private isVideoUrl(
    url: string | undefined
  ): boolean {

    if (!url) {

      return false;

    }


    const cleanUrl =
      url
        .split('?')[0]
        .split('#')[0]
        .toLowerCase();


    return (
      cleanUrl.endsWith('.mp4') ||
      cleanUrl.endsWith('.webm') ||
      cleanUrl.endsWith('.ogg') ||
      cleanUrl.endsWith('.mov') ||
      cleanUrl.endsWith('.m4v')
    );

  }


  // ============================================================
  // RADIO DETECTION
  // ============================================================

  private isRadioMedia(
    media: MediaItem
  ): boolean {

    const value =
      String(
        media.type ?? ''
      )
        .trim()
        .toLowerCase();


    return (
      value === 'radio' ||
      value === 'station'
    );

  }


  // ============================================================
  // TOGGLE
  // ============================================================

  toggle(
    media: MediaItem
  ): void {

    if (!media) {

      return;

    }


    if (
      this.isCurrentMedia(media)
    ) {

      if (
        this.isPlayingValue
      ) {

        this.pause();

      } else {

        this.resume();

      }

      return;

    }


    this.play(media);

  }


  // ============================================================
  // REGISTER HTML5 VIDEO
  // ============================================================

  playHtml5Video(
    media: MediaItem,
    element: HTMLVideoElement
  ): void {

    if (
      !media ||
      !element ||
      !media.url
    ) {

      return;

    }


    const id =
      ++this.playbackId;


    // ----------------------------------------------------------
    // STOP CURRENT PLAYER
    // ----------------------------------------------------------

    this.destroyActivePlayer();


    // ----------------------------------------------------------
    // REGISTER PLAYER
    // ----------------------------------------------------------

    this.activePlayer =
      element;


    // ----------------------------------------------------------
    // NORMALIZE TYPE
    // ----------------------------------------------------------

    const normalizedMedia: MediaItem = {

      ...media,

      type: MediaType.Video

    };


    // ----------------------------------------------------------
    // STATE
    // ----------------------------------------------------------

    this.setState(
      normalizedMedia,
      MediaType.Video
    );


    // ----------------------------------------------------------
    // CONFIGURE
    // ----------------------------------------------------------

    this.configureHtml5(
      element,
      media.url
    );


    // ----------------------------------------------------------
    // EVENTS
    // ----------------------------------------------------------

    this.bindHtml5Events(
      element,
      normalizedMedia,
      id
    );


    // ----------------------------------------------------------
    // START
    // ----------------------------------------------------------

    this.startHtml5(
      element,
      normalizedMedia,
      id
    );

  }


  // ============================================================
  // PAUSE
  // ============================================================

  pause(): void {

    if (!this.activePlayer) {

      return;

    }


    try {

      this.activePlayer.pause();

    } catch {
      // Ignore.
    }


    this.isPlayingSubject.next(
      false
    );

  }


  // ============================================================
  // RESUME
  // ============================================================

  resume(): void {

    if (!this.activePlayer) {

      return;

    }


    const player =
      this.activePlayer;


    player
      .play()
      .then(() => {

        if (
          this.activePlayer === player
        ) {

          this.isPlayingSubject.next(
            true
          );

        }

      })
      .catch(error => {

        console.error(
          'MediaPlayerService: Resume failed.',
          error
        );


        if (
          this.activePlayer === player
        ) {

          this.isPlayingSubject.next(
            false
          );

        }

      });

  }


  // ============================================================
  // SEEK
  // ============================================================

  seek(
    seconds: number
  ): void {

    if (
      !this.activePlayer ||
      !Number.isFinite(seconds)
    ) {

      return;

    }


    const position =
      Math.max(
        0,
        seconds
      );


    try {

      this.activePlayer.currentTime =
        position;

    } catch {
      // Ignore.
    }

  }


  // ============================================================
  // SEEK TO PERCENTAGE
  // ============================================================

  seekToPercentage(
    percentage: number
  ): void {

    if (
      !Number.isFinite(percentage) ||
      this.durationValue <= 0
    ) {

      return;

    }


    const value =
      Math.max(
        0,
        Math.min(
          100,
          percentage
        )
      );


    this.seek(
      this.durationValue *
      (value / 100)
    );

  }


  // ============================================================
  // VOLUME
  // ============================================================

  setVolume(
    volume: number
  ): void {

    const value =
      Math.max(
        0,
        Math.min(
          1,
          volume
        )
      );


    this.volumeSubject.next(
      value
    );


    if (!this.activePlayer) {

      return;

    }


    try {

      this.activePlayer.volume =
        value;

      this.activePlayer.muted =
        value === 0;

    } catch {
      // Ignore.
    }

  }


  // ============================================================
  // STOP
  // ============================================================

  stop(): void {

    ++this.playbackId;

    this.destroyActivePlayer();

    this.resetState();

  }


  // ============================================================
  // CLEAR
  // ============================================================

  clear(): void {

    this.stop();

  }


  // ============================================================
  // STOP EVERYTHING
  // ============================================================

  stopEverything(): void {

    this.stop();

  }


  // ============================================================
  // CURRENT MEDIA CHECK
  // ============================================================

  isCurrentMedia(
    media: MediaItem
  ): boolean {

    const current =
      this.currentMediaValue;


    return !!(
      current &&
      media &&
      String(current.id) ===
        String(media.id)
    );

  }


  // ============================================================
  // MEDIA PLAYING CHECK
  // ============================================================

  isMediaPlaying(
    mediaId: string | number
  ): boolean {

    const current =
      this.currentMediaValue;


    return !!(
      current &&
      String(current.id) ===
        String(mediaId) &&
      this.isPlayingValue
    );

  }


  // ============================================================
  // CREATE AUDIO PLAYER
  // ============================================================

  private createHtml5Audio(
    media: MediaItem,
    id: number
  ): void {

    const element =
      document.createElement(
        'audio'
      );


    this.activePlayer =
      element;


    this.configureHtml5(
      element,
      media.url
    );


    this.bindHtml5Events(
      element,
      media,
      id
    );


    document.body.appendChild(
      element
    );


    this.startHtml5(
      element,
      media,
      id
    );

  }


  // ============================================================
  // CONFIGURE HTML5 PLAYER
  // ============================================================

  private configureHtml5(
    element: HTMLMediaElement,
    url: string
  ): void {

    try {

      element.pause();

    } catch {
      // Ignore.
    }


    element.removeAttribute(
      'src'
    );


    element.src =
      url;


    element.preload =
      'metadata';


    element.volume =
      this.volumeValue;


    element.muted =
      this.volumeValue === 0;


    if (
      element instanceof HTMLVideoElement
    ) {

      element.controls =
        true;

      element.playsInline =
        true;

    }

  }


  // ============================================================
  // HTML5 EVENTS
  // ============================================================

  private bindHtml5Events(
    element: HTMLMediaElement,
    media: MediaItem,
    id: number
  ): void {

    // ----------------------------------------------------------
    // PLAY
    // ----------------------------------------------------------

    element.addEventListener(
      'play',
      () => {

        if (
          !this.isActivePlayer(
            element,
            media,
            id
          )
        ) {

          return;

        }


        this.isPlayingSubject.next(
          true
        );

      }
    );


    // ----------------------------------------------------------
    // PAUSE
    // ----------------------------------------------------------

    element.addEventListener(
      'pause',
      () => {

        if (
          !this.isActivePlayer(
            element,
            media,
            id
          )
        ) {

          return;

        }


        this.isPlayingSubject.next(
          false
        );

      }
    );


    // ----------------------------------------------------------
    // TIME UPDATE
    // ----------------------------------------------------------

    element.addEventListener(
      'timeupdate',
      () => {

        if (
          !this.isActivePlayer(
            element,
            media,
            id
          )
        ) {

          return;

        }


        this.currentTimeSubject.next(
          element.currentTime
        );

      }
    );


    // ----------------------------------------------------------
    // LOADED METADATA
    // ----------------------------------------------------------

    element.addEventListener(
      'loadedmetadata',
      () => {

        if (
          !this.isActivePlayer(
            element,
            media,
            id
          )
        ) {

          return;

        }


        const duration =
          Number.isFinite(
            element.duration
          )
            ? element.duration
            : (media.duration ?? 0);


        this.durationSubject.next(
          duration
        );

      }
    );


    // ----------------------------------------------------------
    // DURATION CHANGE
    // ----------------------------------------------------------

    element.addEventListener(
      'durationchange',
      () => {

        if (
          !this.isActivePlayer(
            element,
            media,
            id
          )
        ) {

          return;

        }


        if (
          Number.isFinite(
            element.duration
          ) &&
          element.duration > 0
        ) {

          this.durationSubject.next(
            element.duration
          );

        }

      }
    );


    // ----------------------------------------------------------
    // ENDED
    // ----------------------------------------------------------

    element.addEventListener(
      'ended',
      () => {

        if (
          !this.isActivePlayer(
            element,
            media,
            id
          )
        ) {

          return;

        }


        this.isPlayingSubject.next(
          false
        );

        this.currentTimeSubject.next(
          0
        );

      }
    );


    // ----------------------------------------------------------
    // ERROR
    // ----------------------------------------------------------

    element.addEventListener(
      'error',
      event => {

        if (
          !this.isActivePlayer(
            element,
            media,
            id
          )
        ) {

          return;

        }


        console.error(
          'MediaPlayerService: HTML5 playback error.',
          event
        );


        this.isPlayingSubject.next(
          false
        );

      }
    );

  }


  // ============================================================
  // START HTML5 PLAYER
  // ============================================================

  private startHtml5(
    element: HTMLMediaElement,
    media: MediaItem,
    id: number
  ): void {

    element
      .play()
      .then(() => {

        if (
          this.isActivePlayer(
            element,
            media,
            id
          )
        ) {

          this.isPlayingSubject.next(
            true
          );

        }

      })
      .catch(error => {

        if (
          !this.isActivePlayer(
            element,
            media,
            id
          )
        ) {

          return;

        }


        console.error(
          'MediaPlayerService: Playback failed.',
          error
        );


        this.isPlayingSubject.next(
          false
        );

      });

  }


  // ============================================================
  // ACTIVE PLAYER CHECK
  // ============================================================

  private isActivePlayer(
    element: HTMLMediaElement,
    media: MediaItem,
    id: number
  ): boolean {

    return (

      this.activePlayer ===
        element &&

      this.playbackId ===
        id &&

      this.isCurrentMedia(
        media
      )

    );

  }


  // ============================================================
  // DESTROY ACTIVE PLAYER
  // ============================================================

  private destroyActivePlayer(): void {

    if (!this.activePlayer) {

      return;

    }


    const player =
      this.activePlayer;


    // ----------------------------------------------------------
    // STOP PLAYER
    // ----------------------------------------------------------

    try {

      player.pause();

    } catch {
      // Ignore.
    }


    try {

      player.currentTime =
        0;

    } catch {
      // Ignore.
    }


    // ----------------------------------------------------------
    // SERVICE-OWNED AUDIO
    // ----------------------------------------------------------

    if (
      player instanceof HTMLAudioElement &&
      player.parentElement ===
        document.body
    ) {

      try {

        player.remove();

      } catch {
        // Ignore.
      }

    } else {

      /*
       * Component-owned HTML5 video.
       *
       * Do not remove the element.
       */

      try {

        player.removeAttribute(
          'src'
        );

        player.load();

      } catch {
        // Ignore.
      }

    }


    // ----------------------------------------------------------
    // CLEAR PLAYER
    // ----------------------------------------------------------

    this.activePlayer =
      null;


    this.isPlayingSubject.next(
      false
    );

  }


  // ============================================================
  // SET STATE
  // ============================================================

  private setState(
    media: MediaItem,
    type: MediaType
  ): void {

    this.currentMediaSubject.next(
      media
    );


    this.mediaTypeSubject.next(
      type
    );


    this.currentTimeSubject.next(
      0
    );


    this.durationSubject.next(
      media.duration ?? 0
    );


    this.isPlayingSubject.next(
      false
    );

  }


  // ============================================================
  // RESET STATE
  // ============================================================

  private resetState(): void {

    this.currentMediaSubject.next(
      null
    );


    this.mediaTypeSubject.next(
      null
    );


    this.currentTimeSubject.next(
      0
    );


    this.durationSubject.next(
      0
    );


    this.isPlayingSubject.next(
      false
    );

  }


  // ============================================================
  // FORMAT TIME
  // ============================================================

  formatTime(
    seconds: number
  ): string {

    if (
      !Number.isFinite(seconds) ||
      seconds < 0
    ) {

      return '00:00';

    }


    const total =
      Math.floor(seconds);


    const hours =
      Math.floor(
        total / 3600
      );


    const minutes =
      Math.floor(
        (total % 3600) / 60
      );


    const remaining =
      total % 60;


    if (hours > 0) {

      return [
        hours,
        minutes,
        remaining
      ]
        .map(
          value =>
            value
              .toString()
              .padStart(
                2,
                '0'
              )
        )
        .join(':');

    }


    return [
      minutes,
      remaining
    ]
      .map(
        value =>
          value
            .toString()
            .padStart(
              2,
              '0'
            )
      )
      .join(':');

  }

}
