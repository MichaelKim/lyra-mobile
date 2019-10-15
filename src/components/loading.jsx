// @flow strict

import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import colors from '../colors';

const Loading = () => {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color={colors.border} />
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
