import React from 'react';
import { StyleSheet, View } from 'react-native';
import HeaderInfo from './info';
import ProgressBar from './progress-bar';
import { Song } from '../../../types';

interface Props {
  currSong: Song;
}

const PlaybackHeader = ({ currSong }: Props) => {
  return (
    <View style={styles.root}>
      <ProgressBar />
      <HeaderInfo currSong={currSong} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'column'
  }
});

export default React.memo(PlaybackHeader);
