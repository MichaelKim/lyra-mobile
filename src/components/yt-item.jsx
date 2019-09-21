// @flow strict

import React from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';

const colors = {
  screen: '#333',
  text: '#ddd',
};

const YtItem = () => {
  return (
    <View style={styles.root}>
      <Image
        style={styles.thumbnail}
        source={{uri: 'https://i.ytimg.com/vi/kKHlcgZ5xsY/default.jpg'}}
      />
      <View style={styles.text}>
        <Text style={styles.title}>
          【MV】Royal Scandal 「チェルシー」/ luz-Chelsea
        </Text>
        <Text style={styles.details}>luz channel • 5:16 • 615K views</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnail: {
    width: 120,
    height: 90,
    margin: 5,
  },
  text: {
    height: 100,
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text,
  },
  details: {
    fontSize: 15,
    color: colors.text,
  },
});

export default YtItem;
