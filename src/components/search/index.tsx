import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import { RootTabParamList } from '../../App';
import { Colors } from '../../constants';
import { useDispatch } from '../../hooks';
import { h1 } from '../../styles';
import { StackProps, VideoSong } from '../../types';
import { ytSearch, ytSuggest } from '../../yt-util';
import Loading from '../loading';
import Search from '../search-bar';
import YtItem from '../yt-item';

type Props = StackProps<RootTabParamList, 'Search'>;

const YtSearch = (_: Props) => {
  const [searching, setSearching] = React.useState(false);
  const [videos, setVideos] = React.useState<Array<VideoSong>>([]);
  const [suggest, setSuggest] = React.useState<string[]>([]);
  const dispatch = useDispatch();

  const onChange = async (value: string) => {
    if (value === '') {
      setSuggest([]);
    } else {
      setSuggest(await ytSuggest(value));
    }
  };

  const onSearch = (value: string) => {
    setSearching(true);

    dispatch({ type: 'ADD_TO_HISTORY', search: value });

    ytSearch(value).then(results => {
      setSearching(false);
      setVideos(results);
    });
  };

  const onSelect = (song: VideoSong) => {
    dispatch({ type: 'SELECT_SONG', song });
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.title}>YouTube</Text>
        <Search onChange={onChange} onEnter={onSearch} suggestions={suggest} />
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
