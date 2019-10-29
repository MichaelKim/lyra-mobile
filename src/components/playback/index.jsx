// @flow strict

import React from 'react';
import { StyleSheet, View } from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import Video from 'react-native-video';

import PlaybackContent from './content';
import PlaybackHeader from './header';
import { getStreamURL } from '../../yt-util';

import { BAR_HEIGHT } from '../../constants';
import { useSelector } from '../../hooks';

const Playback = () => {
  const currSong = useSelector(state => state.currSong);
  const [src, setSrc] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [paused, setPaused] = React.useState(false);
  const [progress, setProgress] = React.useState({
    currentTime: 0,
    playableDuration: 0,
    seekableDuration: 0
  });

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

  return (
    <View style={styles.container}>
      {src !== '' && (
        <Video
          source={{ uri: src }}
          playInBackground
          paused={paused}
          onLoad={() => {
            setPaused(false);
            setLoading(false);
          }}
          onProgress={setProgress}
        />
      )}
      <BottomSheet
        snapPoints={[BAR_HEIGHT, '100%']}
        renderHeader={() => (
          <PlaybackHeader
            currSong={currSong}
            loading={loading}
            paused={paused}
            setPaused={setPaused}
            progress={progress}
          />
        )}
        renderContent={() => <PlaybackContent currSong={currSong} />}
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
