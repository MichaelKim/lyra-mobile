import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FlatList, RectButton } from 'react-native-gesture-handler';
import { Colors } from '../../../constants';
import { useDispatch, useSelector } from '../../../hooks';
import { h2, h3 } from '../../../styles';
import { Playlist } from '../../../types';
import Create from './create';
import PlaylistItem from './item';
import PlaylistScreen from './screen';
import { Add } from '../../../icons';

interface Props {}

const Playlists = (_: Props) => {
  const [showModal, setModal] = React.useState<boolean>(false);
  const [selectedPlaylist, setPlaylist] = React.useState<
    Playlist | undefined
  >();

  const playlists = useSelector(state => Object.values(state.playlists));

  const dispatch = useDispatch();
  const createPlaylist = React.useCallback(
    (name: string) =>
      dispatch({
        type: 'CREATE_PLAYLIST',
        playlist: {
          id: Date.now().toString(),
          name,
          songs: []
        }
      }),
    [dispatch]
  );

  const onSelect = React.useCallback((playlist: Playlist) => {
    setPlaylist(playlist);
  }, []);

  const onNewPlaylist = React.useCallback(() => setModal(true), [setModal]);

  const onEnter = React.useCallback(
    (name: string) => {
      createPlaylist(name);
      setModal(false);
    },
    [createPlaylist, setModal]
  );

  const onCancel = React.useCallback(() => setModal(false), [setModal]);

  const onClose = React.useCallback(() => {
    setPlaylist(undefined);
  }, []);

  if (playlists.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.text}>No playlists!</Text>
        <RectButton onPress={onNewPlaylist} style={styles.button}>
          <Text style={styles.text}>Create New Playlist</Text>
        </RectButton>
        <Create visible={showModal} onEnter={onEnter} onCancel={onCancel} />
      </View>
    );
  }

  return (
    <>
      <RectButton onPress={onNewPlaylist} style={styles.rect}>
        <View style={styles.add}>
          <Add width={25} height={25} />
        </View>
        <Text style={h2}>Create New Playlist</Text>
      </RectButton>
      <Create visible={showModal} onEnter={onEnter} onCancel={onCancel} />
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollViewContainer}
        data={playlists}
        renderItem={({ item }) => (
          <PlaylistItem key={item.id} playlist={item} onSelect={onSelect} />
        )}
      />
      <PlaylistScreen playlist={selectedPlaylist} onClose={onClose} />
    </>
  );
};

const styles = StyleSheet.create({
  empty: {
    marginHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  rect: {
    flexDirection: 'row',
    marginHorizontal: 24,
    paddingVertical: 10
  },
  add: {
    paddingRight: 4,
    justifyContent: 'center'
  },
  text: h2,
  button: {
    backgroundColor: Colors.accent,
    marginTop: 8,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center'
  },
  header: {
    ...h2,
    marginBottom: 8
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textInput: {
    ...h3,
    padding: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    height: 40,
    paddingLeft: 4
  },
  scrollViewContainer: {
    marginHorizontal: 24
  }
});

export default Playlists;
