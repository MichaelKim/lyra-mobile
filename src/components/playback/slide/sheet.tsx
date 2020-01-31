import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import {
  PanGestureHandler,
  State,
  TapGestureHandler
} from 'react-native-gesture-handler';

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
  headerHeight: number;
  containerHeight: number;
  renderHeader: () => React.ReactNode;
  renderContent: () => React.ReactNode;
  renderFooter: () => React.ReactNode;
}

export default class BottomSheet extends React.Component<Props> {
  rootHeight = new Value(this.props.containerHeight + this.props.headerHeight);
  headerHeight = new Value(this.props.headerHeight);
  contentBoxHeight = new Value(646);
  contentHeight = new Value(646);
  // footerHeight = new Value(70);

  onRootLayout = event([
    {
      nativeEvent: {
        layout: {
          height: this.rootHeight
        }
      }
    }
  ]);

  onHeaderLayout = event([
    {
      nativeEvent: {
        layout: {
          height: this.headerHeight
        }
      }
    }
  ]);

  onContentBoxLayout = event([
    {
      nativeEvent: {
        layout: {
          height: this.contentBoxHeight
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

  // onFooterLayout = event([
  //   {
  //     nativeEvent: {
  //       layout: {
  //         height: this.footerHeight
  //       }
  //     }
  //   }
  // ]);

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
  velocity = new Value<number>(0); // Velocity of pan (negative)
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

  // Next position (negative)
  next = add(this.prev, sub(this.prevDelta, this.delta));

  // Expected position, if let go
  slide = add(this.next, multiply(-0.5, this.velocity));

  // Snapping point, if let go
  snap = cond(
    lessOrEq(this.slide, multiply(0.5, this.rootHeight)),
    0,
    sub(this.rootHeight, this.headerHeight)
  );

  // Velocity, clamped for downwards
  newVelocity = cond(lessOrEq(this.next, 0), 0, sub(0, this.velocity));

  // Content height + footer height: the highest the content can go
  contentLimit = add(
    this.contentHeight,
    sub(this.rootHeight, this.contentBoxHeight)
  );

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
        set(this.prev, this.clamp(this.next, 0, this.contentLimit)),
        set(this.prevDelta, this.delta)
      ],
      cond(neq(this.panState, -1), [
        // Start of animation, reset values
        cond(eq(this.panState, State.BEGAN), set(this.velocity, 0)), // TODO: find out why this is required
        set(this.delta, 0),
        set(this.prevDelta, 0),
        cond(
          greaterOrEq(this.prev, this.rootHeight),
          [
            // Content higher than TOP: scroll
            cond(not(clockRunning(this.clock)), [
              // Start clock
              set(this.clockState.finished, 0),
              set(this.clockState.velocity, this.newVelocity),
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
              this.clamp(
                this.clockState.position,
                0,
                this.clamp(this.clockState.position, 0, this.contentLimit)
              )
            ),
            // If prev is moved below TOP, then it has slid past TOP: clamp to TOP and end sliding
            cond(
              lessOrEq(this.prev, this.rootHeight),
              [
                set(this.prev, this.rootHeight),
                stopClock(this.clock),
                set(this.clockState.finished, 1),
                set(this.velocity, 0)
              ]
              // set(this.velocity, this.clockState.velocity)
            )
          ],
          [
            // Snap
            cond(not(clockRunning(this.clock)), [
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
            set(this.prev, this.clockState.position)
            // set(this.velocity, this.clockState.velocity)
          ]
        )
      ])
    ),
    this.prev
  ]);

  // Sensor position: clamped
  fixed = cond(
    greaterOrEq(add(this.pos, this.headerHeight), this.rootHeight),
    this.rootHeight,
    add(this.pos, this.headerHeight)
  );

  // Content position: additional delta (negative)
  diff = cond(
    greaterOrEq(this.pos, this.rootHeight),
    sub(this.rootHeight, this.pos),
    0
  );

  render() {
    return (
      <Animated.View style={styles.root} onLayout={this.onRootLayout}>
        {/* <Animated.Code>{Animated.call([this.pos], console.log)}</Animated.Code> */}
        <Animated.View
          style={[
            styles.sensor,
            {
              height: this.fixed
            }
          ]}>
          <PanGestureHandler
            onGestureEvent={this.handlePan}
            onHandlerStateChange={this.handlePan}>
            <Animated.View style={styles.flex}>
              {/* Stop touches from going through bottom sheet */}
              <TapGestureHandler>
                {/* <RectButton style={styles.flex}> */}
                <Animated.View style={styles.flex}>
                  <Animated.View
                    style={styles.header}
                    onLayout={this.onHeaderLayout}>
                    {this.props.renderHeader()}
                  </Animated.View>
                  <Animated.View
                    style={styles.flex}
                    onLayout={this.onContentBoxLayout}>
                    <Animated.View
                      style={[
                        styles.content,
                        {
                          transform: [{ translateY: this.diff }],
                          // Can't use contentBoxHeight due to delay in updating
                          minHeight: this.contentBoxHeight
                        }
                      ]}
                      onLayout={this.onContentLayout}>
                      {this.props.renderContent()}
                      {/* {Array.from(Array(100).keys()).map(i => (
                        <Animated.View
                          key={i}
                          style={{
                            backgroundColor: 'rgba(128, 128, 128, 0.5)'
                          }}>
                          <Text>{i}</Text>
                        </Animated.View>
                      ))} */}
                    </Animated.View>
                  </Animated.View>
                  <Animated.View
                    style={styles.footer}
                    // onLayout={this.onFooterLayout}
                  >
                    {this.props.renderFooter()}
                  </Animated.View>
                </Animated.View>
                {/* </RectButton> */}
              </TapGestureHandler>
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1
    // backgroundColor: 'rgba(0, 0, 255, 0.5)'
  },
  sensor: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 0, 0, 0.5)'
  },
  header: {
    zIndex: 1
  },
  flex: {
    flex: 1
  },
  content: {
    position: 'absolute',
    left: 0,
    right: 0,
    flex: 1
  },
  footer: {}
});
