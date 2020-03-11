import React from 'react';
import { useDispatch } from '../../../hooks';
import { VideoSong } from '../../../types';
import { getRelatedVideos } from '../../../yt-util';
import Loading from '../../loading';
import YtItem from '../../yt-item';

interface Props {
  currSong: VideoSong;
}

const useRelated = ({ source, id }: VideoSong) => {
  const [related, setRelated] = React.useState<Array<VideoSong>>([]);

  React.useEffect(() => {
    let isMounted = true;
    setRelated([]);

    if (source === 'YOUTUBE') {
      getRelatedVideos(id).then(relatedVideos => {
        if (isMounted) {
          setRelated(relatedVideos);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [source, id]);

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
        <YtItem
          key={video.id}
          video={video}
          onPress={() => selectSong(video)}
        />
      ))}
    </>
  );
};

export default React.memo(Related);
