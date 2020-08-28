import React from 'react';
import { View, Image, ImageStyle, StyleSheet } from 'react-native';
import { Cover } from '../icons';

interface Props {
  src?: string;
  style?: ImageStyle;
}

const Thumbnail = ({ src, style }: Props) => {
  if (src != null) {
    return <Image style={[styles.thumbnail, style]} source={{ uri: src }} />;
  }

  return (
    <View style={[styles.thumbnail, style]}>
      <Cover width="100%" height="100%" />
    </View>
  );
};

const styles = StyleSheet.create({
  thumbnail: {
    resizeMode: 'contain',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default Thumbnail;
