import React from 'react';
import { Provider } from 'react-redux';
import { StatusBar } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import Library from './components/library';
import YtSearch from './components/search';
import Playback from './components/playback';
import store from './state/store';

import { Colors } from './constants';

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
      <Playback />
    </Provider>
  );
};

export default App;
