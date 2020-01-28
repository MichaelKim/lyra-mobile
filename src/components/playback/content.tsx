import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import Controls from './controls';
import Playing from './playing';
import Slider from '../slider';
import { Shuffle } from '../../icons';

import { Colors } from '../../constants';
import { formatDuration } from '../../util';
import { Song, StoreState, Action } from '../../types';

interface Props {
  paused: boolean;
  currSong: Song;
  shuffle: boolean;
  progress: {
    currentTime: number;
    playableDuration: number;
    seekableDuration: number;
  };
  onSeek: (seek: number) => void;
  togglePause: () => void;
  skipPrevious: () => void;
  skipNext: () => void;
  setShuffle: (shuffle: boolean) => void;
}

class PlaybackContent extends React.Component<Props> {
  skipPreviousOrStart = () => {
    this.props.onSeek(0);
    if (this.props.progress.currentTime < 3) {
      this.props.skipPrevious();
    }
  };

  skipNext = () => {
    this.props.onSeek(0);
    this.props.skipNext();
  };

  onDeltaSeek = (delta: number) => {
    this.props.onSeek(this.props.progress.currentTime + delta);
  };

  render() {
    const {
      paused,
      shuffle,
      currSong,
      progress,
      onSeek,
      togglePause,
      skipNext,
      setShuffle
    } = this.props;

    return (
      <View style={styles.root}>
        <View style={styles.thumbnail}>
          {currSong.source === 'YOUTUBE' ? (
            <Playing currSong={currSong} />
          ) : (
            <>
              <Text>{currSong.title}</Text>
              <Text>{currSong.artist}</Text>
            </>
          )}
        </View>
        <View style={styles.playback}>
          <Slider
            value={progress.currentTime}
            max={progress.seekableDuration}
            onChange={onSeek}
          />
          <View style={styles.timeBar}>
            <Text style={styles.time}>
              {formatDuration(progress.currentTime)}
            </Text>
            <Text style={styles.time}>
              {formatDuration(progress.seekableDuration)}
            </Text>
          </View>
          <View style={styles.controls}>
            <View style={styles.buttonsLeft} />
            <Controls
              paused={paused}
              skipPrevious={this.skipPreviousOrStart}
              skipNext={skipNext}
              togglePause={togglePause}
              onDeltaSeek={this.onDeltaSeek}
              onSeek={onSeek}
            />
            <View style={styles.buttonsRight}>
              <TouchableOpacity onPress={() => setShuffle(!shuffle)}>
                <Shuffle
                  width={30}
                  height={30}
                  fillOpacity={shuffle ? 1 : 0.5}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const mapState = (state: StoreState) => {
  return {
    shuffle: state.shuffle
  };
};

const mapDispatch = (dispatch: Dispatch<Action>) => ({
  skipPrevious: () => dispatch({ type: 'SKIP_PREVIOUS' }),
  skipNext: () => dispatch({ type: 'SKIP_NEXT' }),
  setShuffle: (shuffle: boolean) => dispatch({ type: 'SET_SHUFFLE', shuffle })
});

const styles = StyleSheet.create({
  root: {
    backgroundColor: Colors.screen,
    height: '100%'
  },
  thumbnail: {
    flex: 1
  },
  playback: {
    backgroundColor: '#555',
    height: 70,
    flexDirection: 'column'
  },
  timeBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10
  },
  time: {
    fontSize: 12,
    color: Colors.text
  },
  controls: {
    flexDirection: 'row'
  },
  buttonsLeft: {
    flex: 1
  },
  buttonsRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
});

// eslint-disable-next-line prettier/prettier
export default connect(mapState, mapDispatch)(PlaybackContent);
