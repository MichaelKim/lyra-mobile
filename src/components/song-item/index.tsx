import React from 'react';
import { StyleSheet } from 'react-native';
import { useCurrSong, useDispatch } from '../../hooks';
import { Song } from '../../types';
import { formatDuration } from '../../util';
import Row from '../row';
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

  const artist = song.artist || 'Unknown Artist';
  const duration = formatDuration(song.duration);
  const thumbnail = isPlaying ? (
    <Playing />
  ) : (
    <Thumbnail src={song.thumbnail} style={styles.thumbnail} />
  );

  return (
    <>
      <Row
        title={song.title}
        subtitle={`${artist} • ${duration}`}
        options={items}
        thumbnail={thumbnail}
        onPress={onItemPress}
      />
      <AddToPlaylist
        sid={song.id}
        pids={song.playlists}
        visible={showModal}
        onClose={onClose}
      />
    </>
  );
};

const styles = StyleSheet.create({
  thumbnail: {
    width: 45,
    marginRight: 8
  }
});

export default SongItem;
