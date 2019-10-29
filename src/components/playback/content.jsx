// @flow strict

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '../../constants';

import type { Song } from '../../types';

type Props = {|
  +currSong: Song
|};

const PlaybackContent = (props: Props) => {
  return (
    <View style={styles.root}>
      <Text>hello</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: Colors.screen,
    height: '100%'
  }
});

export default PlaybackContent;
