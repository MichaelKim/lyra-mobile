import React from 'react';
import { StyleSheet } from 'react-native';
import { h2 } from '../../../styles';
import Row from '../../row';

type Props = {
  artist: string;
  numSongs: number;
  onSelect?: (artist: string) => void;
};

const ArtistItem = ({ artist, numSongs, onSelect }: Props) => {
  const onItemPress = () => onSelect?.(artist);

  const name = artist || 'Unknown Artist';
  const subtitle = `${numSongs} ${numSongs === 1 ? 'song' : 'songs'}`;

  return (
    <Row
      title={name}
      subtitle={subtitle}
      onPress={onItemPress}
      titleStyle={styles.name}
    />
  );
};

const styles = StyleSheet.create({
  name: h2
});

export default React.memo(ArtistItem);
