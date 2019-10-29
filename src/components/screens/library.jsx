// @flow strict

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

import SongItem from '../song-item';

import { Colors } from '../../constants';
import { useSelector, useDispatch } from '../../hooks';
import { getSongList } from '../../util';

import type { Song } from '../../types';

type Props = {|
  +navigation: {|
    +navigate: (screenName: string) => void,
    +getParam: <T>(paramName: string, defaultValue: T) => T
  |}
|};

const Library = (props: Props) => {
  const songs = useSelector(state =>
    getSongList(state.songs, state.currScreen, state.sort)
  );
  const dispatch = useDispatch();

  const onSelect = (song: Song) => {
    dispatch({ type: 'SELECT_SONG', song });
  };

  return (
    <SafeAreaView>
      <View style={styles.root}>
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
      </View>
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
