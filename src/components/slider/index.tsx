import RNSlider from './slider';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Colors } from '../../constants';

interface Props {
  value: number;
  loaded?: number;
  min?: number;
  max: number;
  onChange?: (value: number) => void;
}

const Slider = (props: Props) => {
  return (
    <RNSlider
      style={styles.slider}
      minimumValue={props.min || 0}
      maximumValue={props.max}
      progress={props.value}
      seekable={props.loaded ?? props.value}
      onSlidingComplete={value => props.onChange && props.onChange(value)}
      minimumTrackTintColor={Colors.accent}
      maximumTrackTintColor={Colors.border}
      seekableTrackTintColor={Colors.lightborder}
    />
  );
};

const styles = StyleSheet.create({
  slider: {
    marginHorizontal: 16,
    flex: 1
  }
});

export default Slider;
