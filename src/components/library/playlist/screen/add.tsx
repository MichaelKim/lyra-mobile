import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import { Colors } from '../../../../constants';
import { useDispatch, useSelect, useSelector } from '../../../../hooks';
import { h3 } from '../../../../styles';
import { PlaylistID } from '../../../../types';
import { formatDuration, getSongList } from '../../../../util';
import ActionButtons from '../../../action-buttons';
import Header from '../../header';

type Props = {
  pid: PlaylistID;
  visible: boolean;
  onClose: () => void;
};

const AddModal = ({ pid, visible, onClose }: Props) => {
  const songs = useSelector(state => getSongList(state.songs));
  const sids = songs.filter(s => s.playlists.includes(pid)).map(s => s.id);
  const [has, addedSet, removedSet, toggle] = useSelect(sids);

  const dispatch = useDispatch();
  const onDone = () => {
    const added = [...addedSet];
    const removed = [...removedSet];

    if (added.length > 0 || removed.length > 0) {
      console.log(added, removed);
      dispatch({
        type: 'UPDATE_PLAYLIST',
        pid,
        added,
        removed
      });
    }
    onClose();
  };

  return (
    <Modal
      useNativeDriver
      propagateSwipe
      isVisible={visible}
      style={styles.modal}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}>
      <View style={styles.root}>
        <Header title="Select Songs" onBack={onClose} />
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.scrollViewContainer}
          data={songs}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.song}>
                <Text style={styles.songTitle}>{item.title}</Text>
                <Text style={styles.songArtist}>
                  {item.artist || 'Unknown Artist'} •{' '}
                  {formatDuration(item.duration)}
                </Text>
              </View>
              <Switch
                onValueChange={() => toggle(item.id)}
                value={has(item.id)}
              />
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
  song: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1
  },
  songTitle: h3,
  songArtist: {
    fontSize: 12,
    color: Colors.subtext
  }
});

export default AddModal;
