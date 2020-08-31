import React from 'react';
import { Pressable, StyleSheet, Text, View, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { Colors } from '../../constants';
import { h2, h3 } from '../../styles';
import { PlaylistID, SongID } from '../../types';
import { useSelector, useDispatch } from '../../hooks';
import CheckBox from '@react-native-community/checkbox';

interface Props {
  sid: SongID;
  pids: PlaylistID[];
  visible: boolean;
  onClose: () => void;
}

const AddToPlaylist = ({ sid, pids, visible, onClose }: Props) => {
  const current = new Set(pids);
  const [added, setAdded] = React.useState<Set<PlaylistID>>(new Set());
  const [removed, setRemoved] = React.useState<Set<PlaylistID>>(new Set());

  const playlists = useSelector(state => Object.values(state.playlists));

  const onSelect = (add: boolean, pid: PlaylistID) => {
    if (add) {
      if (!current.has(pid)) {
        setAdded(s => {
          s.add(pid);
          return new Set(s);
        });
      }
      setRemoved(s => {
        s.delete(pid);
        return new Set(s);
      });
    } else {
      if (current.has(pid)) {
        setRemoved(s => {
          s.add(pid);
          return new Set(s);
        });
      }
      setAdded(s => {
        s.delete(pid);
        return new Set(s);
      });
    }
  };

  const dispatch = useDispatch();
  const onDone = () => {
    const addedArr = [...added];
    const removedArr = [...removed];

    if (addedArr.length > 0) {
      dispatch({ type: 'ADD_TO_PLAYLISTS', sid, pids: addedArr });
    }
    if (removedArr.length > 0) {
      dispatch({ type: 'REMOVE_FROM_PLAYLISTS', sid, pids: removedArr });
    }

    onClose();
  };

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
                value={current.has(item.id) || added.has(item.id)}
                onValueChange={(value: boolean) => onSelect(value, item.id)}
              />
              <Text style={styles.text}>{item.name}</Text>
            </View>
          )}
        />
        <View style={styles.buttons}>
          <Pressable onPress={onClose}>
            <Text style={styles.text}>Cancel</Text>
          </Pressable>
          <Pressable onPress={onDone} style={styles.button}>
            <Text style={styles.text}>Done</Text>
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
