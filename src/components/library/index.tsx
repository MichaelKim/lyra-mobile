import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
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
        contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.title}>Library</Text>
        {songs.map(song => (
          <SongItem key={song.id} song={song} onPress={() => onSelect(song)} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.screen
  },
  scrollViewContainer: {
    paddingTop: 32,
    marginHorizontal: 24
  },
  title: {
    fontSize: 30,
    color: Colors.text,
    marginBottom: 10
  }
});

export default Library;
