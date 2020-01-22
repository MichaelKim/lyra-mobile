import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableHighlight } from 'react-native';
import { SafeAreaView } from 'react-navigation';

import SongItem from '../song-item';

import { Colors } from '../../constants';
import { useSelector, useDispatch } from '../../hooks';
import { getSongList } from '../../util';

import { Song, NavigationProps } from '../../types';

interface Props extends NavigationProps {}

const Library = (_: Props) => {
  const songs = useSelector(state =>
    getSongList(state.songs, state.currScreen, state.sort)
  );
  const dispatch = useDispatch();

  const onSelect = (song: Song) => {
    dispatch({ type: 'SELECT_SONG', song });
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.title}>Library</Text>
        {songs.map(song => (
          <TouchableHighlight key={song.id} onPress={() => onSelect(song)}>
            <SongItem song={song} />
          </TouchableHighlight>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    height: '100%',
    backgroundColor: Colors.screen
  },
  scrollView: {
    paddingTop: 32,
    paddingHorizontal: 24
  },
  scrollViewContainer: {
    flexGrow: 1
  },
  title: {
    fontSize: 30,
    color: Colors.text
  }
});

export default Library;
