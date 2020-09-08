import React from 'react';
import { StyleSheet, Text, View, TextStyle } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Colors } from '../constants';
import { Options } from '../icons';
import { h3 } from '../styles';
import ContextMenu from './context';

type Props = {
  title: string;
  subtitle: string;
  options?: Array<{ label: string; onPress: () => void }>;
  thumbnail?: React.ReactNode;
  onPress?: () => void;
  titleStyle?: TextStyle;
};

const Row = ({
  title,
  subtitle,
  options,
  thumbnail,
  onPress,
  titleStyle
}: Props) => {
  return (
    <View style={styles.root}>
      <RectButton
        rippleColor={Colors.ripple}
        onPress={onPress}
        style={styles.rect}>
        {thumbnail}
        <View style={styles.text}>
          <Text style={[styles.title, titleStyle]}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </RectButton>
      {options && (
        <ContextMenu items={options} style={styles.options}>
          <Options width={25} height={25} />
        </ContextMenu>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rect: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    flex: 1
  },
  text: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1
  },
  title: h3,
  subtitle: {
    fontSize: 12,
    color: Colors.subtext
  },
  options: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40
  }
});

export default Row;
