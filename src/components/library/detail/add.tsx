import React from 'react';
import { StyleSheet, Text, View, Switch, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import { Colors } from '../../../constants';
import { h3, h2 } from '../../../styles';
import Header from './header';
import { useSelector } from '../../../hooks';
import { getSongList, formatDuration } from '../../../util';
import { FlatList } from 'react-native-gesture-handler';
import { SongID, PlaylistID } from '../../../types';

type Props = {
  pid: PlaylistID;
  visible: boolean;
  onClose: () => void;
};

const AddModal = ({ pid, visible, onClose }: Props) => {
  const songs = useSelector(state => getSongList(state.songs));
  const current = new Set(
    songs.filter(s => s.playlists.includes(pid)).map(s => s.id)
  );
  const [selected, setSelected] = React.useState<Set<SongID>>(current);

  const onChange = (value: boolean, sid: SongID) => {
    setSelected(s => {
      if (value) s.add(sid);
      else s.delete(sid);
      return new Set(s);
    });
  };

  // Reset selected
  const onHide = () => setSelected(current);

  const onDone = () => {
    // TODO: add songs to playlist
    onClose();
  };

  return (
    <Modal
      useNativeDriver
      propagateSwipe
      isVisible={visible}
      style={styles.modal}
      onModalHide={onHide}
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
                onValueChange={(value: boolean) => onChange(value, item.id)}
                value={selected.has(item.id)}
              />
            </View>
          )}
        />
        <View style={styles.buttons}>
          <Pressable onPress={onDone} style={styles.cancelButton}>
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>
          <Pressable onPress={onDone} style={styles.doneButton}>
            <Text style={styles.buttonText}>Done</Text>
          </Pressable>
        </View>
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
  },
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

export default AddModal;
