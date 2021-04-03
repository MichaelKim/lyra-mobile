import React, { useEffect } from 'react';
import { LayoutChangeEvent, StyleSheet } from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  TapGestureHandler
} from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withSpring
} from 'react-native-reanimated';
import { useSafeAreaFrame } from 'react-native-safe-area-context';
import { Colors, NAVIGATION_HEIGHT } from '../../constants';

interface PassedProps {
  tab: number;
  renderHeader: () => React.ReactNode;
  renderContent: () => React.ReactNode;
  renderFooter: () => React.ReactNode;
}

type Props = PassedProps & {
  height: number;
};

type GestureContext = {
  start: number; // Position of slide on touch start
};

const SPRING_CONFIG = {
  damping: 50,
  mass: 0.3,
  stiffness: 121.6,
  overshootClamping: true,
  restSpeedThreshold: 0.3,
  restDisplacementThreshold: 0.3
};

function BottomSheet({
  height,
  tab,
  renderHeader,
  renderContent,
  renderFooter
}: Props) {
  const y = useSharedValue(0); // Position
  // Heights
  const headerHeight = useSharedValue(62);
  const contentHeight = useSharedValue(646);
  const footerHeight = useSharedValue(80);

  const top = useDerivedValue(
    () => -(height - headerHeight.value - NAVIGATION_HEIGHT + 3)
  );

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    GestureContext
  >({
    onStart(_, ctx) {
      cancelAnimation(y);
      ctx.start = y.value;
    },
    onActive(e, ctx) {
      y.value = ctx.start + e.translationY;
    },
    onEnd({ velocityY }) {
      if (y.value + velocityY * 0.5 > top.value / 2) {
        // spring to 0
        y.value = withSpring(0, SPRING_CONFIG);
      } else if (y.value > top.value) {
        // spring to top
        y.value = withSpring(top.value, SPRING_CONFIG);
      } else {
        // decay
        y.value = withDecay({
          velocity: velocityY,
          deceleration: 0.998,
          clamp: [-(contentHeight.value + footerHeight.value), top.value]
        });
      }
    }
  });

  const sheetStyle = useAnimatedStyle(() => ({
    height: -top.value,
    transform: [
      {
        translateY: Math.max(y.value, top.value)
      }
    ]
  }));

  const contentStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: Math.min(y.value - top.value, 0)
      }
    ],
    top: headerHeight.value,
    minHeight: -top.value + footerHeight.value
  }));

  const footerStyle = useAnimatedStyle(() => ({
    bottom: top.value + footerHeight.value
  }));

  const onHeaderLayout = (e: LayoutChangeEvent) => {
    y.value = withSpring(
      y.value > top.value / 2 ? 0 : top.value,
      SPRING_CONFIG
    );
    headerHeight.value = e.nativeEvent.layout.height;
  };

  const onContentLayout = (e: LayoutChangeEvent) => {
    y.value = withSpring(
      y.value > top.value / 2 ? 0 : top.value,
      SPRING_CONFIG
    );
    contentHeight.value = e.nativeEvent.layout.height;
  };

  const onFooterLayout = (e: LayoutChangeEvent) => {
    y.value = withSpring(
      y.value > top.value / 2 ? 0 : top.value,
      SPRING_CONFIG
    );
    footerHeight.value = e.nativeEvent.layout.height;
  };

  useEffect(() => {
    y.value = withSpring(0, SPRING_CONFIG);
  }, [y, tab]);

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.sheet, sheetStyle]}>
        <TapGestureHandler>
          <Animated.View>
            <Animated.View style={styles.header} onLayout={onHeaderLayout}>
              {renderHeader()}
            </Animated.View>
            <Animated.View
              style={[styles.content, contentStyle]}
              onLayout={onContentLayout}>
              {renderContent()}
            </Animated.View>
            <Animated.View
              style={[styles.footer, footerStyle]}
              onLayout={onFooterLayout}>
              {renderFooter()}
            </Animated.View>
          </Animated.View>
        </TapGestureHandler>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: Colors.playback
  },
  header: {
    zIndex: 1
  },
  content: {
    position: 'absolute',
    left: 0,
    right: 0,
    flex: 1
  },
  footer: {
    position: 'relative',
    zIndex: 1
  }
});

const Frame = (props: PassedProps) => {
  const frame = useSafeAreaFrame();
  return <BottomSheet {...props} height={Math.ceil(frame.height)} />;
};

export default Frame;
