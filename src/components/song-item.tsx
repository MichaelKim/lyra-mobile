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

interface Props {
  song: Song;
  onPress?: () => void;
}

const SongItem = ({ song, onPress }: Props) => {
  const currSong = useCurrSong();
  const ref = React.useRef<View>(null);
  const [showMenu, setMenu] = React.useState(false);
  const [menuPosition, setMenuPosition] = React.useState(0);
  const isPlaying = currSong?.id === song.id;

  const dispatch = useDispatch();
  const queueSong = (song: Song) => dispatch({ type: 'QUEUE_SONG', song });

  const onOptions = () => {
    setMenu(true);
  };

  React.useEffect(() => {
    if (ref.current) {
      ref.current.measure(
        (
          x: number,
          y: number,
          width: number,
          height: number,
          pageX: number,
          pageY: number
        ) => {
          // TODO: check for unmount
          setMenuPosition(pageY);
        }
      );
    }
  }, []);

  const items = [
    {
      label: 'Add to Playlist',
      onPress: () => {
        setMenu(false);
      }
    },
    {
      label: 'Add to Queue',
      onPress: () => {
        queueSong(song);
        setMenu(false);
      }
    }
  ];

  return (
    <>
      {showMenu && (
        <>
          <RectButton style={styles.menuCover} onPress={() => setMenu(false)} />
          <View
            style={[
              styles.menu,
              {
                top: menuPosition
              }
            ]}>
            {items.map(item => (
              <RectButton key={item.label} onPress={item.onPress}>
                <Text style={styles.menuItem}>{item.label}</Text>
              </RectButton>
            ))}
          </View>
        </>
      )}
      <RectButton
        rippleColor="#111"
        onPress={() => onPress && onPress()}
        style={styles.root}>
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
  },
  menu: {
    position: 'absolute',
    backgroundColor: 'white',
    right: 0,
    zIndex: 2
  },
  menuCover: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // backgroundColor: 'rgba(1, 1, 1, 0.5)',
    zIndex: 1
  },
  menuItem: {
    padding: 10
  }
});

export default SongItem;
