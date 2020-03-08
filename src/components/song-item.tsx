import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  RectButton,
  TouchableWithoutFeedback
} from 'react-native-gesture-handler';
import { Colors } from '../constants';
import { useCurrSong, useDispatch } from '../hooks';
import { Options } from '../icons';
import { Song } from '../types';
import { formatDuration } from '../util';
import ContextMenu from './context';

interface Props {
  song: Song;
  onSelect?: (song: Song) => void;
}

const SongItem = ({ song, onSelect }: Props) => {
  const currSong = useCurrSong();
  const ref = React.useRef<View>(null);
  const [showMenu, setMenu] = React.useState(false);
  const isPlaying = currSong?.id === song.id;

  const dispatch = useDispatch();
  const queueSong = (song: Song) => dispatch({ type: 'QUEUE_SONG', song });

  const onOptions = () => {
    setMenu(true);
  };

  const onClose = () => {
    console.log('close');
    setMenu(false);
  };

  const items = [
    {
      label: 'Add to Playlist',
      onPress: () => {
        onClose();
      }
    },
    {
      label: 'Add to Queue',
      onPress: () => {
        queueSong(song);
        onClose();
      }
    }
  ];

  const onItemPress = React.useCallback(() => onSelect && onSelect(song), [
    onSelect,
    song
  ]);

  console.log('render item');

  return (
    <>
      <ContextMenu
        target={ref}
        showMenu={showMenu}
        items={items}
        onCloseMenu={onClose}
      />
      <RectButton rippleColor="#111" onPress={onItemPress} style={styles.root}>
        <View ref={ref} collapsable={false} style={styles.left}>
          <Text style={styles.songTitle}>{song.title}</Text>
          <Text style={styles.songArtist}>
            {song.artist || 'Unknown Artist'} • {formatDuration(song.duration)}
          </Text>
          {/* {isPlaying && <Text style={styles.songArtist}>Playing</Text>} */}
        </View>
        <TouchableWithoutFeedback
          onPress={onOptions}
          // @ts-ignore
          rippleColor="#000"
          borderless
          style={styles.button}>
          <Options width={25} height={25} />
        </TouchableWithoutFeedback>
      </RectButton>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10
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

export default React.memo(SongItem);
