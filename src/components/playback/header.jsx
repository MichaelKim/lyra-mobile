// @flow strict

import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import { Colors, BAR_HEIGHT } from '../../constants';

import type { Song } from '../../types';

type Props = {|
  +currSong: Song,
  +loading: boolean,
  +paused: boolean,
  +setPaused: (paused: boolean) => mixed,
  +progress: {|
    +currentTime: number,
    +playableDuration: number,
    +seekableDuration: number
  |}
|};

const PlaybackHeader = (props: Props) => {
  const {
    currSong,
    loading,
    paused,
    setPaused,
    progress: { currentTime, seekableDuration }
  } = props;

  return (
    <View style={styles.root}>
      <View style={styles.progressBar}>
        <View
          style={{ flex: currentTime, backgroundColor: Colors.placeholder }}
        />
        <View
          style={{
            flex: seekableDuration - currentTime,
            backgroundColor: Colors.screen
          }}
        />
      </View>
      <View style={styles.header}>
        <View style={styles.song}>
          <Text style={styles.songTitle}>{currSong.title}</Text>
          <Text style={styles.songArtist}>{currSong.artist}</Text>
        </View>
        <Button
          title={loading ? '...' : paused ? '>' : '||'}
          onPress={() => setPaused(!paused)}
          disabled={loading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'column'
  },
  progressBar: {
    height: 2,
    flexDirection: 'row'
  },
  header: {
    backgroundColor: Colors.playback,
    height: BAR_HEIGHT,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center'
  },
  song: {
    flex: 1
  },
  songTitle: {
    fontSize: 15,
    color: Colors.text
  },
  songArtist: {
    fontSize: 12,
    color: Colors.text
  }
  // playPause: {
  //   width: 30,
  //   height: 30
  // }
});

export default PlaybackHeader;
