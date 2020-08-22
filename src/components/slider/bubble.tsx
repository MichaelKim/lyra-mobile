import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { Colors } from '../../constants';
import { h4 } from '../../styles';

export const BUBBLE_WIDTH = 100;

interface Props {
  text: string;
}

const Bubble = ({ text }: Props) => {
  return (
    <Animated.View style={styles.container}>
      <Animated.View style={styles.textContainer}>
        <Text style={styles.text}>{text}</Text>
      </Animated.View>
      <View style={styles.arrow} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  textContainer: {
    padding: 4,
    borderRadius: 5,
    maxWidth: BUBBLE_WIDTH,
    backgroundColor: Colors.accent
  },
  text: h4,
  arrow: {
    width: 10,
    height: 10,
    borderWidth: 5,
    flexDirection: 'row',
    borderColor: 'transparent',
    borderTopColor: Colors.accent
  }
});

export default Bubble;
