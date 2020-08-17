import React from 'react';
import {
  StyleSheet,
  Text,
  Button,
  TextInput,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  TextInputEndEditingEventData,
  Switch,
  View
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-navigation';

import { Colors } from '../../constants';
import { getSongs } from '../../util';
import { useSelector, useDispatch } from '../../hooks';

import { NavigationProps, Song } from '../../types';
import Loading from '../loading';

interface Props extends NavigationProps {}

const Settings = (_: Props) => {
  const [loading, setLoading] = React.useState(false);

  const server = useSelector(state => state.yt);
  const [lyraUrl, setLyraUrl] = React.useState(server.url);

  const dispatch = useDispatch();
  const clearData = () => dispatch({ type: 'CLEAR_DATA' });
  const addSongs = (songs: Array<Song>) =>
    dispatch({ type: 'ADD_SONGS', songs });
  const setServerUrl = React.useCallback(
    (url: string) => dispatch({ type: 'SET_LYRA_URL', url }),
    [dispatch]
  );
  const setServerApi = React.useCallback(
    (api: boolean) => dispatch({ type: 'SET_LYRA_API', api }),
    [dispatch]
  );

  const getLocalSongs = async () => {
    setLoading(true);
    const songs = await getSongs();
    addSongs(songs);
    setLoading(false);
  };

  const onChange = React.useCallback(
    (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
      setLyraUrl(e.nativeEvent.text);
    },
    [setLyraUrl]
  );

  const onEndEditing = React.useCallback(
    (e: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
      const { text } = e.nativeEvent;
      if (text !== lyraUrl) {
        setServerUrl(e.nativeEvent.text);
      }
    },
    [lyraUrl, setServerUrl]
  );

  const onToggle = React.useCallback(
    (value: boolean) => {
      setServerApi(value);
    },
    [setServerApi]
  );

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.title}>Settings</Text>
        <Button title="Clear All Data" color="#222" onPress={clearData} />
        <Text style={styles.subtitle}>Server</Text>
        <View style={styles.row}>
          <Text style={styles.rowText}>URL</Text>
          <TextInput
            style={styles.urlInput}
            autoCapitalize={'none'}
            onChange={onChange}
            onEndEditing={onEndEditing}
            value={lyraUrl}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.rowText}>Use API?</Text>
          <Switch onValueChange={onToggle} value={server.api} />
        </View>
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
  },
  subtitle: {
    fontSize: 20,
    color: Colors.text
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rowText: {
    fontSize: 16,
    color: Colors.text
  },
  urlInput: {
    color: Colors.text
  }
});

export default Settings;
