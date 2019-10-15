// @flow strict

import React from 'react';
import { Provider } from 'react-redux';
import { StatusBar } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { useScreens } from 'react-native-screens';

import YtPlaying from './components/screens/yt-playing';
import YtSearch from './components/screens/yt-search';

import store from './state/store';

useScreens();

const AppNavigator = createStackNavigator(
  {
    YtSearch: YtSearch,
    YtPlaying: YtPlaying
  },
  {
    initialRouteName: 'YtSearch',
    headerMode: 'none'
  }
);

const Root = createAppContainer(AppNavigator);

const App = () => {
  return (
    <Provider store={store}>
      <StatusBar barStyle="default" />
      <Root />
    </Provider>
  );
};

export default App;
