import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { BAR_HEIGHT, Colors } from '../../../constants';
import { Pause, Play } from '../../../icons';
import { Song } from '../../../types';
import Loading from '../../loading';
import { h3, h4 } from '../../../styles';
import Thumbnail from '../../thumbnail';
import TrackPlayer, { usePlaybackState } from 'react-native-track-player';

export interface Props {
  currSong: Song;
}

const BUTTON_SIZE = 40;

const HeaderInfo = ({ currSong }: Props) => {
  const playbackState = usePlaybackState();

  const loading =
    playbackState === TrackPlayer.STATE_BUFFERING ||
    playbackState === TrackPlayer.STATE_CONNECTING;

  const paused = playbackState === TrackPlayer.STATE_PAUSED;

  const togglePause = React.useCallback(() => {
    if (paused) TrackPlayer.play();
    else TrackPlayer.pause();
  }, [paused]);

  return (
    <View style={styles.header}>
      <Thumbnail style={styles.thumbnail} src={currSong.thumbnail.url} />
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
            <Play width={BUTTON_SIZE} height={BUTTON_SIZE} />
          ) : (
            <Pause width={BUTTON_SIZE} height={BUTTON_SIZE} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.sheet,
    height: BAR_HEIGHT,
    paddingRight: 24,
    flexDirection: 'row',
    alignItems: 'center'
  },
  thumbnail: {
    width: 45,
    height: 45,
    marginHorizontal: 8
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
