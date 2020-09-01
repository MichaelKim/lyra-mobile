import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Back } from '../../icons';
import { h1 } from '../../styles';

type Props = {
  title: string;
  onBack: () => void;
};

const Header = ({ title, onBack }: Props) => {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBack}>
        <Back width={35} height={35} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    marginTop: 8,
    marginLeft: 16,
    alignItems: 'center'
  },
  title: {
    ...h1,
    paddingTop: 6,
    paddingLeft: 16
  }
});

export default Header;
