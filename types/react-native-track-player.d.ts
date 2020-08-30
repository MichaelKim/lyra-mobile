import RNTrackPlayer from 'react-native-track-player';

declare module 'react-native-track-player' {
  const STATE_CONNECTING: RNTrackPlayer.State;

  function usePlaybackState(): RNTrackPlayer.State;
  function useTrackPlayerProgress(
    interval?: number,
    pollTrackPlayerStates?: RNTrackPlayer.State[]
  ): {
    position: number;
    bufferedPosition: number;
    duration: number;
  };
}
