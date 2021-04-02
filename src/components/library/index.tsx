import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RootTabParamList } from '../../App';
import { Colors } from '../../constants';
import { PlaylistID, TabProps } from '../../types';
import ArtistScreen from './artist/screen';
import Library from './library';
import PlaylistDetail from './playlist/screen';

const Stack = createStackNavigator<LibraryStackParamList>();

export type LibraryStackParamList = {
  Library: undefined;
  Playlist: { pid: PlaylistID };
  Artist: { artist: string };
};

type Props = TabProps<RootTabParamList, 'Library'>;

const Nav = (_: Props) => {
  return (
    <View style={styles.view}>
      <Stack.Navigator
        initialRouteName="Library"
        screenOptions={{
          headerShown: false,
          cardOverlayEnabled: false
        }}>
        <Stack.Screen name="Library" component={Library} />
        <Stack.Screen name="Playlist" component={PlaylistDetail} />
        <Stack.Screen name="Artist" component={ArtistScreen} />
      </Stack.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: Colors.screen
  }
});

export default Nav;
