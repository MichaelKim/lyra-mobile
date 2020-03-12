import React from 'react';
import { StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-navigation';
import { Colors } from '../../constants';
import { useDispatch, useSelector } from '../../hooks';
import { NavigationProps, Song } from '../../types';
import { getSongList } from '../../util';
import SongItem from '../song-item';
import Tabs from './tabs';

interface Props extends NavigationProps {}

const Library = (_: Props) => {
  const songs = useSelector(state =>
    getSongList(state.songs, state.currScreen, state.sort)
  );

  const dispatch = useDispatch();
  const onSelect = (song: Song) => dispatch({ type: 'SELECT_SONG', song });

  return (
    <SafeAreaView style={styles.root}>
      <Tabs headers={['Library', 'Library2', 'Library3']}>
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.scrollViewContainer}
          data={songs}
          renderItem={({ item }) => (
            <SongItem key={item.id} song={item} onSelect={onSelect} />
          )}
        />
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.scrollViewContainer}
          data={songs}
          renderItem={({ item }) => (
            <SongItem key={item.id} song={item} onSelect={onSelect} />
          )}
        />
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.scrollViewContainer}
          data={songs}
          renderItem={({ item }) => (
            <SongItem key={item.id} song={item} onSelect={onSelect} />
          )}
        />
      </Tabs>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.screen
  },
  scrollViewContainer: {
    marginHorizontal: 24
  }
});

export default Library;
