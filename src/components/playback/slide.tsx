import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

import { Colors, BAR_HEIGHT } from '../../constants';

const {
  set,
  cond,
  block,
  event,
  eq,
  neq,
  add,
  sub,
  multiply,
  lessThan,
  Value,
  Clock,
  startClock,
  stopClock,
  clockRunning,
  spring
} = Animated;

interface Props {
  renderHeader: () => React.ReactNode;
  renderContent: () => React.ReactNode;
}

interface IState {
  lastSnap: number;
}

const NAVIGATION_HEIGHT = 50;
const windowHeight = Dimensions.get('window').height;
const TOP = -windowHeight + NAVIGATION_HEIGHT + BAR_HEIGHT;

export class BottomSheet extends React.Component<Props, IState> {
  // tapRef = React.createRef<TapGestureHandler>();
  // panRef = React.createRef<PanGestureHandler>();

  /*
  Swiping algorithm:
  - Get translationY, velocityY
  - nextY = position + translationY + dampen * velocityY
  - if nextY is closer to TOP than 0, then
    - go to TOP
  - otherwise,
    - go to 0
  */

  clock = new Clock(); // Clock for spring

  prevDelta = new Value<number>(0);
  delta = new Value<number>(0); // Distance of pan
  velocity = new Value<number>(0); // Velocity of pan
  panState = new Value(-1); // State of panning
  prev = new Value<number>(0); // Position before moving

  handlePan = event([
    {
      nativeEvent: {
        translationY: this.delta,
        velocityY: this.velocity,
        state: this.panState
      }
    }
  ]);

  // Clock state
  clockState = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0)
  };

  // Next expected position, if let go
  next = add(
    this.prev,
    sub(this.delta, this.prevDelta),
    multiply(0.5, this.velocity)
  );

  // Snapping point, if let go
  snap = cond(lessThan(this.next, TOP / 2), TOP, 0);

  config = {
    damping: 50,
    mass: 0.3,
    stiffness: 121.6,
    overshootClamping: true,
    restSpeedThreshold: 0.3,
    restDisplacementThreshold: 0.3,
    toValue: new Value(0)
  };

  // handleTouch = event([
  //   {
  //     nativeEvent: ({ state }) =>
  //       cond(
  //         eq(state, State.END),
  //         cond(clockRunning(this.clock), 0, [
  //           set(this.clockState.finished, 0),
  //           set(this.clockState.position, this.prev),
  //           set(
  //             this.config.toValue,
  //             cond(lessThan(this.prev, TOP / 2), 0, TOP)
  //           ),
  //           startClock(this.clock)
  //         ])
  //       )
  //   }
  // ]);

  pos = block([
    cond(
      eq(this.panState, State.ACTIVE),
      [
        cond(clockRunning(this.clock), stopClock(this.clock)),
        set(this.prev, add(this.prev, sub(this.delta, this.prevDelta))),
        set(this.prevDelta, this.delta)
      ],
      cond(neq(this.panState, -1), [
        // Start of spring
        cond(eq(this.panState, State.BEGAN), set(this.velocity, 0)), // TODO: find out why this is required
        set(this.delta, 0),
        set(this.prevDelta, 0),
        cond(clockRunning(this.clock), 0, [
          // Start clock
          set(this.clockState.finished, 0),
          set(this.clockState.velocity, this.velocity),
          set(this.clockState.position, this.prev),
          set(this.config.toValue, this.snap),
          startClock(this.clock)
        ]),
        spring(this.clock, this.clockState, this.config),
        cond(this.clockState.finished, [
          stopClock(this.clock),
          set(this.velocity, 0)
        ]),
        set(this.prev, this.clockState.position),
        set(this.velocity, this.clockState.velocity)
      ])
    ),
    this.prev
  ]);

  // clamped = Animated.diffClamp(this.pos, TOP, 0);

  render() {
    return (
      <View style={styles.root}>
        {/* <Animated.Code>
          {() => Animated.call([this.snap], console.log)}
        </Animated.Code> */}
        <PanGestureHandler
          // ref={this.panRef}
          // simultaneousHandlers={[this.tapRef]}
          // waitFor={this.tapRef}
          // minDist={20}
          onGestureEvent={this.handlePan}
          onHandlerStateChange={this.handlePan}>
          <Animated.View
            style={[
              styles.container,
              {
                top: this.pos
              }
            ]}>
            {/* <TapGestureHandler
              ref={this.tapRef}
              simultaneousHandlers={[this.panRef]}
              onHandlerStateChange={this.handleTouch}
              > */}
            <Animated.View style={styles.header}>
              {this.props.renderHeader()}
            </Animated.View>
            {/* </TapGestureHandler> */}
            <View style={styles.content}>{this.props.renderContent()}</View>
          </Animated.View>
        </PanGestureHandler>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    height: BAR_HEIGHT,
    backgroundColor: Colors.playback
  },
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0
  },
  header: {
    height: BAR_HEIGHT
  },
  content: {
    height: -TOP
  }
});

export default BottomSheet;
