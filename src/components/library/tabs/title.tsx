import React from 'react';
import { StyleSheet } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { h1 } from '../../../styles';

type TabTitleProps = {
  title: string;
  index: number;
  selectedIndex: Readonly<Animated.SharedValue<number>>;
  onClick: (index: number) => void;
};

export default function TabTitle({
  title,
  index,
  selectedIndex,
  onClick
}: TabTitleProps) {
  const style = useAnimatedStyle(() => ({
    color: index === selectedIndex.value ? 'white' : 'rgb(127,127,127)'
  }));

  return (
    <BorderlessButton onPress={() => onClick(index)}>
      <Animated.Text style={[styles.title, style]}>{title}</Animated.Text>
    </BorderlessButton>
  );
}

const styles = StyleSheet.create({
  title: {
    ...h1,
    paddingRight: 10
  }
});
