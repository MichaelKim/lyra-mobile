import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import Controls from './controls';
import Playing from './playing';
import Slider from '../slider';
import { Shuffle } from '../../icons';

import { Colors } from '../../constants';
import { useDispatch, useSelector } from '../../hooks';
import { formatDuration } from '../../util';
import { Song } from '../../types';

interface Props {
  paused: boolean;
  currSong: Song;
  progress: {
    currentTime: number;
    playableDuration: number;
    seekableDuration: number;
  };
  onSeek: (seek: number) => void;
  togglePause: () => void;
}

const PlaybackContent = ({
  paused,
  currSong,
  progress,
  onSeek,
  togglePause
}: Props) => {
  const shuffle = useSelector(state => state.shuffle);

  const dispatch = useDispatch();
  const skipPrevious = () => dispatch({ type: 'SKIP_PREVIOUS' });
  const skipNext = () => dispatch({ type: 'SKIP_NEXT' });
  const onDeltaSeek = (delta: number) => onSeek(progress.currentTime + delta);

  return (
    <View style={styles.root}>
      <View style={styles.thumbnail}>
        {currSong.source === 'YOUTUBE' ? (
          <Playing currSong={currSong} />
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
          <View style={styles.buttonsLeft} />
          <Controls
            paused={paused}
            skipPrevious={skipPrevious}
            skipNext={skipNext}
            togglePause={togglePause}
            onDeltaSeek={onDeltaSeek}
          />
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
    flexDirection: 'row'
  },
  buttonsLeft: {
    flex: 1
  },
  buttonsRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
});

export default PlaybackContent;
