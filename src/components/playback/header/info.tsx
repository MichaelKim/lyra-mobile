import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { BAR_HEIGHT, Colors } from '../../../constants';
import { Pause, Play } from '../../../icons';
import { Song } from '../../../types';
import Loading from '../../loading';
import { h3, h4 } from '../../../styles';

export interface HeaderInfoProps {
  currSong: Song;
  loading: boolean;
  paused: boolean;
  setPaused: (paused: boolean) => void;
}

const HeaderInfo = ({
  currSong,
  loading,
  paused,
  setPaused
}: HeaderInfoProps) => {
  const togglePause = React.useCallback(() => setPaused(!paused), [
    paused,
    setPaused
  ]);
  return (
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
  );
};

const styles = StyleSheet.create({
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
  songTitle: h3,
  songArtist: h4,
  icon: {
    width: 25,
    height: 25
  }
});

export default HeaderInfo;
