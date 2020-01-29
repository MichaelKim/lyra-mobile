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
  contentHeight = new Value(646);

  clock = new Clock(); // Clock for spring
  clock2 = new Clock(); // Clock for spring

  // Clock state
  clockState = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0)
  };

  // Clock config
  config = {
    damping: 50,
    mass: 0.3,
    stiffness: 121.6,
    overshootClamping: true,
    restSpeedThreshold: 0.3,
    restDisplacementThreshold: 0.3,
    toValue: new Value(0)
  };

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

  pos = block([
    cond(
      eq(this.panState, State.ACTIVE),
      [
        cond(clockRunning(this.clock), stopClock(this.clock)),
        cond(clockRunning(this.clock2), stopClock(this.clock2)),
        // Clamp prev to [TOP, 0]
        set(
          this.prev,
          cond(
            lessOrEq(this.next, sub(sub(0, this.contentHeight, 70))),
            sub(sub(0, this.contentHeight, 70)),
            cond(greaterOrEq(this.next, 0), 0, this.next)
          )
        ),
        set(this.prevDelta, this.delta)
      ],
      cond(neq(this.panState, -1), [
        // Start of spring
        cond(eq(this.panState, State.BEGAN), set(this.velocity, 0)), // TODO: find out why this is required
        set(this.delta, 0),
        set(this.prevDelta, 0),
        cond(
          lessOrEq(this.prev, TOP),
          [
            // Scroll
            cond(clockRunning(this.clock), 0, [
              // Start clock
              set(this.clockState.finished, 0),
              set(this.clockState.velocity, this.newVelocity),
              set(this.clockState.position, this.prev),
              startClock(this.clock)
            ]),
            decay(this.clock, this.clockState, this.config2),
            // Animated.call([this.prev], ([p]) => console.log('decay', p)),
            cond(this.clockState.finished, [
              stopClock(this.clock),
              set(this.velocity, 0)
            ]),
            set(
              this.prev,
              cond(
                lessOrEq(
                  this.clockState.position,
                  sub(sub(0, this.contentHeight, 70))
                ),
                sub(sub(0, this.contentHeight, 70)),
                cond(
                  greaterOrEq(this.clockState.position, 0),
                  0,
                  this.clockState.position
                )
              )
            ),
            set(this.velocity, this.clockState.velocity)
          ],
          [
            // Snap
            cond(
              clockRunning(this.clock),
              [
                // TODO: Bounce
                stopClock(this.clock),
                set(this.prev, TOP),
                set(this.velocity, 0)
              ],
              [
                cond(clockRunning(this.clock2), 0, [
                  // Start clock
                  set(this.clockState.finished, 0),
                  set(this.clockState.velocity, this.newVelocity),
                  set(this.clockState.position, this.prev),
                  set(this.config.toValue, this.snap),
                  startClock(this.clock2)
                ]),
                spring(this.clock2, this.clockState, this.config),
                // Animated.call([this.prev], ([p]) => console.log('spring', p)),
                cond(this.clockState.finished, [
                  stopClock(this.clock2),
                  set(this.velocity, 0)
                ]),
                set(this.prev, this.clockState.position),
                set(this.velocity, this.clockState.velocity)
              ]
            )
          ]
        )
      ])
    ),
    this.prev
  ]);

  // fixed = cond(lessOrEq(this.prev, TOP), sub(TOP, this.prev), 0);

  fixed = cond(lessOrEq(this.pos, TOP), TOP, this.pos);
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
          {/* <Animated.Code>
            {() => Animated.call([this.next, this.pos], console.log)}
          </Animated.Code> */}
          <TapGestureHandler>
            <Animated.View>
              <Animated.View
                style={[
                  styles.header,
                  {
                    // transform: [{ translateY: this.fixed }]
                  }
                ]}>
                {this.props.renderHeader()}
              </Animated.View>
              <Animated.View
                style={[
                  styles.content,
                  {
                    transform: [{ translateY: this.diff }]
                  }
                ]}
                onLayout={event([
                  {
                    nativeEvent: {
                      layout: {
                        height: this.contentHeight
                      }
                    }
                  }
                ])}>
                {this.props.renderContent()}
                {/* {Array.from(Array(100).keys()).map(i => (
                  <Text key={i}>{i}</Text>
                ))} */}
              </Animated.View>
              <Animated.View
                style={[
                  styles.footer,
                  {
                    // transform: [{ translateY: this.fixed }]
                  }
                ]}>
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
    height: -TOP,
    backgroundColor: 'black'
  },
  header: {
    height: BAR_HEIGHT,
    backgroundColor: 'lightgoldenrodyellow',
    zIndex: 1
  },
  content: {
    position: 'absolute',
    top: BAR_HEIGHT,
    left: 0,
    right: 0,
    backgroundColor: 'lightblue',
    flex: 1,
    minHeight: -TOP - 70
  },
  footer: {
    position: 'relative',
    zIndex: 1,
    bottom: TOP + 70
  }
});

export default BottomSheet;
