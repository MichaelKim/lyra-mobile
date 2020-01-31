import React from 'react';
import { StyleSheet, ScrollView, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-navigation';

import Loading from '../loading';
import Search from '../search-bar';
import YtItem from '../yt-item';

import { Colors } from '../../constants';
import { useDispatch } from '../../hooks';
import { ytSearch } from '../../yt-util';

import { VideoSong, NavigationProps } from '../../types';

interface Props extends NavigationProps {}

const YtSearch = (props: Props) => {
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
    props.navigation.navigate('Playing');
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.title}>YouTube</Text>
        <Search onEnter={onSearch} />
        {searching ? (
          <Loading />
        ) : (
          videos.map(video => (
            <RectButton
              key={video.id}
              rippleColor="#111"
              onPress={() => onSelect(video)}>
              <YtItem video={video} />
            </RectButton>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.screen
  },
  scrollViewContainer: {
    paddingTop: 32,
    marginHorizontal: 24,
    flexGrow: 1
  },
  title: {
    fontSize: 30,
    color: Colors.text
  }
});

export default YtSearch;
