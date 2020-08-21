import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../constants';
import { NavigationProps } from '../../types';
import Playlists from './playlist';
import Songs from './songs';
import Tabs from './tabs';

interface Props extends NavigationProps {}

const Library = (_: Props) => {
  return (
    <SafeAreaView style={styles.root}>
      <LinearGradient
        colors={[Colors.gradient, Colors.screen]}
        locations={[0, 0.1]}
        style={styles.linearGradient}>
        <Tabs headers={['All Songs', 'Playlists', 'More']}>
          <Songs />
          <Playlists />
          <Songs />
        </Tabs>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  linearGradient: {
    flex: 1
  }
});

export default Library;
