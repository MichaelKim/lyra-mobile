import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../../constants';
import { useTrackPlayerProgress } from 'react-native-track-player';

interface Props {}

const ProgressBar = (_: Props) => {
  const { position, duration } = useTrackPlayerProgress();

  const left = duration === 0 ? 1 : position;

  return (
    <View style={styles.progressBar}>
      <View style={{ flex: left, backgroundColor: Colors.accent }} />
      <View
        style={{
          flex: duration - position,
          backgroundColor: Colors.border
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  progressBar: {
    height: 2,
    flexDirection: 'row'
  }
});

export default React.memo(ProgressBar);
