import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Colors } from '../constants';
import { h3 } from '../styles';

type Props = {
  text: string;
  search: string;
  onPress: (value: string) => void;
};

const Suggestion = ({ text, search, onPress }: Props) => {
  const selectItem = () => onPress(text);

  const idx = text.indexOf(search);

  const textItem =
    idx === -1 ? (
      <Text style={styles.text}>{text}</Text>
    ) : (
      <>
        <Text style={[styles.text, styles.bold]}>{text.substring(0, idx)}</Text>
        <Text style={styles.text}>{search}</Text>
        <Text style={[styles.text, styles.bold]}>
          {text.substring(idx + search.length)}
        </Text>
      </>
    );

  return (
    <RectButton style={styles.suggest} onPress={selectItem}>
      {textItem}
    </RectButton>
  );
};

const styles = StyleSheet.create({
  suggest: {
    backgroundColor: Colors.sheet
  },
  text: {
    ...h3,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  bold: {
    fontWeight: 'bold'
  }
});

export default Suggestion;
