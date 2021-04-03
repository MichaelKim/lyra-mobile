import React, { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View, ViewStyle } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { formatDuration } from '../../util';
import Bubble, { BUBBLE_WIDTH } from './bubble';

const THUMB_SIZE = 16;

type Props = {
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
  seekableTrackTintColor?: string;
  style?: ViewStyle;
  progress: number;
  seekable: number;
  minimumValue: number;
  maximumValue: number;
  onSlidingStart?: () => void;
  onSlidingComplete: (value: number) => void;
};

const SPRING_CONFIG = {
  damping: 10,
  mass: 1,
  stiffness: 150,
  overshootClamping: false,
  restSpeedThreshold: 0.001,
  restDisplacementThreshold: 0.001
};

export default function Slider({
  minimumTrackTintColor = '#fcf',
  maximumTrackTintColor = 'transparent',
  seekableTrackTintColor = '#777',
  style,
  progress,
  seekable,
  minimumValue,
  maximumValue,
  onSlidingStart,
  onSlidingComplete
}: Props) {
  const [text, setText] = useState('0:00');

  const dragging = useSharedValue(false);
  const opacity = useSharedValue(0);
  const x = useSharedValue(0);
  const width = useSharedValue(200);

  function toPercent(value: number) {
    'worklet';
    return interpolate(value, [0, width.value], [minimumValue, maximumValue]);
  }

  function setBubbleText(value: number) {
    setText(formatDuration(value));
  }

  const handler = useAnimatedGestureHandler({
    onStart: () => {
      dragging.value = true;
      cancelAnimation(opacity);
      onSlidingStart && runOnJS(onSlidingStart)();
    },
    onActive: e => {
      opacity.value = withSpring(1, SPRING_CONFIG);
      x.value = Math.min(Math.max(e.x, 0), width.value);
      runOnJS(setBubbleText)(toPercent(x.value));
    },
    onEnd: () => {
      dragging.value = false;
      opacity.value = withSpring(0, SPRING_CONFIG);
      runOnJS(onSlidingComplete)(toPercent(x.value));
    }
  });

  const thumbBoxStyle = useAnimatedStyle(() => ({
    left: dragging.value
      ? x.value
      : interpolate(progress, [minimumValue, maximumValue], [0, width.value])
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      {
        scale: opacity.value
      }
    ]
  }));

  const onLayout = (e: LayoutChangeEvent) => {
    width.value = e.nativeEvent.layout.width;
  };

  return (
    <PanGestureHandler onGestureEvent={handler} minDist={0}>
      <Animated.View style={[styles.root, style]}>
        <Animated.View style={styles.trackBox} onLayout={onLayout}>
          <Animated.View
            style={[
              styles.track,
              {
                backgroundColor: minimumTrackTintColor,
                flex: progress - minimumValue
              }
            ]}
          />
          <Animated.View
            style={[
              styles.track,
              {
                backgroundColor: seekableTrackTintColor,
                flex: seekable - progress
              }
            ]}
          />
          <Animated.View
            style={[
              styles.track,
              {
                backgroundColor: maximumTrackTintColor,
                flex: maximumValue - seekable
              }
            ]}
          />
        </Animated.View>
        <Animated.View style={[styles.thumbBox, thumbBoxStyle]}>
          <View
            style={[
              styles.thumb,
              {
                backgroundColor: minimumTrackTintColor
              }
            ]}
          />
          <Animated.View style={[styles.bubble, thumbStyle]}>
            <Bubble text={text} />
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  root: {
    height: 20,
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1
  },
  trackBox: {
    flex: 1,
    height: 20,
    alignItems: 'center',
    flexDirection: 'row'
  },
  track: {
    height: 5,
    borderRadius: 2
  },
  thumbBox: {
    position: 'absolute'
  },
  thumb: {
    left: -THUMB_SIZE / 2,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 30
  },
  bubble: {
    position: 'absolute',
    bottom: 20,
    left: -BUBBLE_WIDTH / 2,
    width: BUBBLE_WIDTH
  }
});
