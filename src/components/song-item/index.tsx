import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Colors } from '../../constants';
import { useCurrSong, useDispatch } from '../../hooks';
import { Options } from '../../icons';
import { h3 } from '../../styles';
import { Song } from '../../types';
import { formatDuration } from '../../util';
import ContextMenu from '../context';
import Thumbnail from '../thumbnail';
import AddToPlaylist from './add';
import Playing from './playing';

type Props = {
  song: Song;
  onSelect?: (song: Song) => void;
};

const SongItem = ({ song, onSelect }: Props) => {
  const currSong = useCurrSong();
  const isPlaying = currSong?.id === song.id;

  const [showModal, setModal] = React.useState<boolean>(false);

  const dispatch = useDispatch();

  const items = [
    {
      label: 'Add to Playlist',
      onPress: () => setModal(true)
    },
    {
      label: 'Add to Queue',
      onPress: () => dispatch({ type: 'QUEUE_SONG', song })
    },
    {
      label: 'Remove Song',
      onPress: () => dispatch({ type: 'REMOVE_SONG', id: song.id })
    }
  ];

  const onItemPress = () => onSelect && onSelect(song);

  const onClose = () => setModal(false);

  return (
    <View style={styles.root}>
      <AddToPlaylist
        sid={song.id}
        pids={song.playlists}
        visible={showModal}
        onClose={onClose}
      />
      <RectButton
        rippleColor={Colors.ripple}
        onPress={onItemPress}
        style={styles.rect}>
        {isPlaying ? (
          <Playing />
        ) : (
          <Thumbnail src={song.thumbnail} style={styles.thumbnail} />
        )}
        <View style={styles.text}>
          <Text style={styles.songTitle}>{song.title}</Text>
          <Text style={styles.songArtist}>
            {song.artist || 'Unknown Artist'} • {formatDuration(song.duration)}
          </Text>
        </View>
      </RectButton>
      <ContextMenu items={items} style={styles.options}>
        <Options width={25} height={25} />
      </ContextMenu>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rect: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    flex: 1
  },
  thumbnail: {
    width: 45,
    marginRight: 8
  },
  text: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1
  },
  songTitle: h3,
  songArtist: {
    fontSize: 12,
    color: Colors.subtext
  },
  options: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40
  }
});

export default React.memo(SongItem);
