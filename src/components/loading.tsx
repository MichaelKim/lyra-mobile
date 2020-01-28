import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Colors } from '../constants';

const Loading = () => {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color={Colors.lightborder} />
    </View>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center'
  }
});

export default Loading;
