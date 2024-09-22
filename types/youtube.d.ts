interface YT {
  Player: {
    new (elementId: string, options: YT.PlayerOptions): YT.Player;
  };
}

declare namespace YT {
  interface PlayerOptions {
    height?: string | number;
    width?: string | number;
    videoId?: string;
    playerVars?: PlayerVars;
    events?: Events;
  }

  interface PlayerVars {
    autoplay?: 0 | 1;
    controls?: 0 | 1;
    disablekb?: 0 | 1;
    fs?: 0 | 1;
    modestbranding?: 1;
  }

  interface Events {
    onReady?: (event: PlayerEvent) => void;
  }

  interface Player {
    loadVideoById(videoId: string): void;
    playVideo(): void;
    stopVideo(): void;
    setVolume(volume: number): void;
  }

  interface PlayerEvent {
    target: Player;
  }
}