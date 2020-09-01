import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../constants';
import { StackProps } from '../../types';
import { LibraryStackParamList } from './index';
import Playlists from './playlist';
import Songs from './song';
import Tabs from './tabs';
import Artists from './artist';

type Props = StackProps<LibraryStackParamList, 'Library'>;

const Library = (_: Props) => {
  return (
    <SafeAreaView style={styles.root}>
      <LinearGradient
        colors={[Colors.gradient, Colors.screen]}
        locations={[0, 0.1]}
        style={styles.linearGradient}>
        <Tabs headers={['Playlists', 'Artists', 'All Songs']}>
          <Playlists />
          <Artists />
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
