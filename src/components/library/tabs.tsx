import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import {
  BorderlessButton,
  PanGestureHandler,
  State
} from 'react-native-gesture-handler';
import Animated, {
  add,
  block,
  Clock,
  clockRunning,
  color,
  cond,
  divide,
  eq,
  event,
  greaterOrEq,
  lessOrEq,
  multiply,
  neq,
  or,
  round,
  set,
  spring,
  startClock,
  stopClock,
  sub,
  Value
} from 'react-native-reanimated';
import { Colors } from '../../constants';

interface Props {
  headers: Array<string>;
  children: Array<React.ReactElement>;
}

// TODO: make this dynamic
const WIDTH = Dimensions.get('window').width;

export default class Tabs extends React.Component<Props> {
  clock = new Clock(); // Clock for spring

  // Clock state
  clockState = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0)
  };

  // Snap (spring) config
  config = {
    damping: 50,
    mass: 0.3,
    stiffness: 121.6,
    overshootClamping: true,
    restSpeedThreshold: 0.3,
    restDisplacementThreshold: 0.3,
    toValue: new Value(0)
  };

  prevDelta = new Value<number>(0);
  delta = new Value<number>(0); // Distance of pan
  velocity = new Value<number>(0); // Velocity of pan
  panState = new Value<State>(-1); // State of panning
  prev = new Value<number>(0); // Position before moving

  manualSnap = new Value<number>(1); // Manually setting snap point (headers)

  handlePan = event([
    {
      nativeEvent: {
        translationX: this.delta,
        velocityX: this.velocity,
        state: this.panState
      }
    }
  ]);

  clamp = (
    value: Animated.Adaptable<number>,
    min: Animated.Adaptable<number>,
    max: Animated.Adaptable<number>
  ) => {
    return cond(
      lessOrEq(value, min),
      min,
      cond(greaterOrEq(value, max), max, value)
    );
  };

  // Current screen index
  idx = round(divide(this.prev, WIDTH));

  // Next position
  next = add(this.prev, sub(this.delta, this.prevDelta));

  // Expected position, if let go
  slide = add(this.next, multiply(0.5, this.velocity));

  // Expected screen index, without restriction
  nextIdx = this.clamp(
    round(divide(this.slide, WIDTH)),
    -(this.props.children.length - 1),
    0
  );

  // Snapping point, if let go
  snap = multiply(this.nextIdx, WIDTH);

  // Velocity, clamped
  newVelocity = cond(
    or(
      lessOrEq(this.next, -(this.props.children.length - 1) * WIDTH),
      greaterOrEq(this.next, 0)
    ),
    0,
    this.velocity
  );

  // Calculate position
  pos = block([
    cond(
      eq(this.panState, State.ACTIVE),
      [
        cond(clockRunning(this.clock), stopClock(this.clock)),
        set(
          this.prev,
          this.clamp(this.next, -(this.props.children.length - 1) * WIDTH, 0)
        ),
        set(this.prevDelta, this.delta)
      ],
      [
        // Start of animation, reset values
        cond(eq(this.panState, State.BEGAN), set(this.velocity, 0)), // TODO: find out why this is required
        set(this.delta, 0),
        set(this.prevDelta, 0),
        // Snap
        cond(clockRunning(this.clock), 0, [
          // Start clock
          set(this.clockState.finished, 0),
          set(this.clockState.velocity, this.newVelocity),
          set(this.clockState.position, this.prev),
          set(this.config.toValue, this.snap),
          startClock(this.clock)
        ]),
        cond(neq(this.manualSnap, 1), [
          set(this.config.toValue, this.manualSnap),
          set(this.manualSnap, 1)
        ]),
        spring(this.clock, this.clockState, this.config),
        cond(this.clockState.finished, [
          stopClock(this.clock),
          set(this.velocity, 0)
        ]),
        set(this.prev, this.clockState.position),
        set(this.velocity, this.clockState.velocity)
      ]
    ),
    this.prev
  ]);

  render() {
    const { headers, children } = this.props;

    return (
      <>
        <View style={styles.titles}>
          {headers.map((h, i) => (
            <BorderlessButton
              key={h}
              onPress={() => this.manualSnap.setValue(-i * WIDTH)}>
              <Animated.Text
                style={[
                  styles.title,
                  // @ts-ignore
                  {
                    color: cond(
                      eq(-i, this.idx),
                      color(255, 255, 255),
                      color(127, 127, 127)
                    )
                  }
                ]}>
                {h}
              </Animated.Text>
            </BorderlessButton>
          ))}
        </View>
        <PanGestureHandler
          onGestureEvent={this.handlePan}
          onHandlerStateChange={this.handlePan}>
          <Animated.View
            style={[
              styles.slider,
              {
                width: children.length * WIDTH,
                transform: [
                  {
                    translateX: this.pos
                  }
                ]
              }
            ]}>
            {children}
          </Animated.View>
        </PanGestureHandler>
      </>
    );
  }
}

const styles = StyleSheet.create({
  titles: {
    paddingTop: 32,
    marginHorizontal: 24,
    flexDirection: 'row'
  },
  title: {
    fontSize: 30,
    color: Colors.text,
    marginBottom: 10,
    paddingRight: 10
  },
  slider: {
    flexDirection: 'row'
  }
});
