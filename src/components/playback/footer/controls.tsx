import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MusicControl from 'react-native-music-control';
import { Forward, Next, Pause, Play, Previous, Replay } from '../../../icons';
import { Command } from 'react-native-music-control/lib/types';

interface Props {
  paused: boolean;
  skipPrevious: () => void;
  skipNext: () => void;
  setPaused: (paused: boolean) => void;
  onDeltaSeek: (delta: number) => void;
  onSeek: (amount: number) => void;
}

function useMediaControl(event: Command, handler: (value: any) => void) {
  React.useEffect(() => {
    MusicControl.on(event, handler);
    return () => MusicControl.off(event);
  }, [event, handler]);
}

const Controls = ({
  paused,
  skipPrevious,
  skipNext,
  setPaused,
  onDeltaSeek,
  onSeek
}: Props) => {
  const onReplay = React.useCallback(() => onDeltaSeek(-10), [onDeltaSeek]);
  const onForward = React.useCallback(() => onDeltaSeek(10), [onDeltaSeek]);
  const togglePause = React.useCallback(() => setPaused(!paused), [
    paused,
    setPaused
  ]);
  const onPlay = React.useCallback(() => setPaused(false), [setPaused]);
  const onPause = React.useCallback(() => setPaused(true), [setPaused]);

  // Enable media controls
  React.useEffect(() => {
    MusicControl.enableControl('closeNotification', true, { when: 'paused' });
    MusicControl.enableBackgroundMode(true);
    MusicControl.enableControl('previousTrack', true);
    MusicControl.enableControl('skipBackward', true, { interval: 10 });
    MusicControl.enableControl('play', true);
    MusicControl.enableControl('pause', true);
    MusicControl.enableControl('skipForward', true, { interval: 10 });
    MusicControl.enableControl('nextTrack', true);
    MusicControl.enableControl('seek', true);

    return () => {
      MusicControl.resetNowPlaying();
      MusicControl.stopControl();
    };
  }, []);

  // Register media control listeners
  useMediaControl(Command.previousTrack, skipPrevious);
  useMediaControl(Command.skipBackward, onReplay);
  useMediaControl(Command.play, onPlay);
  useMediaControl(Command.pause, onPause);
  useMediaControl(Command.skipForward, onForward);
  useMediaControl(Command.nextTrack, skipNext);
  useMediaControl(Command.seek, onSeek);

  return (
    <View style={styles.root}>
      <TouchableOpacity onPress={skipPrevious}>
        <Previous width={30} height={30} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onReplay}>
        <Replay width={30} height={30} />
      </TouchableOpacity>
      <TouchableOpacity onPress={togglePause}>
        {paused ? (
          <Play width={30} height={30} />
        ) : (
          <Pause width={30} height={30} />
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={onForward}>
        <Forward width={30} height={30} />
      </TouchableOpacity>
      <TouchableOpacity onPress={skipNext}>
        <Next width={30} height={30} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row'
  }
});

export default React.memo(Controls);
