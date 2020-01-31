import React from 'react';
import { StyleSheet, View } from 'react-native';

import BottomSheet from './sheet';

interface Props {
  renderHeader: () => React.ReactNode;
  renderContent: () => React.ReactNode;
  renderFooter: () => React.ReactNode;
}

interface IState {
  headerHeight: number;
  containerHeight: number;
}

function throttle(callback: () => void, limit: number) {
  let wait = false;
  let tid: NodeJS.Timer | null = null;
  return {
    call: () => {
      if (wait) return;
      callback();
      wait = true;
      tid = setTimeout(() => {
        wait = false;
      }, limit);
    },
    stop: () => {
      tid && clearTimeout(tid);
    }
  };
}

export default class BottomSheetContainer extends React.Component<
  Props,
  IState
> {
  ref = React.createRef<View>();
  state = {
    headerHeight: 0,
    containerHeight: 0
  };

  updateHeight = throttle(() => {
    if (this.ref.current == null) {
      return;
    }
    this.ref.current.measure((x, y, w, h, px, py) => {
      console.log('measure:', h, py);
      if (
        (h && py && h !== this.state.headerHeight) ||
        py !== this.state.containerHeight
      ) {
        this.setState({
          headerHeight: h,
          containerHeight: py
        });
      }
    });
  }, 100);

  componentDidMount() {
    // Wait for render
    setTimeout(() => this.updateHeight.call(), 0);
  }

  onLayout = () => {
    setTimeout(() => this.updateHeight.call(), 0);
  };

  componentWillUnmount() {
    this.updateHeight.stop();
  }

  render() {
    const { headerHeight, containerHeight } = this.state;
    return (
      <View ref={this.ref} style={styles.root} onLayout={this.onLayout}>
        <View
          style={[
            styles.box,
            {
              top: -containerHeight,
              height: headerHeight + containerHeight
            }
          ]}>
          <BottomSheet {...this.props} {...this.state} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'black',
    flex: 1
  },
  box: {
    overflow: 'hidden',
    position: 'absolute',
    left: 0,
    right: 0
  }
});
