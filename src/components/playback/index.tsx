import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Video from 'react-native-video';

import PlaybackContent from './content';
import PlaybackHeader from './header';
import Slide from './slide';
import { getStreamURL } from '../../yt-util';

import { BAR_HEIGHT } from '../../constants';
import { useDispatch, useSelector } from '../../hooks';

const Playback = () => {
  const currSong = useSelector(state => {
    const { queue } = state;
    const { curr } = queue;

    return curr != null ? state.songs[curr] ?? queue.cache[curr]?.song : null;
  });
  const [src, setSrc] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [paused, setPaused] = React.useState(false);
  const [progress, setProgress] = React.useState({
    currentTime: 0,
    playableDuration: 0,
    seekableDuration: 0
  });
  const player = React.useRef<Video>(null);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (currSong == null) {
      return;
    }

    setPaused(true);
    setLoading(true);
    if (currSong.source === 'LOCAL') {
      setSrc(currSong.filepath);
    } else {
      getStreamURL(currSong.id).then(url => setSrc(url));
    }
  }, [currSong]);

  if (currSong == null) {
    return null;
  }

  const onSeek = (seek: number) => {
    player.current && player.current.seek(seek);
  };

  const { height } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      {src !== '' && (
        <Video
          source={{ uri: src }}
          ref={player}
          playInBackground
          paused={paused}
          onLoad={() => {
            setPaused(false);
            setLoading(false);
          }}
          onProgress={setProgress}
          onEnd={() => dispatch({ type: 'SKIP_NEXT' })}
        />
      )}
      <Slide
        renderHeader={() => (
          <PlaybackHeader
            currSong={currSong}
            loading={loading}
            paused={paused}
            setPaused={setPaused}
            progress={progress}
          />
        )}
        renderContent={() => (
          <PlaybackContent
            currSong={currSong}
            progress={progress}
            onSeek={onSeek}
            paused={paused}
            setPaused={setPaused}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: BAR_HEIGHT
  }
});

export default Playback;
