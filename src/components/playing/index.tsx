import React from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';

import YtItem from '../yt-item';
import Related from './related';

import { Colors } from '../../constants';
import { useCurrSong } from '../../hooks';

import { NavigationProps } from '../../types';

interface Props extends NavigationProps {}

const YtPlaying = (_: Props) => {
  const currSong = useCurrSong();

  const renderContent = () => {
    if (currSong == null || currSong.source !== 'YOUTUBE') {
      return null;
    }

    return (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.title}>YouTube</Text>
        <Text style={styles.subtitle}>Currently Playing</Text>
        <YtItem video={currSong} />
        <View style={styles.divider} />
        <Text style={styles.subtitle}>Related Videos</Text>
        <Related key={currSong.id} currSong={currSong} />
      </ScrollView>
    );
  };

  return <SafeAreaView style={styles.root}>{renderContent()}</SafeAreaView>;
};

const styles = StyleSheet.create({
  root: {
    height: '100%',
    backgroundColor: Colors.screen
  },
  scrollView: {
    paddingTop: 32,
    paddingHorizontal: 24
  },
  scrollViewContainer: {
    flexGrow: 1
  },
  title: {
    fontSize: 30,
    color: Colors.text
  },
  subtitle: {
    fontSize: 20,
    color: Colors.text
  },
  divider: {
    height: 1,
    borderTopWidth: 1,
    borderTopColor: Colors.border
  }
});

export default YtPlaying;
