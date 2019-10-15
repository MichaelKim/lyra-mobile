// @flow strict

/*
  YouTube related utility methods

  Some of the packages that are used for YouTube integration
  require some setup before running (e.g. ffmpeg, googleapis).
  Moving all of them to this file helps centralize the setup
  code, and avoid duplication across the codebase.
*/

// import { setTags } from './util';

import type { SongID, VideoSong } from './types';

const SERVER_URL = '192.168.0.15:5000';

export async function getStreamURL(id: SongID): Promise<string> {
  const res = await fetch(`http://${SERVER_URL}/yt/url?id=${id}`);
  const url = res.text();
  return url;
}

async function ytQuery(options): Promise<VideoSong[]> {
  const res = await fetch(
    `http://${SERVER_URL}/yt/query?options=${JSON.stringify(options)}`
  );
  const json = res.json();
  return json;
}

export async function ytSearch(keyword: string): Promise<VideoSong[]> {
  return ytQuery({
    q: keyword
  });
}

export async function getRelatedVideos(id: SongID): Promise<VideoSong[]> {
  // return ytQuery({
  //   relatedToVideoId: id
  // });

  // Alternative using ytdl
  const res = await fetch(`http://${SERVER_URL}/yt/related?id=${id}`);
  const videos = res.json();
  return videos;
}
