// @flow strict

import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import Video from 'react-native-video';

import { getStreamURL } from '../yt-util';
import { useSelector } from '../hooks';

const Playback = () => {
  const currSong = useSelector(state => state.currSong);
  const [src, setSrc] = React.useState('');

  React.useEffect(() => {
    console.log(currSong);
    if (currSong == null) return;

    getStreamURL(currSong.id).then(url => setSrc(url));
  }, [currSong]);

  if (currSong == null) {
    return null;
  }

  return (
    <View style={styles.root}>
      {src !== '' && <Video source={{ uri: src }} />}
      <View style={styles.song}>
        <Text style={styles.songTitle}>{currSong.title}</Text>
        <Text style={styles.songArtist}>{currSong.artist}</Text>
      </View>
      <Button style={styles.playPause} title=">" onClick={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#111',
    height: 60,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center'
  },
  song: {
    flex: 1
  },
  songTitle: {
    fontSize: 15,
    color: '#ddd'
  },
  songArtist: {
    fontSize: 12,
    color: '#ddd'
  },
  playPause: {
    width: 30,
    height: 30
  }
});

export default Playback;
