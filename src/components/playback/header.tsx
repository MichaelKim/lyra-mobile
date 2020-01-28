import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import Loading from '../loading';
import { Play, Pause } from '../../icons';

import { Colors, BAR_HEIGHT } from '../../constants';
import { Song } from '../../types';

interface Props {
  currSong: Song;
  loading: boolean;
  paused: boolean;
  togglePause: () => void;
  progress: {
    currentTime: number;
    playableDuration: number;
    seekableDuration: number;
  };
}

const PlaybackHeader = ({
  currSong,
  loading,
  paused,
  togglePause,
  progress: { currentTime, seekableDuration }
}: Props) => {
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
        {loading ? (
          <View style={styles.icon}>
            <Loading />
          </View>
        ) : (
          <TouchableOpacity onPress={togglePause}>
            {paused ? (
              <Play width={25} height={25} />
            ) : (
              <Pause width={25} height={25} />
            )}
          </TouchableOpacity>
        )}
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
  },
  icon: {
    width: 25,
    height: 25
  }
});

export default PlaybackHeader;
