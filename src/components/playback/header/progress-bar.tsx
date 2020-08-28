import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../../constants';

interface ProgressBarProps {
  currentTime: number;
  seekableDuration: number;
}

const ProgressBar = ({ currentTime, seekableDuration }: ProgressBarProps) => {
  const left = seekableDuration === 0 ? 1 : currentTime;

  return (
    <View style={styles.progressBar}>
      <View style={{ flex: left, backgroundColor: Colors.accent }} />
      <View
        style={{
          flex: seekableDuration - currentTime,
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
