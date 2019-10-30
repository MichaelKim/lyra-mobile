// @flow strict

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '../constants';
import { useSelector } from '../hooks';

import type { Song } from '../types';

type Props = {|
  +song: Song
|};

const SongItem = (props: Props) => {
  const { song } = props;
  const currSong = useSelector(state => state.currSong);
  const isPlaying = currSong?.id === song.id;

  return (
    <View key={song.id} style={styles.root}>
      <Text style={styles.songTitle}>{song.title}</Text>
      {song.artist !== '' && (
        <Text style={styles.songArtist}>{song.artist}</Text>
      )}
      {isPlaying && <Text style={styles.songArtist}>Playing</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    marginTop: 5,
    justifyContent: 'center',
    height: 50
  },
  songTitle: {
    fontSize: 15,
    color: Colors.text
  },
  songArtist: {
    fontSize: 12,
    color: Colors.text
  }
});

export default SongItem;