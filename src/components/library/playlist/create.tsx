import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Modal from 'react-native-modal';
import { Colors } from '../../../constants';
import { h2, h3 } from '../../../styles';

interface Props {
  visible: boolean;
  onEnter: (name: string) => void;
  onCancel: () => void;
}

const Playlists = ({ visible, onEnter, onCancel }: Props) => {
  const [newName, setName] = React.useState<string>('');

  const onChange = React.useCallback((text: string) => setName(text), [
    setName
  ]);

  const _onEnter = React.useCallback(() => onEnter(newName), [
    onEnter,
    newName
  ]);

  const _onCancel = React.useCallback(() => onCancel(), [onCancel]);

  return (
    <Modal isVisible={visible} useNativeDriver>
      <View style={styles.modal}>
        <Text style={styles.header}>New Playlist</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Playlist Name"
          placeholderTextColor={Colors.placeholder}
          value={newName}
          onChangeText={onChange}
        />
        <View style={styles.buttons}>
          <Pressable onPress={_onCancel}>
            <Text style={styles.text}>Cancel</Text>
          </Pressable>
          <Pressable onPress={_onEnter} style={styles.button}>
            <Text style={styles.text}>Create</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  text: h2,
  button: {
    backgroundColor: Colors.accent,
    padding: 4,
    borderRadius: 4
  },
  header: {
    ...h2,
    marginBottom: 8
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textInput: {
    ...h3,
    padding: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    height: 40,
    paddingLeft: 4
  },
  buttons: {
    flexDirection: 'row'
  }
});

export default Playlists;
