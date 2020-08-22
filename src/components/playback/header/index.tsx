import React from 'react';
import { StyleSheet, View } from 'react-native';
import { OnProgressData } from 'react-native-video';
import HeaderInfo, { HeaderInfoProps } from './info';
import ProgressBar from './progress-bar';

interface Props extends HeaderInfoProps {
  progress: OnProgressData;
}

const PlaybackHeader = ({
  currSong,
  loading,
  paused,
  setPaused,
  progress: { currentTime, seekableDuration }
}: Props) => {
  return (
    <View style={styles.root}>
      <ProgressBar
        currentTime={currentTime}
        seekableDuration={seekableDuration}
      />
      <HeaderInfo
        currSong={currSong}
        loading={loading}
        paused={paused}
        setPaused={setPaused}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'column'
  }
});

export default React.memo(PlaybackHeader);
