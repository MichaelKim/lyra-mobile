import React from 'react';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { useDispatch } from '../../../hooks';
import { VideoSong } from '../../../types';
import { getRelatedVideos } from '../../../yt-util';
import Loading from '../../loading';
import YtItem from '../../yt-item';

interface Props {
  currSong: VideoSong;
}

const useRelated = (currSong: VideoSong) => {
  const [related, setRelated] = React.useState<Array<VideoSong>>([]);

  React.useEffect(() => {
    let isMounted = true;
    setRelated([]);

    if (currSong.source === 'YOUTUBE') {
      getRelatedVideos(currSong.id).then(relatedVideos => {
        if (isMounted) {
          setRelated(relatedVideos);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [currSong]);

  return related;
};

const Related = ({ currSong }: Props) => {
  const dispatch = useDispatch();
  const selectSong = React.useCallback(
    (song: VideoSong) => dispatch({ type: 'SELECT_SONG', song }),
    [dispatch]
  );

  const related = useRelated(currSong);
  if (related.length === 0) {
    return <Loading />;
  }

  return (
    <>
      {related.map(video => (
        <TouchableHighlight key={video.id} onPress={() => selectSong(video)}>
          <YtItem video={video} />
        </TouchableHighlight>
      ))}
    </>
  );
};

export default React.memo(Related);
