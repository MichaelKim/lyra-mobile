import React from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import { useSelector } from '../../../hooks';
import { h1, h2 } from '../../../styles';
import { Playlist } from '../../../types';
import { getSongList } from '../../../util';
import SongItem from '../../song-item';
import { Colors } from '../../../constants';
import { Back } from '../../../icons';

interface Props {
  playlist?: Playlist;
  onClose: () => void;
}

const PlaylistScreen = ({ playlist, onClose }: Props) => {
  const songs = useSelector(state =>
    playlist != null ? getSongList(state.songs, playlist.id) : []
  );

  return (
    <Modal
      isVisible={playlist != null}
      useNativeDriver
      backdropOpacity={1}
      backdropColor={Colors.screen}>
      <Pressable onPress={onClose}>
        <Back width={25} height={25} />
      </Pressable>
      {playlist != null && (
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.scrollViewContainer}>
          <Text style={styles.title}>{playlist.name}</Text>
          <View>
            {songs.map(song => (
              <SongItem key={song.id} song={song} />
            ))}
          </View>
        </ScrollView>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    marginHorizontal: 24,
    flex: 1
  },
  title: h1,
  text: h2
});

export default PlaylistScreen;
