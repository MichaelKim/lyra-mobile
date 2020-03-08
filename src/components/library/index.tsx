import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { FlatList, SafeAreaView } from 'react-navigation';
import { Colors } from '../../constants';
import { useDispatch, useSelector } from '../../hooks';
import { NavigationProps, Song } from '../../types';
import { getSongList } from '../../util';
import SongItem from '../song-item';

interface Props extends NavigationProps {}

const Library = (_: Props) => {
  const songs = useSelector(state =>
    getSongList(state.songs, state.currScreen, state.sort)
  );
  const dispatch = useDispatch();

  const onSelect = React.useCallback(
    (song: Song) => {
      dispatch({ type: 'SELECT_SONG', song });
    },
    [dispatch]
  );

  return (
    <SafeAreaView style={styles.root}>
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollViewContainer}
        data={songs}
        renderItem={({ item }) => (
          <SongItem key={item.id} song={item} onSelect={onSelect} />
        )}
        ListHeaderComponent={() => <Text style={styles.title}>Library</Text>}
      />
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
