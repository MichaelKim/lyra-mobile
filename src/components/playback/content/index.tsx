import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../constants';
import { Song } from '../../../types';
import YtItem from '../../yt-item';
import Related from './related';

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
          <Text>{currSong.title}</Text>
          <Text>{currSong.artist}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#282828',
    flex: 1,
    padding: 24
  },
  subtitle: {
    fontSize: 20,
    color: Colors.text
  },
  divider: {
    height: 1,
    borderTopWidth: 1,
    borderTopColor: Colors.border
  }
});

export default React.memo(PlaybackContent);
