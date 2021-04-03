import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';
import { VolumeHigh, VolumeLow, VolumeMute } from '../../icons';

function Playing() {
  const progress = useSharedValue(0);
  progress.value = withRepeat(
    withTiming(1, { duration: 2000, easing: Easing.linear }),
    -1
  );

  const lowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  }));

  const highStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.3, 0.6, 0.7, 1], [0, 0, 1, 1, 0])
  }));

  return (
    <View style={[styles.root, styles.square]}>
      <VolumeMute width={25} height={25} style={styles.mute} />
      <Animated.View style={[styles.icon, styles.square, styles.low, lowStyle]}>
        <VolumeLow width={25} height={25} />
      </Animated.View>
      <Animated.View style={[styles.icon, styles.square, highStyle]}>
        <VolumeHigh width={25} height={25} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    marginRight: 8
  },
  square: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center'
  },
  mute: {
    left: -4
  },
  low: {
    left: -2
  },
  icon: {
    position: 'absolute'
  }
});

export default Playing;
