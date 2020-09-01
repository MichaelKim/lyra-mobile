import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Colors } from '../../../constants';
import { useDispatch, useSelector } from '../../../hooks';
import { h2 } from '../../../styles';
import { Song, StackProps } from '../../../types';
import SongItem from '../../song-item';
import Header from '../header';
import { LibraryStackParamList } from '../index';

type Props = StackProps<LibraryStackParamList, 'Artist'>;

const ArtistScreen = ({ route, navigation }: Props) => {
  const { artist } = route.params;
  const songs = useSelector(state =>
    Object.values(state.songs).filter(s => s.artist === artist)
  );

  const dispatch = useDispatch();
  const onSelect = (song: Song) => {
    dispatch({ type: 'SELECT_SONG', song });
  };

  const onClose = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.root}>
      <Header title={artist || 'Unknown Artist'} onBack={onClose} />
      {songs.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.text}>No songs!</Text>
        </View>
      ) : (
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.scrollViewContainer}
          data={songs}
          renderItem={({ item }) => (
            <SongItem song={item} onSelect={onSelect} />
          )}
        />
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
  scrollViewContainer: {
    marginHorizontal: 24
  }
});

export default ArtistScreen;
