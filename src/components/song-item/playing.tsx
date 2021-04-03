import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  block,
  Clock,
  cond,
  EasingNode,
  interpolateNode,
  set,
  startClock,
  stopClock,
  timing,
  Value
} from 'react-native-reanimated';
import { VolumeHigh, VolumeLow, VolumeMute } from '../../icons';

// Change animation to static members?
class Playing extends React.Component<{}> {
  clock = new Clock();
  clockState = {
    finished: new Value(1),
    position: new Value(0),
    frameTime: new Value(0),
    time: new Value(0)
  };
  config = {
    toValue: 1,
    duration: 2000,
    easing: EasingNode.linear
  };

  position = block([
    cond(
      this.clockState.finished,
      [
        stopClock(this.clock),
        set(this.clockState.finished, 0),
        set(this.clockState.position, 0),
        set(this.clockState.frameTime, 0),
        set(this.clockState.time, 0),
        startClock(this.clock)
      ],
      timing(this.clock, this.clockState, this.config)
    ),
    this.clockState.position
  ]);

  lowOpacity = interpolateNode(this.position, {
    inputRange: [0, 0.3, 0.7, 1],
    outputRange: [0, 1, 1, 0]
  });

  highOpacity = interpolateNode(this.position, {
    inputRange: [0, 0.3, 0.6, 0.7, 1],
    outputRange: [0, 0, 1, 1, 0]
  });

  render() {
    return (
      <View style={[styles.root, styles.square]}>
        <VolumeMute width={25} height={25} style={styles.mute} />
        <Animated.View
          style={[
            styles.icon,
            styles.square,
            styles.low,
            { opacity: this.lowOpacity }
          ]}>
          <VolumeLow width={25} height={25} />
        </Animated.View>
        <Animated.View
          style={[styles.icon, styles.square, { opacity: this.highOpacity }]}>
          <VolumeHigh width={25} height={25} />
        </Animated.View>
      </View>
    );
  }
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
