import React from 'react';
import { TouchableHighlight } from 'react-native';

import Loading from '../loading';
import YtItem from '../yt-item';
import { getRelatedVideos } from '../../yt-util';

import { useDispatch } from '../../hooks';
import { VideoSong } from '../../types';

interface Props {
  currSong: VideoSong;
}

const Related = ({ currSong }: Props) => {
  const [related, setRelated] = React.useState<Array<VideoSong>>([]);
  const dispatch = useDispatch();
  const selectSong = (song: VideoSong) =>
    dispatch({ type: 'SELECT_SONG', song });

  React.useEffect(() => {
    if (currSong && currSong.source === 'YOUTUBE') {
      getRelatedVideos(currSong.id).then(relatedVideos => {
        setRelated(relatedVideos);
      });
    }
  }, [currSong]);

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

export default Related;
