import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';

import { Colors } from '../constants';
import { useCurrSong } from '../hooks';
import { Options } from '../icons';

import { Song } from '../types';
import { formatDuration } from '../util';

interface Props {
  song: Song;
  onPress: () => void;
}

const SongItem = ({ song, onPress }: Props) => {
  const currSong = useCurrSong();
  const [showMenu, setMenu] = React.useState(false);
  const isPlaying = currSong?.id === song.id;

  const onOptions = () => {
    setMenu(true);
  };

  return (
    <RectButton rippleColor="#111" onPress={onPress} style={styles.root}>
      <View style={styles.left}>
        <Text style={styles.songTitle}>{song.title}</Text>
        <Text style={styles.songArtist}>
          {song.artist || 'Unknown Artist'} • {formatDuration(song.duration)}
        </Text>
        {/* {isPlaying && <Text style={styles.songArtist}>Playing</Text>} */}
      </View>
      <BorderlessButton
        onPress={onOptions}
        rippleColor="#000"
        borderless
        style={styles.button}>
        <Options width={25} height={25} />
      </BorderlessButton>
    </RectButton>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60
  },
  left: {
    flexDirection: 'column',
    alignSelf: 'stretch',
    justifyContent: 'center',
    flex: 1
  },
  songTitle: {
    fontSize: 16,
    color: Colors.text
  },
  songArtist: {
    fontSize: 12,
    color: Colors.subtext
  },
  button: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40
  }
});

export default SongItem;
