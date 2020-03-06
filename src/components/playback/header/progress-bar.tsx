import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../../constants';

export interface ProgressBarProps {
  currentTime: number;
  seekableDuration: number;
}

const ProgressBar = ({ currentTime, seekableDuration }: ProgressBarProps) => {
  return (
    <View style={styles.progressBar}>
      <View
        style={{ flex: currentTime, backgroundColor: Colors.placeholder }}
      />
      <View
        style={{
          flex: seekableDuration - currentTime,
          backgroundColor: Colors.screen
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
