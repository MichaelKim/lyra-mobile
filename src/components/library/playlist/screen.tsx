import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import { Colors } from '../../../constants';
import { useDispatch, useSelector } from '../../../hooks';
import { Back } from '../../../icons';
import { h1, h2 } from '../../../styles';
import { Playlist, Song } from '../../../types';
import { getSongList } from '../../../util';
import SongItem from '../../song-item';

interface Props {
  playlist?: Playlist;
  onClose: () => void;
}

const PlaylistScreen = ({ playlist, onClose }: Props) => {
  const songs = useSelector(state =>
    playlist != null ? getSongList(state.songs, playlist.id) : []
  );

  const dispatch = useDispatch();

  const onSelect = (song: Song) => {
    dispatch({ type: 'SELECT_SONG', song });
  };

  return (
    <Modal
      useNativeDriver
      isVisible={playlist != null}
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
              <SongItem
                key={song.id}
                song={song}
                onSelect={() => onSelect(song)}
              />
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
