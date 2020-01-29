import React from 'react';
import { StyleSheet, Text, Button } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-navigation';

import { Colors } from '../../constants';
import { getSongs } from '../../util';
import { useDispatch } from '../../hooks';

import { NavigationProps, Song } from '../../types';
import Loading from '../loading';

interface Props extends NavigationProps {}

const Settings = (_: Props) => {
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
  const clearData = () => dispatch({ type: 'CLEAR_DATA' });
  const addSongs = (songs: Array<Song>) =>
    dispatch({ type: 'ADD_SONGS', songs });

  const getLocalSongs = async () => {
    setLoading(true);
    const songs = await getSongs();
    addSongs(songs);
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.title}>Settings</Text>
        <Button title="Clear All Data" color="#222" onPress={clearData} />
        <Button title="Get Local Songs" color="#222" onPress={getLocalSongs} />
        {loading && <Loading />}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.screen
  },
  scrollViewContainer: {
    paddingTop: 32,
    marginHorizontal: 24
  },
  title: {
    fontSize: 30,
    color: Colors.text,
    marginBottom: 10
  }
});

export default Settings;
