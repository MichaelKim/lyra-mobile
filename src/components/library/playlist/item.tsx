import React from 'react';
import { StyleSheet } from 'react-native';
import { h2 } from '../../../styles';
import { Playlist } from '../../../types';
import Row from '../../row';

type Props = {
  playlist: Playlist;
  onSelect?: (playlist: Playlist) => void;
};

const PlaylistItem = ({ playlist, onSelect }: Props) => {
  const onItemPress = () => onSelect?.(playlist);

  const numSongs = playlist.songs.length;
  const subtitle = `${numSongs} ${numSongs === 1 ? 'song' : 'songs'}`;

  return (
    <Row
      title={playlist.name}
      subtitle={subtitle}
      onPress={onItemPress}
      titleStyle={styles.name}
    />
  );
};

const styles = StyleSheet.create({
  name: h2
});

export default React.memo(PlaylistItem);
