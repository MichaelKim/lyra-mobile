// @flow strict

import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import colors from '../colors';
import { formatDuration, readableViews } from '../util';

import type { VideoSong } from '../types';

type PassedProps = {|
  +onClick?: () => void,
  +video: VideoSong
|};

const YtItem = (props: PassedProps) => {
  const { video } = props;

  return (
    <View style={styles.root}>
      <Image style={styles.thumbnail} source={{ uri: video.thumbnail.url }} />
      <View style={styles.text}>
        <Text style={styles.title}>{video.title}</Text>
        <Text style={styles.details}>
          {video.artist} • {formatDuration(video.duration)} •{' '}
          {readableViews(video.views)} views
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  thumbnail: {
    width: 120,
    height: 90,
    margin: 5
  },
  text: {
    height: 100,
    justifyContent: 'center',
    flex: 1
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text
  },
  details: {
    fontSize: 12,
    color: colors.text
  }
});

export default YtItem;
