import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import TrackPlayer, { useTrackPlayerProgress } from 'react-native-track-player';
import { Colors } from '../../../constants';
import { useDispatch, useSelector } from '../../../hooks';
import { Shuffle } from '../../../icons';
import { h4 } from '../../../styles';
import { formatDuration } from '../../../util';
import Slider from '../../slider';
import Controls from './controls';

interface Props {}

const Footer = (_: Props) => {
  const shuffle = useSelector(state => state.shuffle);

  const dispatch = useDispatch();
  const toggleShuffle = React.useCallback(
    () => dispatch({ type: 'SET_SHUFFLE', shuffle: !shuffle }),
    [dispatch, shuffle]
  );

  const { position, bufferedPosition, duration } = useTrackPlayerProgress();

  const onSeek = React.useCallback(
    (value: number) => TrackPlayer.seekTo(value),
    []
  );

  return (
    <View style={styles.playback}>
      <View style={styles.timeBar}>
        <Text style={styles.time}>{formatDuration(position)}</Text>
        <Slider
          value={position}
          loaded={bufferedPosition}
          max={duration}
          onChange={onSeek}
        />
        <Text style={styles.time}>{formatDuration(duration)}</Text>
      </View>
      <View style={styles.controls}>
        <View style={styles.buttonsLeft} />
        <Controls />
        <View style={styles.buttonsRight}>
          <TouchableOpacity onPress={toggleShuffle}>
            <Shuffle width={30} height={30} fillOpacity={shuffle ? 1 : 0.5} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  playback: {
    backgroundColor: Colors.controls,
    height: 80,
    flexDirection: 'column'
  },
  timeBar: {
    flexDirection: 'row',
    marginHorizontal: 10
  },
  time: h4,
  controls: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
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

export default Footer;
