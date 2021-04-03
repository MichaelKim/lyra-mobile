import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent
} from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import TabTitle from './title';

type Props = {
  headers: Array<string>;
  children: Array<React.ReactElement>;
};

type GestureContext = {
  start: number; // Position of tabs on touch start
};

const SPRING_CONFIG = {
  damping: 50,
  mass: 0.3,
  stiffness: 121.6,
  overshootClamping: true,
  restSpeedThreshold: 0.3,
  restDisplacementThreshold: 0.3
};

export default function Tabs({ headers, children }: Props) {
  const numTabs = children.length;

  const width = useSharedValue(Dimensions.get('window').width);
  const x = useSharedValue(0); // Position
  const vx = useSharedValue(0); // Velocity

  useEffect(() => {
    function onRotate() {
      const newWidth = Dimensions.get('window').width;
      x.value = (x.value / width.value) * newWidth;
      width.value = newWidth;
    }

    Dimensions.addEventListener('change', onRotate);

    return () => Dimensions.removeEventListener('change', onRotate);
  }, [width, x]);

  const onButtonClick = (index: number) => {
    x.value = withSpring(-index * width.value, SPRING_CONFIG);
  };

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    GestureContext
  >({
    onStart: (_, ctx) => {
      // Keep track of position at start of slide
      cancelAnimation(x);
      ctx.start = x.value;
    },
    onActive: (e, ctx) => {
      x.value = ctx.start + e.translationX;
      vx.value = e.velocityX;
    },
    onEnd: () => {
      // Do spring to nearest tab
      const slide = x.value + vx.value * 0.07;
      // Clamp to [-(numTabs - 1), 0]
      const nextIdx = Math.min(
        Math.max(Math.round(slide / width.value), -numTabs + 1),
        0
      );
      const snap = nextIdx * width.value;
      x.value = withSpring(snap, SPRING_CONFIG);
    }
  });

  const sliderStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: x.value
      }
    ],
    width: numTabs * width.value
  }));

  const index = useDerivedValue(() =>
    Math.min(Math.max(Math.round(-x.value / width.value), 0), numTabs - 1)
  );

  return (
    <>
      <View style={styles.titles}>
        {headers.map((h, i) => (
          <TabTitle
            key={h}
            title={h}
            index={i}
            selectedIndex={index}
            onClick={onButtonClick}
          />
        ))}
      </View>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={styles.sliderBox}>
          <Animated.View style={[styles.slider, sliderStyle]}>
            {React.Children.map(children, child => (
              <Animated.View style={styles.slideItem}>{child}</Animated.View>
            ))}
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
    </>
  );
}

const styles = StyleSheet.create({
  titles: {
    paddingTop: 32,
    marginHorizontal: 24,
    flexDirection: 'row'
  },
  sliderBox: {
    flex: 1,
    position: 'relative'
  },
  slider: {
    position: 'absolute',
    flexDirection: 'row'
  },
  slideItem: {
    flex: 1
  }
});
