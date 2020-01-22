import React from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';

import SongItem from '../song-item';

import { Colors } from '../../constants';
import { useCurrSong, useSelector } from '../../hooks';

import { NavigationProps } from '../../types';

interface Props extends NavigationProps {}

const Queue = (_: Props) => {
  const currSong = useCurrSong();
  const nextSongs = useSelector(state => {
    const { next } = state.queue;
    return next.map(id => state.songs[id] ?? state.queue.cache[id]?.song);
  });

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.title}>Queue</Text>
        <Text style={styles.subtitle}>Now Playing</Text>
        {currSong && (
          <View>
            <SongItem song={currSong} />
          </View>
        )}
        <Text style={styles.subtitle}>Next Up</Text>
        <View>
          {nextSongs.map(song => (
            <SongItem key={song.id} song={song} />
          ))}
        </View>
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
  },
  subtitle: {
    fontSize: 20,
    color: Colors.text
  }
});

export default Queue;
