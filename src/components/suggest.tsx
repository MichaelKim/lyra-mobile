import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

interface Props {
  text: string;
  search: string;
  onPress: (value: string) => void;
}

const Suggestion = ({ text, search, onPress }: Props) => {
  const selectItem = () => {
    onPress(text);
  };

  const idx = text.indexOf(search);

  const textItem =
    idx === -1 ? (
      text
    ) : (
      <>
        <Text style={styles.bold}>{text.substring(0, idx)}</Text>
        <Text>{search}</Text>
        <Text style={styles.bold}>{text.substring(idx + search.length)}</Text>
      </>
    );

  return (
    <RectButton style={styles.suggest} onPress={selectItem}>
      {textItem}
    </RectButton>
  );
};

const styles = StyleSheet.create({
  suggest: {},
  bold: {
    fontWeight: 'bold'
  }
});

export default Suggestion;
