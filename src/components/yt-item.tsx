import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Colors } from '../constants';
import { useDispatch, useSelector } from '../hooks';
import { Options } from '../icons';
import { h3, h4 } from '../styles';
import { VideoSong } from '../types';
import { formatDuration } from '../util';
import ContextMenu from './context';
import Thumbnail from './thumbnail';

type Props = {
  onPress?: () => void;
  video: VideoSong;
};

const YtItem = ({ onPress, video }: Props) => {
  const songAdded = useSelector(state => state.songs[video.id] != null);
  const dispatch = useDispatch();
  const items = [
    songAdded
      ? {
          label: 'Remove from Library',
          onPress: () => dispatch({ type: 'REMOVE_SONG', id: video.id })
        }
      : {
          label: 'Add to Library',
          onPress: () => dispatch({ type: 'ADD_SONGS', songs: [video] })
        },
    {
      label: 'Add to Queue',
      onPress: () => dispatch({ type: 'QUEUE_SONG', song: video })
    }
  ];

  return (
    <View style={styles.root}>
      <RectButton
        onPress={onPress}
        rippleColor={Colors.ripple}
        style={styles.rect}>
        <Thumbnail src={video.thumbnail} style={styles.thumbnail} />
        <View style={styles.text}>
          <Text style={styles.title}>{video.title}</Text>
          <Text style={styles.details}>
            {video.artist} • {formatDuration(video.duration)}
            {video.views && ` • ${video.views} views`}
          </Text>
        </View>
      </RectButton>

      <ContextMenu items={items} style={styles.options}>
        <Options width={25} height={25} />
      </ContextMenu>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rect: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    flex: 1
  },
  thumbnail: {
    height: 60,
    marginRight: 8
  },
  text: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1
  },
  title: h3,
  details: h4,
  options: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40
  }
});

export default React.memo(YtItem);
