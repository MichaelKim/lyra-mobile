import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MusicControl from 'react-native-music-control';

import { Previous, Replay, Play, Pause, Forward, Next } from '../../icons';

interface Props {
  paused: boolean;
  skipPrevious: () => void;
  skipNext: () => void;
  togglePause: () => void;
  onDeltaSeek: (delta: number) => void;
}

const Controls = ({
  paused,
  skipPrevious,
  skipNext,
  togglePause,
  onDeltaSeek
}: Props) => {
  const onReplay = () => onDeltaSeek(-10);
  const onForward = () => onDeltaSeek(10);

  // Enable media controls
  React.useEffect(() => {
    MusicControl.enableControl('previousTrack', true);
    MusicControl.enableControl('skipBackward', true, { interval: 10 });
    MusicControl.enableControl('play', true);
    MusicControl.enableControl('pause', true);
    MusicControl.enableControl('skipForward', true, { interval: 10 });
    MusicControl.enableControl('nextTrack', true);
  }, []);

  // Register media control listeners
  React.useEffect(() => {
    MusicControl.on('previousTrack', skipPrevious);
    MusicControl.on('skipBackward', () => onDeltaSeek(-10));
    MusicControl.on('play', togglePause);
    MusicControl.on('pause', togglePause);
    MusicControl.on('skipForward', () => onDeltaSeek(10));
    MusicControl.on('nextTrack', skipNext);
  }, [skipPrevious, togglePause, skipNext, onDeltaSeek]);

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

export default Controls;
