export {};

declare global {

  namespace YT {

    class Player {

      constructor(
        element: HTMLElement | string,
        options: PlayerOptions
      );

      playVideo(): void;

      pauseVideo(): void;

      stopVideo(): void;

      mute(): void;

      unMute(): void;

      isMuted(): boolean;

      setVolume(volume: number): void;

      getVolume(): number;

      getCurrentTime(): number;

      getDuration(): number;

      seekTo(
        seconds: number,
        allowSeekAhead?: boolean
      ): void;

      getPlayerState(): PlayerState;

      getIframe(): HTMLIFrameElement;

      destroy(): void;
    }


    interface PlayerOptions {

      videoId?: string;

      width?: number | string;

      height?: number | string;

      playerVars?: {
        autoplay?: number;
        controls?: number;
        playsinline?: number;
        enablejsapi?: number;
        origin?: string;
        rel?: number;
      };

      events?: {

        onReady?: (
          event: PlayerEvent
        ) => void;

        onStateChange?: (
          event: OnStateChangeEvent
        ) => void;

        onError?: (
          event: PlayerErrorEvent
        ) => void;

      };

    }


    interface PlayerEvent {

      target: Player;

    }


    interface OnStateChangeEvent {

      target: Player;

      data: number;

    }


    interface PlayerErrorEvent {

      target: Player;

      data: number;

    }


    enum PlayerState {

      UNSTARTED = -1,

      ENDED = 0,

      PLAYING = 1,

      PAUSED = 2,

      BUFFERING = 3,

      CUED = 5

    }

  }


  interface Window {

    YT: typeof YT;

    onYouTubeIframeAPIReady: () => void;

  }

}
