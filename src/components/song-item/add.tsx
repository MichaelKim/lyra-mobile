import React from 'react';
import { Pressable, StyleSheet, Text, View, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { Colors } from '../../constants';
import { h2, h3 } from '../../styles';
import { PlaylistID } from '../../types';
import { useSelector } from '../../hooks';
import CheckBox from '@react-native-community/checkbox';

interface Props {
  current: PlaylistID[];
  visible: boolean;
  onAdd: (playlists: PlaylistID[]) => void;
  onCancel: () => void;
}

const AddToPlaylist = ({ current, visible, onAdd, onCancel }: Props) => {
  const [selected, setSelected] = React.useState<Set<PlaylistID>>(
    new Set(current)
  );

  const playlists = useSelector(state => Object.values(state.playlists));

  const _onAdd = React.useCallback(() => onAdd([...selected]), [
    onAdd,
    selected
  ]);

  return (
    <Modal isVisible={visible} useNativeDriver>
      <View style={styles.modal}>
        <Text style={styles.header}>Add to Playlist</Text>
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.scrollViewContainer}
          data={playlists}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <CheckBox
                value={selected.has(item.id)}
                onValueChange={(value: boolean) =>
                  setSelected(s => {
                    if (value) s.add(item.id);
                    else s.delete(item.id);
                    return new Set(s);
                  })
                }
              />
              <Text style={styles.text}>{item.name}</Text>
            </View>
          )}
        />
        <View style={styles.buttons}>
          <Pressable onPress={onCancel}>
            <Text style={styles.text}>Cancel</Text>
          </Pressable>
          <Pressable onPress={_onAdd} style={styles.button}>
            <Text style={styles.text}>Add</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    marginHorizontal: 24
  },
  row: {
    flexDirection: 'row',
    flex: 1
  },
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

export default AddToPlaylist;
