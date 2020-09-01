import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { RootTabParamList } from '../../App';
import { PlaylistID, TabProps } from '../../types';
import PlaylistDetail from './playlist/screen';
import Library from './library';
import ArtistScreen from './artist/screen';

const Stack = createStackNavigator<LibraryStackParamList>();

export type LibraryStackParamList = {
  Library: undefined;
  Playlist: { pid: PlaylistID };
  Artist: { artist: string };
};

type Props = TabProps<RootTabParamList, 'Library'>;

const Nav = (_: Props) => {
  return (
    <Stack.Navigator initialRouteName="Library" headerMode="none">
      <Stack.Screen name="Library" component={Library} />
      <Stack.Screen name="Playlist" component={PlaylistDetail} />
      <Stack.Screen name="Artist" component={ArtistScreen} />
    </Stack.Navigator>
  );
};

export default Nav;
