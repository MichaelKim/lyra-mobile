// @flow strict

import React from 'react';
import {StyleSheet, ScrollView, View, Text} from 'react-native';

import YtItem from './yt-item';

const colors = {
  screen: '#333',
  text: '#ddd',
};

const Root = () => {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.scrollView}>
      <Text style={styles.title}>YouTube</Text>
      <YtItem />
      <YtItem />
      <YtItem />
      <YtItem />
      <YtItem />
      <YtItem />
      <YtItem />
      <YtItem />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: colors.screen,
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 30,
    color: colors.text,
  },
  // sectionContainer: {},
  // sectionTitle: {
  //   fontSize: 24,
  //   fontWeight: '600',
  //   color: Colors.black,
  // },
  // sectionDescription: {
  //   marginTop: 8,
  //   fontSize: 18,
  //   fontWeight: '400',
  //   color: Colors.dark,
  // },
  // highlight: {
  //   fontWeight: '700',
  // },
  // footer: {
  //   color: Colors.dark,
  //   fontSize: 12,
  //   fontWeight: '600',
  //   padding: 4,
  //   paddingRight: 12,
  //   textAlign: 'right',
  // },
});

export default Root;
