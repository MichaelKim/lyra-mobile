import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Song } from '../../../types';
import YtItem from '../../yt-item';
import Related from './related';

import { h2 } from '../../../styles';
import { Colors } from '../../../constants';
import Thumbnail from '../../thumbnail';

interface Props {
  currSong: Song;
}

const PlaybackContent = ({ currSong }: Props) => {
  return (
    <View style={styles.root}>
      {currSong.source === 'YOUTUBE' ? (
        <>
          <Text style={styles.subtitle}>Currently Playing</Text>
          <YtItem video={currSong} />
          <View style={styles.divider} />
          <Text style={styles.subtitle}>Related Videos</Text>
          <Related currSong={currSong} />
        </>
      ) : (
        <>
          <Thumbnail src={currSong.thumbnail.url} style={styles.thumbnail} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: Colors.playback,
    flex: 1,
    padding: 24
  },
  subtitle: h2,
  divider: {
    height: 1,
    borderTopWidth: 1,
    borderTopColor: Colors.border
  },
  thumbnail: {
    flex: 1
  }
});

export default React.memo(PlaybackContent);
