import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Colors } from '../../../constants';
import { h2 } from '../../../styles';
import { Playlist } from '../../../types';

type Props = {
  playlist: Playlist;
  onSelect?: (playlist: Playlist) => void;
};

const PlaylistItem = ({ playlist, onSelect }: Props) => {
  const onItemPress = () => onSelect?.(playlist);

  const numSongs = playlist.songs.length;

  return (
    <View style={styles.root}>
      <RectButton
        rippleColor={Colors.ripple}
        onPress={onItemPress}
        style={styles.rect}>
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
