import React from 'react';
import { Provider } from 'react-redux';
import { StatusBar } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs';

import Library from './components/library';
import YtSearch from './components/search';
import Playback from './components/playback';
import store from './state/store';

import { Colors } from './constants';

const TabBarComponent = (props: React.ComponentProps<typeof BottomTabBar>) => {
  return (
    <>
      {/* <Slide /> */}
      <Playback />
      <BottomTabBar {...props} />
    </>
  );
};

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
    },
    tabBarComponent: props => <TabBarComponent {...props} />
  }
);

const Root = createAppContainer(Navigator);

const App = () => {
  return (
    <Provider store={store}>
      <StatusBar barStyle="default" />
      <Root />
    </Provider>
  );
};

export default App;
