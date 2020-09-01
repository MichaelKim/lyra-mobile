import React from 'react';
import { Button, SafeAreaView, StyleSheet, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { RootTabParamList } from '../../App';
import { Colors } from '../../constants';
import { useDispatch } from '../../hooks';
import { h1 } from '../../styles';
import { TabProps } from '../../types';
import { getSongs } from '../../util';
import Loading from '../loading';
import ServerSettings from './server';

type Props = TabProps<RootTabParamList, 'Settings'>;

const Settings = (_: Props) => {
  const [loading, setLoading] = React.useState(false);

  const dispatch = useDispatch();
  const clearData = () => dispatch({ type: 'CLEAR_DATA' });

  const getLocalSongs = async () => {
    setLoading(true);
    const songs = await getSongs();
    dispatch({ type: 'ADD_SONGS', songs });
    dispatch({
      type: 'CREATE_PLAYLIST',
      playlist: {
        id: Date.now().toString(),
        name: 'Local Songs',
        songs: songs.map(s => s.id)
      }
    });
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.title}>Settings</Text>
        <Button title="Clear All Data" color="#222" onPress={clearData} />
        <ServerSettings />
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
  title: h1
});

export default Settings;
