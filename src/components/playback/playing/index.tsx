import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import YtItem from '../../yt-item';
import Related from './related';

import { Colors } from '../../../constants';
import { VideoSong } from '../../../types';

interface Props {
  currSong: VideoSong;
}

const Playing = ({ currSong }: Props) => {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContainer}
      enabled>
      <Text style={styles.subtitle}>Currently Playing</Text>
      <YtItem video={currSong} />
      <View style={styles.divider} />
      <Text style={styles.subtitle}>Related Videos</Text>
      <Related key={currSong.id} currSong={currSong} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    paddingTop: 32,
    paddingHorizontal: 24,
    overflow: 'hidden'
  },
  scrollViewContainer: {
    flexGrow: 1
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

export default Playing;
