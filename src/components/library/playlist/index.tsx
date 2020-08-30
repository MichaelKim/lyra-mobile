import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FlatList, RectButton } from 'react-native-gesture-handler';
import { Colors } from '../../../constants';
import { useDispatch, useSelector } from '../../../hooks';
import { h2, h3 } from '../../../styles';
import { Playlist } from '../../../types';
import Create from './create';
import PlaylistItem from './item';
import { Add } from '../../../icons';
import { useNavigation } from '@react-navigation/native';

interface Props {}

const Playlists = (_: Props) => {
  const [showModal, setModal] = React.useState<boolean>(false);
  const navigation = useNavigation();
  const playlists = useSelector(state => Object.values(state.playlists));

  const dispatch = useDispatch();
  const createPlaylist = (name: string) =>
    dispatch({
      type: 'CREATE_PLAYLIST',
      playlist: {
        id: Date.now().toString(),
        name,
        songs: []
      }
    });

  const onSelect = (playlist: Playlist) => {
    navigation.navigate('Playlist', { pid: playlist.id });
  };

  const onNewPlaylist = () => setModal(true);

  const onEnter = (name: string) => {
    createPlaylist(name);
    setModal(false);
  };

  const onCancel = () => setModal(false);

  return (
    <>
      <Create visible={showModal} onEnter={onEnter} onCancel={onCancel} />
      {playlists.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.text}>No playlists!</Text>
          <RectButton onPress={onNewPlaylist} style={styles.button}>
            <Text style={styles.text}>Create New Playlist</Text>
          </RectButton>
        </View>
      ) : (
        <>
          <RectButton onPress={onNewPlaylist} style={styles.rect}>
            <View style={styles.add}>
              <Add width={25} height={25} />
            </View>
            <Text style={h2}>Create New Playlist</Text>
          </RectButton>
          <FlatList
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={styles.scrollViewContainer}
            data={playlists}
            renderItem={({ item }) => (
              <PlaylistItem key={item.id} playlist={item} onSelect={onSelect} />
            )}
          />
        </>
      )}
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
