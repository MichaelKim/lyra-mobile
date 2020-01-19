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
import Search from '../search-bar';
import YtItem from '../yt-item';

import { Colors } from '../../constants';
import { useDispatch } from '../../hooks';
import { ytSearch } from '../../yt-util';

import { VideoSong } from '../../types';

interface Props {
  navigation: {
    navigate: (screenName: string) => void;
    getParam: <T>(paramName: string, defaultValue: T) => T;
  };
}

const YtSearch = (_: Props) => {
  const [searching, setSearching] = React.useState(false);
  const [videos, setVideos] = React.useState<Array<VideoSong>>([]);
  const dispatch = useDispatch();

  const onSearch = (value: string) => {
    setSearching(true);

    ytSearch(value).then(results => {
      setSearching(false);
      setVideos(results);
    });
  };

  const onSelect = (song: VideoSong) => {
    dispatch({ type: 'SELECT_SONG', song });
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
      </View>
    </SafeAreaView>
  );
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
  }
});

export default YtSearch;
