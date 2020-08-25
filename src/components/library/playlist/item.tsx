import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Colors } from '../../../constants';
import { h2 } from '../../../styles';
import { Playlist } from '../../../types';
import { useSelector } from '../../../hooks';

interface Props {
  playlist: Playlist;
  onSelect?: (playlist: Playlist) => void;
}

const PlaylistItem = ({ playlist, onSelect }: Props) => {
  const onItemPress = React.useCallback(() => onSelect && onSelect(playlist), [
    onSelect,
    playlist
  ]);

  // TODO: fix playlist.songs
  const numSongs = useSelector(state =>
    Object.values(state.songs).reduce(
      (acc, song) => (song.playlists.includes(playlist.id) ? acc + 1 : acc),
      0
    )
  );

  return (
    <View style={styles.root}>
      <RectButton rippleColor="#111" onPress={onItemPress} style={styles.rect}>
        <Text style={styles.name}>{playlist.name}</Text>
        <Text style={styles.numSongs}>
          {numSongs} {numSongs === 1 ? 'song' : 'songs'}
        </Text>
      </RectButton>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rect: {
    flexDirection: 'column',
    alignSelf: 'stretch',
    justifyContent: 'center',
    paddingVertical: 10,
    flex: 1
  },
  name: h2,
  numSongs: {
    fontSize: 12,
    color: Colors.subtext
  }
});

export default React.memo(PlaylistItem);