// @flow strict

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

import Loading from '../loading';
import PlaybackBar from '../playback-bar';
import Search from '../search';
import YtItem from '../yt-item';

import { ytSearch } from '../../yt-util';
import colors from '../../colors';

import type { VideoSong } from '../../types';

type Props = {|
  +navigation: {|
    +navigate: (screenName: string) => void,
    +getParam: <T>(paramName: string, defaultValue: T) => T
  |}
|};

const YtSearch = (props: Props) => {
  const [searching, setSearching] = React.useState(false);
  const [videos, setVideos] = React.useState<Array<VideoSong>>([]);

  const onSearch = (value: string) => {
    setSearching(true);

    ytSearch(value).then(results => {
      setSearching(false);
      setVideos(results);
    });
  };

  const onSelect = (song: VideoSong) => {
    props.navigation.push('YtPlaying', {
      song
    });
  };

  return (
    <SafeAreaView>
      <View style={styles.root}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContainer}>
          <Text style={styles.title}>YouTube</Text>
          <Search onEnter={onSearch} />
          {searching ? (
            <Loading />
          ) : (
            videos.map(video => (
              <TouchableHighlight
                key={video.id}
                onPress={() => onSelect(video)}>
                <YtItem video={video} />
              </TouchableHighlight>
            ))
          )}
        </ScrollView>
        <PlaybackBar />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    height: '100%',
    backgroundColor: colors.screen
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
    color: colors.text
  }
});

export default YtSearch;
