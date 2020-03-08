import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { RectButton, TouchableOpacity } from 'react-native-gesture-handler';
import { Colors } from '../constants';
import { Options } from '../icons';
import { VideoSong } from '../types';
import { formatDuration } from '../util';

interface PassedProps {
  onPress?: () => void;
  video: VideoSong;
}

const YtItem = ({ onPress, video }: PassedProps) => {
  const onOptions = () => {
    console.log('press');
  };

  return (
    <View style={styles.root}>
      <RectButton onPress={onPress} rippleColor="#111" style={styles.rect}>
        <View style={styles.item} collapsable={false}>
          <Image
            style={styles.thumbnail}
            source={{ uri: video.thumbnail.url }}
          />
          <View style={styles.text}>
            <Text style={styles.title}>{video.title}</Text>
            <Text style={styles.details}>
              {video.artist} • {formatDuration(video.duration)}
              {video.views && ` • ${video.views} views`}
            </Text>
          </View>
        </View>
      </RectButton>
      <TouchableOpacity onPress={onOptions} style={styles.options}>
        <Options width={25} height={25} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 100
  },
  rect: {
    flex: 1
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  thumbnail: {
    width: 120,
    height: 90,
    margin: 5
  },
  text: {
    height: 100,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.text
  },
  details: {
    fontSize: 12,
    color: Colors.text
  },
  options: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40
  }
});

export default YtItem;
