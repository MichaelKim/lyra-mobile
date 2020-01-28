import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import Video from 'react-native-video';
import MusicControl from 'react-native-music-control';

import PlaybackContent from './content';
import PlaybackHeader from './header';
import Slide from './slide';
import { getStreamURL } from '../../yt-util';

import { BAR_HEIGHT } from '../../constants';
import { Song, StoreState, Action } from '../../types';
import { Dispatch } from 'redux';

interface Props {
  currSong: Song | null;
  skipNext: () => void;
}

interface State {
  src: string;
  loading: boolean;
  paused: boolean;
  progress: {
    currentTime: number;
    playableDuration: number;
    seekableDuration: number;
  };
}

class Playback extends React.Component<Props, State> {
  state = {
    src: '',
    loading: true,
    paused: true,
    progress: {
      currentTime: 0,
      playableDuration: 0,
      seekableDuration: 0
    }
  };

  player = React.createRef<Video>();

  togglePause = () => {
    this.setState({
      paused: !this.state.paused
    });
  };

  loadSong = async (autoplay: boolean, prevSongID?: string) => {
    const { currSong } = this.props;

    if (currSong == null) {
      if (prevSongID != null) {
        // currSong turned null, stop playing
        this.setState({
          paused: true,
          src: ''
        });
      }
      return;
    }

    if (prevSongID === currSong.id) {
      return;
    }

    this.setState({
      paused: true,
      loading: true
    });

    if (currSong.source === 'LOCAL') {
      this.setState({
        src: currSong.filepath
      });
      MusicControl.setNowPlaying({
        title: currSong.title,
        artist: currSong.artist,
        duration: currSong.duration
      });
    } else {
      const src = await getStreamURL(currSong.id);
      this.setState({
        src
      });
      MusicControl.setNowPlaying({
        title: currSong.title,
        artist: currSong.artist,
        duration: Number(currSong.duration),
        artwork: currSong.thumbnail.url
        // description: '', // Android Only
        // color: 0xFFFFFF, // Notification Color - Android Only
        // date: '1983-01-02T00:00:00Z', // Release Date (RFC 3339) - Android Only
        // rating: 84, // Android Only (Boolean or Number depending on the type)
        // notificationIcon: 'my_custom_icon' // Android Only (String), Android Drawable resource name for a custom notification icon
      });
    }

    if (autoplay) {
      this.setState({
        paused: false
      });
    }
  };

  componentDidMount() {
    this.loadSong(false);
  }

  componentDidUpdate(prevProps: Props) {
    this.loadSong(true, prevProps.currSong?.id);

    MusicControl.updatePlayback({
      elapsedTime: this.state.progress.currentTime,
      state:
        this.props.currSong == null
          ? MusicControl.STATE_STOPPED
          : this.state.loading
          ? MusicControl.STATE_BUFFERING
          : this.state.paused
          ? MusicControl.STATE_PAUSED
          : MusicControl.STATE_PLAYING
    });
  }

  onSeek = (seek: number) => {
    if (this.player.current) {
      this.setState({
        loading: true
      });
      this.player.current.seek(seek);
    }
  };

  onProgress = (progress: State['progress']) => {
    this.setState({
      progress
    });
  };

  onLoad = () => {
    this.setState({
      paused: false,
      loading: false
    });
  };

  onFinishedSeek = () => {
    this.setState({
      loading: false
    });
  };

  skipNext = () => {
    this.setState({
      paused: true
    });
    this.onSeek(0);
    this.props.skipNext();
  };

  render() {
    const { currSong } = this.props;
    const { src, loading, paused, progress } = this.state;

    if (currSong == null) {
      return null;
    }

    return (
      <View style={styles.container}>
        {src !== '' && (
          <Video
            source={{ uri: src }}
            ref={this.player}
            playInBackground
            paused={paused}
            onLoad={this.onLoad}
            onSeek={this.onFinishedSeek}
            onProgress={this.onProgress}
            onEnd={this.skipNext}
          />
        )}
        <Slide
          renderHeader={() => (
            <PlaybackHeader
              currSong={currSong}
              loading={loading}
              paused={paused}
              togglePause={this.togglePause}
              progress={progress}
            />
          )}
          renderContent={() => (
            <PlaybackContent
              currSong={currSong}
              progress={progress}
              onSeek={this.onSeek}
              paused={paused}
              togglePause={this.togglePause}
            />
          )}
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

const mapDispatch = (dispatch: Dispatch<Action>) => ({
  skipNext: () => dispatch({ type: 'SKIP_NEXT' })
});

const styles = StyleSheet.create({
  container: {
    height: BAR_HEIGHT
  }
});

export default connect(mapState, mapDispatch)(Playback);
