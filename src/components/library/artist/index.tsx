import React from 'react';
import { StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useSelector } from '../../../hooks';
import ArtistItem from './item';
import { useNavigation } from '@react-navigation/native';

interface Props {}

const Artists = (_: Props) => {
  // TODO: Extract artist into its own state
  const artists = useSelector(state => {
    const songs = Object.values(state.songs);
    const map = songs.reduce((acc, s) => {
      if (acc[s.artist] == null) acc[s.artist] = 0;
      acc[s.artist] += 1;
      return acc;
    }, {} as { [artist: string]: number });
    return Object.entries(map);
  });

  const navigation = useNavigation();
  const onSelect = (artist: string) => {
    navigation.navigate('Artist', { artist });
  };

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.scrollViewContainer}
      data={artists}
      renderItem={({ item }) => (
        <ArtistItem artist={item[0]} numSongs={item[1]} onSelect={onSelect} />
      )}
      keyExtractor={item => item[0]}
    />
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    marginHorizontal: 24
  }
});

export default Artists;
