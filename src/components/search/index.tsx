import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import { Colors } from '../../constants';
import { useDispatch } from '../../hooks';
import { NavigationProps, VideoSong } from '../../types';
import { ytSearch } from '../../yt-util';
import Loading from '../loading';
import Search from '../search-bar';
import YtItem from '../yt-item';
import { h1 } from '../../styles';

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
            <YtItem
              key={video.id}
              video={video}
              onPress={() => onSelect(video)}
            />
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
  title: h1
});

export default YtSearch;
