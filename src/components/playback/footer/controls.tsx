import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Forward, Next, Pause, Play, Previous, Replay } from '../../../icons';
import { Colors } from '../../../constants';
import TrackPlayer, {
  useTrackPlayerProgress,
  usePlaybackState
} from 'react-native-track-player';
import { useDispatch } from '../../../hooks';

interface Props {}

const BUTTON_SIZE = 30;

const Controls = (_: Props) => {
  const dispatch = useDispatch();

  const { position } = useTrackPlayerProgress();

  const playbackState = usePlaybackState();
  const paused = playbackState === TrackPlayer.STATE_PAUSED;

  const togglePause = React.useCallback(() => {
    if (paused) TrackPlayer.play();
    else TrackPlayer.pause();
  }, [paused]);

  const onReplay = React.useCallback(() => TrackPlayer.seekTo(position - 10), [
    position
  ]);

  const onForward = React.useCallback(() => TrackPlayer.seekTo(position + 10), [
    position
  ]);

  const skipPreviousOrStart = React.useCallback(async () => {
    await TrackPlayer.pause();
    await TrackPlayer.seekTo(0);
    if (position < 3) {
      dispatch({ type: 'SKIP_PREVIOUS' });
      await TrackPlayer.skipToPrevious();
    }
  }, [dispatch, position]);

  const skipNext = React.useCallback(async () => {
    await TrackPlayer.pause();
    await TrackPlayer.seekTo(0);
    dispatch({ type: 'SKIP_NEXT' });
    await TrackPlayer.skipToNext();
  }, [dispatch]);

  return (
    <View style={styles.root}>
      <TouchableOpacity onPress={skipPreviousOrStart}>
        <Previous
          width={BUTTON_SIZE}
          height={BUTTON_SIZE}
          style={styles.button}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={onReplay}>
        <Replay
          width={BUTTON_SIZE}
          height={BUTTON_SIZE}
          style={styles.button}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={togglePause}>
        <View style={[styles.button, styles.center]}>
          {paused ? (
            <Play width={40} height={40} />
          ) : (
            <Pause width={40} height={40} />
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={onForward}>
        <Forward
          width={BUTTON_SIZE}
          height={BUTTON_SIZE}
          style={styles.button}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={skipNext}>
        <Next width={BUTTON_SIZE} height={BUTTON_SIZE} style={styles.button} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center'
  },
  button: {
    marginHorizontal: 4
  },
  center: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default React.memo(Controls);
