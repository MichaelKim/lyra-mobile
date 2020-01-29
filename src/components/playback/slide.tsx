import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import {
  PanGestureHandler,
  State,
  TapGestureHandler
} from 'react-native-gesture-handler';

import { BAR_HEIGHT } from '../../constants';

const {
  set,
  cond,
  block,
  event,
  eq,
  neq,
  not,
  add,
  sub,
  multiply,
  lessOrEq,
  greaterOrEq,
  Value,
  Clock,
  startClock,
  stopClock,
  clockRunning,
  spring,
  decay
} = Animated;

interface Props {
  renderHeader: () => React.ReactNode;
  renderContent: () => React.ReactNode;
  renderFooter: () => React.ReactNode;
}

const NAVIGATION_HEIGHT = 50;
// TODO: make this dynamic
const windowHeight = Dimensions.get('window').height;
const TOP = -windowHeight + NAVIGATION_HEIGHT + BAR_HEIGHT;

export class BottomSheet extends React.Component<Props> {
  headerHeight = new Value(60);
  contentHeight = new Value(646);
  footerHeight = new Value(70);

  onHeaderLayout = event([
    {
      nativeEvent: {
        layout: {
          height: this.headerHeight
        }
      }
    }
  ]);

  onContentLayout = event([
    {
      nativeEvent: {
        layout: {
          height: this.contentHeight
        }
      }
    }
  ]);

  onFooterLayout = event([
    {
      nativeEvent: {
        layout: {
          height: this.footerHeight
        }
      }
    }
  ]);

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

  // Sliding (delay) config
  config2 = {
    deceleration: 0.998
  };

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

  // Next position
  next = add(this.prev, sub(this.delta, this.prevDelta));

  // Expected position, if let go
  slide = add(this.next, multiply(0.5, this.velocity));

  // Snapping point, if let go
  snap = cond(lessOrEq(this.slide, TOP / 2), TOP, 0);

  // Velocity, clamped
  newVelocity = cond(greaterOrEq(this.next, 0), 0, this.velocity);

  // Content height + footer height: the highest the content can go (negative value)
  contentLimit = sub(sub(0, this.contentHeight), this.footerHeight);

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

  pos = block([
    cond(
      eq(this.panState, State.ACTIVE),
      [
        cond(clockRunning(this.clock), stopClock(this.clock)),
        // Clamp prev to [TOP, 0]
        set(this.prev, this.clamp(this.next, this.contentLimit, 0)),
        set(this.prevDelta, this.delta)
      ],
      cond(neq(this.panState, -1), [
        // Start of animation, reset values
        cond(eq(this.panState, State.BEGAN), set(this.velocity, 0)), // TODO: find out why this is required
        set(this.delta, 0),
        set(this.prevDelta, 0),
        cond(
          lessOrEq(this.prev, TOP),
          [
            // Content higher than TOP: scroll
            cond(not(clockRunning(this.clock)), [
              // Start clock
              set(this.clockState.finished, 0),
              set(this.clockState.velocity, this.velocity),
              set(this.clockState.position, this.prev),
              set(this.clockState.time, 0), // Avoid jumping at start
              startClock(this.clock)
            ]),
            decay(this.clock, this.clockState, this.config2),
            // Finished
            cond(this.clockState.finished, [
              stopClock(this.clock),
              set(this.velocity, 0)
            ]),
            // Move prev, clamped to bottom of content
            set(
              this.prev,
              this.clamp(this.clockState.position, this.contentLimit, 0)
            ),
            // If prev is moved below TOP, then it has slid past TOP: clamp to TOP and end sliding
            cond(
              greaterOrEq(this.prev, TOP),
              [
                set(this.prev, TOP),
                stopClock(this.clock),
                set(this.clockState.finished, 1),
                set(this.velocity, 0)
              ],
              set(this.velocity, this.clockState.velocity)
            )
          ],
          [
            // Snap
            cond(clockRunning(this.clock), 0, [
              // Start clock
              set(this.clockState.finished, 0),
              set(this.clockState.velocity, this.newVelocity),
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
          ]
        )
      ])
    ),
    this.prev
  ]);

  // Sensor position: clamped to TOP
  fixed = cond(lessOrEq(this.pos, TOP), TOP - 1, this.pos);

  // Content position: additional delta
  diff = cond(lessOrEq(this.pos, TOP), sub(this.pos, TOP), 0);

  render() {
    return (
      <PanGestureHandler
        onGestureEvent={this.handlePan}
        onHandlerStateChange={this.handlePan}>
        <Animated.View
          style={[
            styles.sensor,
            {
              transform: [{ translateY: this.fixed }]
            }
          ]}>
          <TapGestureHandler>
            <Animated.View>
              <Animated.View
                style={styles.header}
                onLayout={this.onHeaderLayout}>
                {this.props.renderHeader()}
              </Animated.View>
              <Animated.View
                style={[
                  styles.content,
                  {
                    transform: [{ translateY: this.diff }],
                    top: this.headerHeight,
                    minHeight: sub(sub(0, TOP), this.footerHeight)
                  }
                ]}
                onLayout={this.onContentLayout}>
                {this.props.renderContent()}
              </Animated.View>
              <Animated.View
                style={[
                  styles.footer,
                  {
                    bottom: add(TOP, this.footerHeight)
                  }
                ]}
                onLayout={this.onFooterLayout}>
                {this.props.renderFooter()}
              </Animated.View>
            </Animated.View>
          </TapGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    );
  }
}

const styles = StyleSheet.create({
  sensor: {
    height: -TOP
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

export default BottomSheet;
