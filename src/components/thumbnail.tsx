import React from 'react';
import { Image, ImageStyle, StyleSheet, View } from 'react-native';
import { Cover } from '../icons';
import { Thumbnail as ThumbnailType } from '../types';

type Props = {
  src: ThumbnailType;
  style?: ImageStyle;
};

const Thumbnail = ({ src, style }: Props) => {
  const [ratio, setRatio] = React.useState<number>(1);

  if (src.url) {
    Image.getSize(src.url, (width, height) => {
      setRatio(width / height);
    });

    return (
      <Image
        style={[styles.thumbnail, { aspectRatio: ratio }, style]}
        source={{ uri: src.url }}
      />
    );
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
    justifyContent: 'center',
    aspectRatio: 1
  }
});

export default Thumbnail;
