import {
  BottomTabBar,
  createBottomTabNavigator
} from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import Library from './components/library';
import Playback from './components/playback';
import Queue from './components/queue';
import Search from './components/search';
import Settings from './components/settings';
import { Colors } from './constants';
import {
  Library as LibraryIcon,
  Queue as QueueIcon,
  Search as SearchIcon,
  Settings as SettingsIcon
} from './icons';
import store from './state/store';

const Tab = createBottomTabNavigator();

const TabBarComponent = (props: React.ComponentProps<typeof BottomTabBar>) => {
  return (
    <>
      <Playback />
      <BottomTabBar {...props} />
    </>
  );
};

const Icons = {
  Library: LibraryIcon,
  Search: SearchIcon,
  Queue: QueueIcon,
  Settings: SettingsIcon
};

const App = () => {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <StatusBar barStyle="default" />
        <Tab.Navigator
          initialRouteName="Library"
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused }) => {
              const Icon = Icons[route.name as keyof typeof Icons];
              if (Icon == null) {
                return null;
              }
              return (
                <Icon width={25} height={25} fillOpacity={focused ? 1 : 0.5} />
              );
            }
          })}
          tabBarOptions={{
            activeTintColor: Colors.text,
            style: {
              backgroundColor: Colors.playback,
              borderTopWidth: 0,
              zIndex: 10
            }
          }}
          tabBar={TabBarComponent}>
          <Tab.Screen name="Library" component={Library} />
          <Tab.Screen name="Search" component={Search} />
          <Tab.Screen name="Queue" component={Queue} />
          <Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator>
      </Provider>
    </NavigationContainer>
  );
};

export default App;
