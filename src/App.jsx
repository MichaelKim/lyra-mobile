// @flow strict

import React from 'react';
import { Provider } from 'react-redux';
import { StatusBar } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
// import { createStackNavigator } from 'react-navigation-stack';
import { useScreens } from 'react-native-screens';

import Library from './components/screens/library';
import PlaybackBar from './components/playback-bar';
import YtPlaying from './components/screens/yt-playing';
import YtSearch from './components/screens/yt-search';

import store from './state/store';

useScreens();

const Navigator = createBottomTabNavigator(
  {
    Library: Library,
    YtSearch: YtSearch,
    YtPlaying: YtPlaying
  },
  {
    initialRouteName: 'Library'
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
