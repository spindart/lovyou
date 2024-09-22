declare global {
  namespace YT {
    interface PlayerOptions {
      height?: string | number;
      width?: string | number;
      videoId?: string;
      playerVars?: PlayerVars;
      events?: Events;
    }

    interface PlayerVars {
      autoplay?: 0 | 1;
      cc_load_policy?: 1;
      color?: 'red' | 'white';
      controls?: 0 | 1 | 2;
      disablekb?: 0 | 1;
      enablejsapi?: 0 | 1;
      end?: number;
      fs?: 0 | 1;
      hl?: string;
      iv_load_policy?: 1 | 3;
      list?: string;
      listType?: 'playlist' | 'search' | 'user_uploads';
      loop?: 0 | 1;
      modestbranding?: 1;
      origin?: string;
      playlist?: string;
      playsinline?: 0 | 1;
      rel?: 0 | 1;
      showinfo?: 0 | 1;
      start?: number;
    }

    interface Events {
      onReady?: (event: PlayerEvent) => void;
      onStateChange?: (event: OnStateChangeEvent) => void;
      onPlaybackQualityChange?: (event: PlaybackQualityChangeEvent) => void;
      onPlaybackRateChange?: (event: PlaybackRateChangeEvent) => void;
      onError?: (event: OnErrorEvent) => void;
      onApiChange?: (event: ApiChangeEvent) => void;
    }

    interface PlayerEvent {
      target: Player;
    }

    interface OnStateChangeEvent {
      target: Player;
      data: number;
    }

    interface PlaybackQualityChangeEvent {
      target: Player;
      data: string;
    }

    interface PlaybackRateChangeEvent {
      target: Player;
      data: number;
    }

    interface OnErrorEvent {
      target: Player;
      data: number;
    }

    interface ApiChangeEvent {
      target: Player;
    }

    class Player {
      constructor(elementId: string, options: PlayerOptions);
      loadVideoById(videoId: string, startSeconds?: number): void;
      playVideo(): void;
      pauseVideo(): void;
      stopVideo(): void;
      setVolume(volume: number): void;
      destroy(): void; // Adicione esta linha
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
    YT: typeof YT & { Player: new (elementId: string, options: YT.PlayerOptions) => YT.Player };
    onYouTubeIframeAPIReady: () => void;
  }
}

export {};