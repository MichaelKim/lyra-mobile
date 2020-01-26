import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent
} from 'react-native';
import {
  ScrollView,
  NativeViewGestureHandler
} from 'react-native-gesture-handler';

import YtItem from '../../yt-item';
import Related from './related';

import { Colors } from '../../../constants';
import { VideoSong } from '../../../types';

interface Props {
  currSong: VideoSong;
}

const Playing = ({ currSong }: Props) => {
  const [scroll, setScroll] = React.useState(true);

  const onScrollEnd = ({
    nativeEvent
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    console.log('animation end', nativeEvent);

    if (nativeEvent.contentOffset.y === 0) {
      setScroll(false);
    } else {
      setScroll(true);
    }
  };

  const onScrollStart = ({
    nativeEvent
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    console.log('start', nativeEvent);
    setScroll(true);
  };

  return (
    <NativeViewGestureHandler>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContainer}
        onMomentumScrollEnd={onScrollEnd}
        onScrollBeginDrag={onScrollStart}
        enabled={scroll}>
        <Text style={styles.subtitle}>Currently Playing</Text>
        <YtItem video={currSong} />
        <View style={styles.divider} />
        <Text style={styles.subtitle}>Related Videos</Text>
        <Related key={currSong.id} currSong={currSong} />
      </ScrollView>
    </NativeViewGestureHandler>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    paddingTop: 32,
    paddingHorizontal: 24,
    overflow: 'hidden'
  },
  scrollViewContainer: {
    flexGrow: 1
  },
  subtitle: {
    fontSize: 20,
    color: Colors.text
  },
  divider: {
    height: 1,
    borderTopWidth: 1,
    borderTopColor: Colors.border
  }
});

export default Playing;
