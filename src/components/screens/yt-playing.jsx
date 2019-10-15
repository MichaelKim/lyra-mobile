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
import YtItem from '../yt-item';

import colors from '../../colors';
import { getRelatedVideos } from '../../yt-util';
import { useDispatch } from '../../hooks';

import type { VideoSong } from '../../types';

type Props = {|
  +navigation: {|
    +navigate: (screenName: string) => void,
    +getParam: <T>(paramName: string, defaultValue: T) => T
  |}
|};

const YtPlaying = (props: Props) => {
  const [related, setRelated] = React.useState<Array<VideoSong>>([]);
  const dispatch = useDispatch();

  const song = props.navigation.getParam('song');

  React.useEffect(() => {
    dispatch({ type: 'SELECT_SONG', song });

    getRelatedVideos(song.id).then(relatedVideos => {
      setRelated(relatedVideos);
      dispatch({ type: 'SET_NEXT_SONG', song: relatedVideos[0] });
    });
  }, []);

  const onSelect = (newSong: VideoSong) => {
    props.navigation.push('YtPlaying', {
      song: newSong
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
          <Text style={styles.subtitle}>Currently Playing</Text>
          <YtItem video={song} />
          <View style={styles.divider} />
          <Text style={styles.subtitle}>Related Videos</Text>
          {related.length === 0 ? (
            <Loading />
          ) : (
            related.map(video => (
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
  },
  subtitle: {
    fontSize: 20,
    color: colors.text
  },
  divider: {
    height: 1,
    borderTopWidth: 1,
    borderTopColor: colors.border
  }
});

export default YtPlaying;
