import React from 'react';
import { StyleSheet, View } from 'react-native';
import MusicControl from 'react-native-music-control';
import Video, { OnProgressData } from 'react-native-video';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { BAR_HEIGHT } from '../../constants';
import { Action, Song, StoreState } from '../../types';
import { getStreamURL } from '../../yt-util';
import PlaybackContent from './content';
import PlaybackFooter from './footer';
import PlaybackHeader from './header';
import Slide from './slide';

type PassedProps = {
  tab: number;
};

type Props = PassedProps & {
  currSong: Song | null;
  repeat: boolean;
  skipNext: () => void;
};

type State = {
  src: string;
  loading: boolean;
  paused: boolean;
  progress: OnProgressData;
  autoplay: boolean;
};

class Playback extends React.Component<Props, State> {
  state = {
    src: '',
    loading: true,
    paused: true,
    autoplay: false,
    progress: {
      currentTime: 0,
      playableDuration: 0,
      seekableDuration: 0
    }
  };

  player = React.createRef<Video>();

  setPaused = (paused: boolean) => {
    this.setState({
      paused
    });
  };

  loadSong = async (prevSongID?: string) => {
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
      autoplay: prevSongID != null,
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
        duration: Number(currSong.duration || 1),
        artwork: currSong.thumbnail.url
        // description: '', // Android Only
        // color: 0xFFFFFF, // Notification Color - Android Only
        // date: '1983-01-02T00:00:00Z', // Release Date (RFC 3339) - Android Only
        // rating: 84, // Android Only (Boolean or Number depending on the type)
      });
    }

    // Update progress once loaded
    this.setState({
      progress: {
        currentTime: 0,
        playableDuration: 0,
        seekableDuration: Number(currSong.duration || 1)
      }
    });
  };

  componentDidMount() {
    this.loadSong();
  }

  componentDidUpdate(prevProps: Props) {
    this.loadSong(prevProps.currSong?.id);

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
      this.setState(s => ({
        loading: true,
        progress: {
          ...s.progress,
          // Eagerly set new position to immediately update slider
          currentTime: seek
        }
      }));
      this.player.current.seek(seek);
    }
  };

  onProgress = (progress: OnProgressData) => {
    this.setState({
      progress
    });
  };

  onLoad = () => {
    this.setState({
      paused: !this.state.autoplay,
      loading: false
    });
  };

  onFinishedSeek = () => {
    this.setState({
      loading: false
    });
  };

  onEnd = () => {
    this.setState({
      paused: true
    });
    this.onSeek(0);
    this.props.skipNext();
  };

  renderHeader = () => {
    const { currSong } = this.props;
    const { loading, paused, progress } = this.state;

    if (currSong == null) {
      return null;
    }

    return (
      <PlaybackHeader
        currSong={currSong}
        loading={loading}
        paused={paused}
        progress={progress}
        setPaused={this.setPaused}
      />
    );
  };

  renderContent = () => {
    const { currSong } = this.props;

    if (currSong == null) {
      return null;
    }

    return <PlaybackContent currSong={currSong} />;
  };

  renderFooter = () => {
    const { paused, progress } = this.state;
    return (
      <PlaybackFooter
        paused={paused}
        progress={progress}
        onSeek={this.onSeek}
        setPaused={this.setPaused}
      />
    );
  };

  render() {
    const { currSong, tab, repeat } = this.props;
    const { src, paused } = this.state;

    if (currSong == null) {
      return null;
    }

    return (
      <View style={styles.container}>
        {src !== '' && (
          <Video
            source={{ uri: src }}
            ref={this.player}
            repeat={repeat}
            playInBackground
            paused={paused}
            onLoad={this.onLoad}
            onSeek={this.onFinishedSeek}
            onProgress={this.onProgress}
            onEnd={this.onEnd}
          />
        )}
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
    currSong: curr != null ? songs[curr] ?? cache[curr]?.song : null,
    repeat: state.playback.repeat
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
