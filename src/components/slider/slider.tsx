import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  and,
  block,
  call,
  Clock,
  clockRunning,
  cond,
  eq,
  event,
  interpolateNode,
  max,
  or,
  set,
  spring,
  startClock,
  stopClock,
  sub,
  Value
} from 'react-native-reanimated';
import { clamp, formatDuration } from '../../util';
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

type _State = {
  text: string;
};

class Slider extends React.Component<Props, _State> {
  static defaultProps = {
    minimumTrackTintColor: '#f3f',
    maximumTrackTintColor: 'transparent',
    cacheTrackTintColor: '#777',
    borderColor: '#fff'
  };

  state: _State = { text: '0:00' };

  clock = new Clock();
  clockState = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0)
  };
  config = {
    damping: 10,
    mass: 1,
    stiffness: 150,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
    toValue: new Value(0)
  };

  panState = new Value<number>(0);
  x = new Value<number>(0);
  width = new Value<number>(0);

  min = new Value<number>(this.props.minimumValue);
  max = new Value<number>(this.props.maximumValue);
  progress = new Value<number>(this.props.progress);
  seekable = new Value<number>(this.props.seekable);

  handlePan = event([
    {
      nativeEvent: {
        state: this.panState,
        x: this.x
      }
    }
  ]);

  onLayout = event([
    {
      nativeEvent: {
        layout: {
          width: this.width
        }
      }
    }
  ]);

  toPercent = (value: Animated.Adaptable<number>) =>
    interpolateNode(value, {
      inputRange: [this.min, this.max],
      outputRange: [0, this.width]
    });

  // Current position
  progressPos = this.toPercent(this.progress);
  // Seekable position
  seekablePos = this.toPercent(this.seekable);

  // Touch position of thumb
  pos = clamp(this.x, 0, this.width);

  // Touch value of slider
  value = interpolateNode(this.pos, {
    inputRange: [0, this.width],
    outputRange: [this.min, this.max]
  });

  /*
  - While panning, use the position taken from touch events
    - When done panning, send finish callback
  - While not panning, use provided position (progress)
  */
  seek = block([
    cond(
      or(eq(this.panState, State.ACTIVE), eq(this.panState, State.BEGAN)),
      [
        // Currently panning
        call([this.value], ([value]) =>
          this.setState({ text: formatDuration(value) })
        ),
        cond(
          eq(this.panState, State.BEGAN),
          call([this.value], () => this.props.onSlidingStart?.())
        ),
        this.pos
      ],
      [
        cond(
          eq(this.panState, State.END),
          [
            // Done panning
            set(this.panState, State.UNDETERMINED),
            call([this.value], ([value]) =>
              this.props.onSlidingComplete(value)
            ),
            this.pos
          ],
          // Not panning
          this.progressPos
        )
      ]
    )
  ]);

  // Thumb bubble fade animation
  runSpring = (toValue: number) => [
    cond(clockRunning(this.clock), 0, [
      set(this.clockState.finished, 0),
      set(this.clockState.velocity, 0),
      set(this.config.toValue, toValue),
      startClock(this.clock)
    ]),
    spring(this.clock, this.clockState, this.config),
    cond(this.clockState.finished, stopClock(this.clock)),
    this.clockState.position
  ];

  // Fading the thumb bubble
  opacity = cond(
    or(eq(this.panState, State.BEGAN), eq(this.panState, State.ACTIVE)),
    this.runSpring(1),
    cond(
      or(eq(this.panState, State.UNDETERMINED), eq(this.panState, State.END)),
      [
        cond(
          and(clockRunning(this.clock), eq(this.config.toValue, 1)),
          stopClock(this.clock)
        ),
        this.runSpring(0)
      ],
      this.clockState.position
    )
  );

  componentDidUpdate(prevProps: Props) {
    if (prevProps.minimumValue !== this.props.minimumValue) {
      this.min.setValue(this.props.minimumValue);
    }
    if (prevProps.maximumValue !== this.props.maximumValue) {
      this.max.setValue(this.props.maximumValue);
    }
    if (prevProps.progress !== this.props.progress) {
      this.progress.setValue(this.props.progress);
    }
    if (prevProps.seekable !== this.props.seekable) {
      this.seekable.setValue(this.props.seekable);
    }
  }

  render() {
    const {
      style,
      minimumTrackTintColor,
      maximumTrackTintColor,
      seekableTrackTintColor
    } = this.props;
    const { text } = this.state;

    return (
      <PanGestureHandler
        onGestureEvent={this.handlePan}
        onHandlerStateChange={this.handlePan}
        minDist={0}>
        <Animated.View style={[styles.root, style]}>
          <Animated.View style={styles.trackBox} onLayout={this.onLayout}>
            <Animated.View
              style={[
                styles.track,
                {
                  backgroundColor: minimumTrackTintColor,
                  flex: this.seek
                }
              ]}
            />
            <Animated.View
              style={[
                styles.track,
                {
                  backgroundColor: seekableTrackTintColor,
                  flex: max(sub(this.seekablePos, this.seek), 0)
                }
              ]}
            />
            <Animated.View
              style={[
                styles.track,
                {
                  backgroundColor: maximumTrackTintColor,
                  flex: sub(this.width, max(this.seekablePos, this.seek))
                }
              ]}
            />
          </Animated.View>
          <Animated.View
            style={[
              styles.thumbBox,
              {
                left: this.seek
              }
            ]}>
            <View
              style={[
                styles.thumb,
                {
                  backgroundColor: minimumTrackTintColor
                }
              ]}
            />
            <Animated.View
              style={[
                styles.bubble,
                {
                  opacity: this.opacity,
                  transform: [
                    {
                      scale: this.opacity
                    }
                  ]
                }
              ]}>
              <Bubble text={text} />
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
    );
  }
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

export default Slider;
