import { SongID, VideoSong } from './types';

import { f } from './state/store';

export async function getStreamURL(id: SongID): Promise<string> {
  const res = await f(`/yt/url?id=${id}`);
  const url = await res.text();
  return url;
}

// Mock EventEmitter for browser
class DownloadEventEmitter {
  on(key: string, callback: (arg?: any) => void) {
    callback();
    return this;
  }
}

export function downloadVideo(_: string) {
  const emitter = new DownloadEventEmitter();
  return emitter;
}

export async function ytSearch(keyword: string): Promise<VideoSong[]> {
  const res = await f(`/yt/search?query=${keyword}`);
  const json = res.json();
  return json;
}

export async function getRelatedVideos(id: SongID): Promise<VideoSong[]> {
  const res = await f(`/yt/related?id=${id}`);
  const videos = res.json();
  return videos;
}

export async function ytSuggest(keyword: string) {
  if (!keyword) return [];

  const res = await f(`/yt/suggest?query=${keyword}`);
  const json = res.json();
  return json;
}
