import React from 'react';
import { StyleSheet, View } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { connect } from 'react-redux';
import { BAR_HEIGHT } from '../../constants';
import { Song, StoreState } from '../../types';
import { getStreamURL } from '../../yt-util';
import PlaybackContent from './content';
import PlaybackFooter from './footer';
import PlaybackHeader from './header';
import Slide from './slide';

interface PassedProps {
  tab: number;
}

type Props = PassedProps & {
  currSong: Song | null;
};

class Playback extends React.Component<Props> {
  loadSong = async (prevSongID?: string) => {
    const { currSong } = this.props;

    if (currSong == null) {
      if (prevSongID != null) {
        // currSong turned null, stop playing
        TrackPlayer.stop();
      }
      return;
    }

    if (prevSongID === currSong.id) {
      return;
    }

    await TrackPlayer.pause();
    await TrackPlayer.reset();
    if (currSong.source === 'LOCAL') {
      await TrackPlayer.add({
        id: currSong.id,
        title: currSong.title,
        artist: currSong.artist,
        url: currSong.filepath,
        duration: currSong.duration,
        artwork: currSong.thumbnail.url
      });
    } else {
      const src = await getStreamURL(currSong.id);
      await TrackPlayer.add({
        id: currSong.id,
        title: currSong.title,
        artist: currSong.artist,
        url: src,
        duration: Number(currSong.duration || 1),
        artwork: currSong.thumbnail.url
      });
    }

    if (prevSongID != null) {
      TrackPlayer.play();
    }
  };

  async componentDidMount() {
    await TrackPlayer.setupPlayer({});
    await TrackPlayer.updateOptions({
      jumpInterval: 10,
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_SEEK_TO,
        TrackPlayer.CAPABILITY_JUMP_FORWARD,
        TrackPlayer.CAPABILITY_JUMP_BACKWARD,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS
        // TrackPlayer.CAPABILITY_STOP
      ]
      // compactCapabilities: [
      //   TrackPlayer.CAPABILITY_PLAY,
      //   TrackPlayer.CAPABILITY_PAUSE
      // ]
    });
    this.loadSong();
  }

  componentDidUpdate(prevProps: Props) {
    this.loadSong(prevProps.currSong?.id);
  }

  componentWillUnmount() {
    TrackPlayer.destroy();
  }

  renderHeader = () => {
    const { currSong } = this.props;

    if (currSong == null) {
      return null;
    }

    return <PlaybackHeader currSong={currSong} />;
  };

  renderContent = () => {
    const { currSong } = this.props;

    if (currSong == null) {
      return null;
    }

    return <PlaybackContent currSong={currSong} />;
  };

  renderFooter = () => {
    return <PlaybackFooter />;
  };

  render() {
    const { currSong, tab } = this.props;

    if (currSong == null) {
      return null;
    }

    return (
      <View style={styles.container}>
        <Slide
          tab={tab}
          renderHeader={this.renderHeader}
          renderContent={this.renderContent}
          renderFooter={this.renderFooter}
        />
      </View>
    );
  }
}

const mapState = (state: StoreState) => {
  const {
    songs,
    queue: { cache, curr }
  } = state;

  return {
    currSong: curr != null ? songs[curr] ?? cache[curr]?.song : null
  };
};

const styles = StyleSheet.create({
  container: {
    height: BAR_HEIGHT
  }
});

export default connect(mapState)(Playback);
