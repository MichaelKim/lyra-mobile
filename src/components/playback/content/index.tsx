import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../../constants';
import { Song } from '../../../types';
import Thumbnail from '../../thumbnail';
import Related from './related';

type Props = {
  currSong: Song;
};

const PlaybackContent = ({ currSong }: Props) => {
  return (
    <View style={styles.root}>
      <View style={styles.thumbnailRoot}>
        <Thumbnail src={currSong.thumbnail} style={styles.thumbnail} />
      </View>
      {currSong.source === 'YOUTUBE' && <Related currSong={currSong} />}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: Colors.playback,
    flex: 1,
    padding: 24
  },
  thumbnailRoot: {
    flexDirection: 'row'
  },
  thumbnail: {
    flex: 1,
    maxWidth: '100%'
  }
});

export default React.memo(PlaybackContent);
