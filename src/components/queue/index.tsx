import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants';
import { useCurrSong, useSelector } from '../../hooks';
import { h1, h2 } from '../../styles';
import { NavigationProps } from '../../types';
import SongItem from '../song-item';

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
        contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.title}>Queue</Text>
        <Text style={styles.subtitle}>Now Playing</Text>
        {currSong && (
          <View>
            <SongItem song={currSong} />
          </View>
        )}
        <View style={styles.divider} />
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
    flex: 1,
    backgroundColor: Colors.screen
  },
  scrollViewContainer: {
    paddingTop: 32,
    marginHorizontal: 24,
    flexGrow: 1
  },
  title: h1,
  subtitle: h2,
  divider: {
    height: 1,
    borderTopWidth: 1,
    borderTopColor: Colors.border
  }
});

export default Queue;
