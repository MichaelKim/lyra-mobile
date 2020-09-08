import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { FlatList, RectButton } from 'react-native-gesture-handler';
import { Colors } from '../../../../constants';
import { useDispatch, useSelector } from '../../../../hooks';
import { h2 } from '../../../../styles';
import { Song, StackProps } from '../../../../types';
import { getSongList } from '../../../../util';
import SongItem from '../../../song-item';
import { LibraryStackParamList } from '../../index';
import AddModal from './add';
import Header from '../../../full-modal/header';
import { Add } from '../../../../icons';

type Props = StackProps<LibraryStackParamList, 'Playlist'>;

const PlaylistDetail = ({ route, navigation }: Props) => {
  const [showModal, setModal] = React.useState<boolean>(false);
  const playlist = useSelector(state => state.playlists[route.params.pid]);
  const songs = useSelector(state => getSongList(state.songs, playlist.id));

  const dispatch = useDispatch();
  const onSelect = (song: Song) => {
    dispatch({ type: 'SELECT_SONG', song });
  };

  const onClose = () => {
    navigation.goBack();
  };

  const onAdd = () => setModal(true);
  const onCancel = () => setModal(false);

  return (
    <SafeAreaView style={styles.root}>
      <Header title={playlist.name} onBack={onClose} />
      <AddModal pid={playlist.id} visible={showModal} onClose={onCancel} />
      {songs.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.text}>No songs!</Text>
          <RectButton onPress={onAdd} style={styles.button}>
            <Text style={styles.text}>Add Songs</Text>
          </RectButton>
        </View>
      ) : (
        <>
          <RectButton onPress={onAdd} style={styles.rect}>
            <View style={styles.add}>
              <Add width={25} height={25} />
            </View>
            <Text style={h2}>Add Songs</Text>
          </RectButton>
          <FlatList
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={styles.scrollViewContainer}
            data={songs}
            renderItem={({ item }) => (
              <SongItem song={item} onSelect={onSelect} />
            )}
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: Colors.screen,
    flex: 1
  },
  empty: {
    marginHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  text: h2,
  rect: {
    flexDirection: 'row',
    marginHorizontal: 24,
    paddingVertical: 10
  },
  add: {
    paddingRight: 4,
    justifyContent: 'center'
  },
  scrollViewContainer: {
    marginHorizontal: 24
  },
  button: {
    backgroundColor: Colors.accent,
    marginTop: 8,
    paddingHorizontal: 20,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center'
  }
});

export default PlaylistDetail;
