// @flow strict

import React from 'react';
import { Provider } from 'react-redux';
import { StatusBar } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
// import { createStackNavigator } from 'react-navigation-stack';
// $FlowFixMe
import { useScreens } from 'react-native-screens';

import Library from './components/screens/library';
import PlaybackBar from './components/playback';
import YtSearch from './components/screens/yt-search';

import store from './state/store';
import { Colors } from './constants';

useScreens();

// createStackNavigator({
//   Library: Library,
//   AllSongs: AllSongs,

// })

const Navigator = createBottomTabNavigator(
  {
    Library: Library,
    YouTube: YtSearch
  },
  {
    initialRouteName: 'Library',
    tabBarOptions: {
      activeTintColor: Colors.text,
      style: {
        backgroundColor: Colors.playback,
        borderTopWidth: 0
      }
    }
  }
);

const Root = createAppContainer(Navigator);

const App = () => {
  return (
    <Provider store={store}>
      <StatusBar barStyle="default" />
      <Root />
      <PlaybackBar />
    </Provider>
  );
};

export default App;
