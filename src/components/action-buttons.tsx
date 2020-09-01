import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants';
import { h2 } from '../styles';

type Props = {
  onDone: () => void;
  onCancel: () => void;
};

const ActionButtons = ({ onDone, onCancel }: Props) => {
  return (
    <View style={styles.buttons}>
      <Pressable onPress={onCancel} style={styles.cancelButton}>
        <Text style={styles.buttonText}>Cancel</Text>
      </Pressable>
      <Pressable onPress={onDone} style={styles.doneButton}>
        <Text style={styles.buttonText}>Done</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: Colors.playback,
    paddingVertical: 8
  },
  doneButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 4,
    paddingHorizontal: 20,
    borderRadius: 4
  },
  cancelButton: {
    paddingVertical: 4,
    paddingHorizontal: 20
  },
  buttonText: h2
});

export default ActionButtons;
