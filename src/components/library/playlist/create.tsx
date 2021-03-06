import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Modal from 'react-native-modal';
import { Colors } from '../../../constants';
import { h1, h2, h3 } from '../../../styles';

interface Props {
  visible: boolean;
  onEnter: (name: string) => void;
  onCancel: () => void;
}

const CreatePlaylist = ({ visible, onEnter, onCancel }: Props) => {
  const [newName, setName] = React.useState<string>('');

  const _onEnter = () => onEnter(newName || 'My Playlist');

  return (
    <Modal
      useNativeDriver
      isVisible={visible}
      onBackdropPress={onCancel}
      onBackButtonPress={onCancel}>
      <View style={styles.modal}>
        <Text style={styles.header}>Enter Playlist Name</Text>
        <TextInput
          style={styles.textInput}
          placeholder="My Playlist"
          placeholderTextColor={Colors.placeholder}
          value={newName}
          onChangeText={setName}
        />
        <View style={styles.buttons}>
          <Pressable onPress={onCancel}>
            <Text style={styles.text}>Cancel</Text>
          </Pressable>
          <Pressable onPress={_onEnter} style={styles.create}>
            <Text style={styles.text}>Create</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  text: h3,
  create: {
    backgroundColor: Colors.accent,
    padding: 4,
    borderRadius: 4,
    marginLeft: 40
  },
  header: {
    ...h2,
    marginBottom: 8
  },
  modal: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.screen,
    borderRadius: 10,
    paddingVertical: 20
  },
  textInput: {
    ...h1,
    padding: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    height: 40,
    marginVertical: 12,
    width: '75%',
    textAlign: 'center'
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});

export default CreatePlaylist;
