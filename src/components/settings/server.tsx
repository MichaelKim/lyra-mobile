import React from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TextInputChangeEventData,
  TextInputEndEditingEventData,
  View
} from 'react-native';
import { Colors } from '../../constants';
import { useDispatch, useSelector } from '../../hooks';
import { h1, h2 } from '../../styles';

const ServerSettings = () => {
  const server = useSelector(state => state.yt);
  const [lyraUrl, setLyraUrl] = React.useState(server.url);

  const dispatch = useDispatch();
  const setServerUrl = React.useCallback(
    (url: string) => dispatch({ type: 'SET_LYRA_URL', url }),
    [dispatch]
  );
  const setServerApi = React.useCallback(
    (api: boolean) => dispatch({ type: 'SET_LYRA_API', api }),
    [dispatch]
  );

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
    <>
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
    </>
  );
};

const styles = StyleSheet.create({
  title: h1,
  subtitle: h2,
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

export default ServerSettings;
