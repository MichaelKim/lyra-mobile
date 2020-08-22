import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Colors } from '../../../constants';
import { Shuffle } from '../../../icons';
import { Action, StoreState } from '../../../types';
import { formatDuration } from '../../../util';
import Slider from '../../slider';
import Controls from './controls';
import { h4 } from '../../../styles';
import { OnProgressData } from 'react-native-video';

interface Props {
  paused: boolean;
  shuffle: boolean;
  progress: OnProgressData;
  onSeek: (seek: number) => void;
  setPaused: (paused: boolean) => void;
  skipPrevious: () => void;
  skipNext: () => void;
  setShuffle: (shuffle: boolean) => void;
}

class Footer extends React.Component<Props> {
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

  toggleShuffle = () => {
    this.props.setShuffle(!this.props.shuffle);
  };

  render() {
    const {
      paused,
      shuffle,
      progress,
      onSeek,
      setPaused,
      skipNext
    } = this.props;

    return (
      <View style={styles.playback}>
        <Slider
          value={progress.currentTime}
          loaded={progress.playableDuration}
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
            setPaused={setPaused}
            onDeltaSeek={this.onDeltaSeek}
            onSeek={onSeek}
          />
          <View style={styles.buttonsRight}>
            <TouchableOpacity onPress={this.toggleShuffle}>
              <Shuffle width={30} height={30} fillOpacity={shuffle ? 1 : 0.5} />
            </TouchableOpacity>
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
  playback: {
    backgroundColor: Colors.controls,
    height: 80,
    flexDirection: 'column'
  },
  timeBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10
  },
  time: h4,
  controls: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
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

export default connect(mapState, mapDispatch)(Footer);
