import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Colors } from '../../constants';
import { useDispatch, useSelector } from '../../hooks';
import { NavigationProps, Song } from '../../types';
import { getSongList } from '../../util';
import SongItem from '../song-item';
import Tabs from './tabs';
import LinearGradient from 'react-native-linear-gradient';

interface Props extends NavigationProps {}

const Library = (_: Props) => {
  const songs = useSelector(state =>
    getSongList(state.songs, state.currScreen, state.sort)
  );

  const dispatch = useDispatch();
  const onSelect = (song: Song) => dispatch({ type: 'SELECT_SONG', song });

  return (
    <SafeAreaView style={styles.root}>
      <LinearGradient
        colors={[Colors.gradient, Colors.screen]}
        locations={[0, 0.1]}
        style={styles.linearGradient}>
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
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.screen
  },
  linearGradient: {
    flex: 1
  },
  scrollViewContainer: {
    marginHorizontal: 24
  }
});

export default Library;
