import CheckBox from '@react-native-community/checkbox';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import { Colors } from '../../constants';
import { useDispatch, useSelect, useSelector } from '../../hooks';
import { h2 } from '../../styles';
import { PlaylistID, SongID } from '../../types';
import ActionButtons from '../action-buttons';
import Header from '../library/header';

interface Props {
  sid: SongID;
  pids: PlaylistID[];
  visible: boolean;
  onClose: () => void;
}

const AddToPlaylist = ({ sid, pids, visible, onClose }: Props) => {
  const [has, addedSet, removedSet, toggle] = useSelect(pids);

  const playlists = useSelector(state => Object.values(state.playlists));

  const dispatch = useDispatch();
  const onDone = () => {
    const added = [...addedSet];
    const removed = [...removedSet];

    if (added.length > 0 || removed.length > 0) {
      dispatch({
        type: 'UPDATE_SONG_PLAYLISTS',
        sid,
        added,
        removed
      });
    }
    onClose();
  };

  return (
    <Modal
      useNativeDriver
      isVisible={visible}
      style={styles.modal}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}>
      <View style={styles.root}>
        <Header title="Add to Playlist" onBack={onClose} />
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.scrollViewContainer}
          data={playlists}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <CheckBox
                value={has(item.id)}
                onValueChange={() => toggle(item.id)}
              />
              <Text style={styles.playlistName}>{item.name}</Text>
            </View>
          )}
        />
        <ActionButtons onDone={onDone} onCancel={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0
  },
  root: {
    flex: 1,
    backgroundColor: Colors.screen
  },
  scrollViewContainer: {
    marginHorizontal: 24
  },
  row: {
    flexDirection: 'row',
    height: 60
  },
  playlistName: h2
});

export default AddToPlaylist;
