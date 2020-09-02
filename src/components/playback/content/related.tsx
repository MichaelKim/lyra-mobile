import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch } from '../../../hooks';
import { h2 } from '../../../styles';
import { VideoSong } from '../../../types';
import { getRelatedVideos } from '../../../yt-util';
import Loading from '../../loading';
import YtItem from '../../yt-item';

type Props = {
  currSong: VideoSong;
};

function useRelated({ id }: VideoSong) {
  const [related, setRelated] = React.useState<Array<VideoSong>>([]);

  React.useEffect(() => {
    let isMounted = true;

    setRelated([]);
    getRelatedVideos(id).then(relatedVideos => {
      if (isMounted) {
        setRelated(relatedVideos);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [id]);

  return related;
}

const Related = ({ currSong }: Props) => {
  const dispatch = useDispatch();
  const selectSong = (song: VideoSong) => {
    dispatch({ type: 'SELECT_SONG', song });
  };

  const related = useRelated(currSong);

  return (
    <View>
      <Text style={styles.header}>Related Videos</Text>
      {related.length === 0 ? (
        <Loading />
      ) : (
        related.map(r => (
          <YtItem key={r.id} video={r} onPress={() => selectSong(r)} />
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    ...h2,
    marginVertical: 8
  }
});

export default Related;
