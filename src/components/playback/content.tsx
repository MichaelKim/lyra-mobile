import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import Slider from '../slider';
import {
  Queue,
  Previous,
  Replay,
  Play,
  Pause,
  Forward,
  Next,
  Shuffle
} from '../../icons';

import { Colors } from '../../constants';
import { useDispatch, useSelector, useToggle } from '../../hooks';
import { formatDuration } from '../../util';
import { Song } from '../../types';

interface Props {
  currSong: Song;
  progress: {
    currentTime: number;
    playableDuration: number;
    seekableDuration: number;
  };
  onSeek: (seek: number) => void;
  paused: boolean;
  setPaused: (paused: boolean) => void;
}

const PlaybackContent = (props: Props) => {
  const { currSong, progress, onSeek, paused, setPaused } = props;
  const shuffle = useSelector(state => state.shuffle);
  const dispatch = useDispatch();

  const [showQueue, toggleQueue] = useToggle(false);

  return (
    <View style={styles.root}>
      <View style={styles.thumbnail}>
        {showQueue ? (
          <Text>queue</Text>
        ) : (
          <>
            <Text>{currSong.title}</Text>
            <Text>{currSong.artist}</Text>
          </>
        )}
      </View>
      <View style={styles.playback}>
        <Slider
          value={progress.currentTime}
          max={progress.seekableDuration}
          onChange={onSeek}
        />
        <View style={styles.timeBar}>
          <Text style={styles.time}>
            {formatDuration(progress.currentTime)}
          </Text>
          <Text style={styles.time}>
            {formatDuration(progress.seekableDuration)}
          </Text>
        </View>
        <View style={styles.controls}>
          <View style={styles.buttonsLeft}>
            <TouchableOpacity onPress={toggleQueue}>
              <Queue width={30} height={30} fillOpacity={showQueue ? 1 : 0.5} />
            </TouchableOpacity>
          </View>
          <View style={styles.buttonsCenter}>
            <TouchableOpacity
              onPress={() => dispatch({ type: 'SKIP_PREVIOUS' })}>
              <Previous width={30} height={30} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onSeek(progress.currentTime - 10)}>
              <Replay width={30} height={30} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setPaused(!paused)}>
              {paused ? (
                <Play width={30} height={30} />
              ) : (
                <Pause width={30} height={30} />
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onSeek(progress.currentTime + 10)}>
              <Forward width={30} height={30} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => dispatch({ type: 'SKIP_NEXT' })}>
              <Next width={30} height={30} />
            </TouchableOpacity>
          </View>
          <View style={styles.buttonsRight}>
            <TouchableOpacity
              onPress={() =>
                dispatch({ type: 'SET_SHUFFLE', shuffle: !shuffle })
              }>
              <Shuffle width={30} height={30} fillOpacity={shuffle ? 1 : 0.5} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: Colors.screen,
    height: '100%'
  },
  thumbnail: {
    flex: 1
  },
  playback: {
    backgroundColor: '#555',
    height: 70,
    flexDirection: 'column'
  },
  timeBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10
  },
  time: {
    fontSize: 12,
    color: Colors.text
  },
  controls: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonsLeft: {
    position: 'absolute',
    left: 0
  },
  buttonsCenter: {
    flexDirection: 'row'
  },
  buttonsRight: {
    position: 'absolute',
    right: 0
  }
});

export default PlaybackContent;
