import React from 'react';
import { StyleSheet } from 'react-native';
import { useDispatch } from '../../../hooks';
import { h2 } from '../../../styles';
import { Playlist } from '../../../types';
import Row from '../../row';
import AddModal from './screen/add';

type Props = {
  playlist: Playlist;
  onSelect?: (playlist: Playlist) => void;
};

const PlaylistItem = ({ playlist, onSelect }: Props) => {
  const [showModal, setModal] = React.useState<boolean>(false);

  const onItemPress = () => onSelect?.(playlist);

  const numSongs = playlist.songs.length;
  const subtitle = `${numSongs} ${numSongs === 1 ? 'song' : 'songs'}`;

  const dispatch = useDispatch();
  const items = [
    {
      label: 'Delete Playlist',
      onPress: () => dispatch({ type: 'DELETE_PLAYLIST', id: playlist.id })
    },
    {
      label: 'Add Songs',
      onPress: () => {
        onItemPress();
        setModal(true);
      }
    }
  ];

  return (
    <>
      <Row
        title={playlist.name}
        subtitle={subtitle}
        options={items}
        onPress={onItemPress}
        titleStyle={styles.name}
      />
      <AddModal
        pid={playlist.id}
        visible={showModal}
        onClose={() => setModal(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  name: h2
});

export default React.memo(PlaylistItem);
