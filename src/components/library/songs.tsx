import React from 'react';
import { StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from '../../hooks';
import { Song } from '../../types';
import { getSongList } from '../../util';
import SongItem from '../song-item';

interface Props {}

const Songs = (_: Props) => {
  const songs = useSelector(state =>
    getSongList(state.songs, state.currScreen, state.sort)
  );

  const dispatch = useDispatch();
  const onSelect = (song: Song) => dispatch({ type: 'SELECT_SONG', song });

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.scrollViewContainer}
      data={songs}
      renderItem={({ item }) => (
        <SongItem key={item.id} song={item} onSelect={onSelect} />
      )}
    />
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    marginHorizontal: 24
  }
});

export default Songs;
