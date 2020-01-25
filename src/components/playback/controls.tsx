import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

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
