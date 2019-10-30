// @flow strict

import React from 'react';
import RNSlider from '@react-native-community/slider';
import { StyleSheet } from 'react-native';

import { Colors } from '../constants';

type Props = {|
  +value: number,
  +min?: number,
  +max: number,
  +onChange?: (value: number) => void
|};

const Slider = (props: Props) => {
  return (
    <RNSlider
      style={styles.slider}
      minimumValue={props.min || 0}
      maximumValue={props.max}
      step={0.01}
      value={props.value}
      onValueChange={value => props.onChange && props.onChange(value)}
      minimumTrackTintColor={Colors.accent}
      maximumTrackTintColor={Colors.border}
    />
  );
};

const styles = StyleSheet.create({
  slider: {
    height: 10
  }
});

export default Slider;
