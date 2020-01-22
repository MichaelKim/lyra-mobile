import { Platform } from 'react-native';
import MusicFiles from 'react-native-get-music-files';
import Permissions from 'react-native-permissions';

import { createID, getFileName } from './node';

import { Song, SongID, SortType } from './types';

export function fileExists(_: string) {
  return false;
}

export async function getSongs(): Promise<Song[]> {
  if (Platform.OS === 'android') {
    const result = await Permissions.request(
      Permissions.PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
    );

    if (result !== Permissions.RESULTS.GRANTED) {
      return [];
    }
  }

  const tracks = await MusicFiles.getAll({
    title: true,
    artist: true,
    duration: true,
    fields: ['title', 'artist', 'duration']
  });

  const songs: Array<Song> = tracks.map(track => ({
    id: createID(track.path),
    title: track.title || getFileName(track.path),
    artist: track.author || '',
    duration: track.duration / 1000,
    source: 'LOCAL',
    filepath: track.path,
    playlists: [],
    date: Date.now()
  }));

  return songs;
}

export function getSongList(
  songs: { [ID in SongID]: Song },
  playlist: string | null | undefined,
  sort?: SortType
): Array<Song> {
  const songlist = Object.values(songs);
  const filtered =
    playlist != null
      ? songlist.filter(song => song.playlists.includes(playlist))
      : songlist;

  if (sort == null) {
    return filtered;
  }

  const sorted = filtered.sort((a, b) => {
    switch (sort.column) {
      case 'TITLE':
        return spaceship(a.title, b.title);
      case 'ARTIST':
        return spaceship(a.artist, b.artist);
      case 'DURATION':
        return spaceship(a.duration, b.duration);
      default:
        return spaceship(a.date, b.date);
    }
  });

  if (sort.direction) {
    return sorted.reverse();
  }

  return sorted;
}

// @ts-ignore
function spaceship(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function formatDuration(duration: number) {
  const min = Math.floor(duration / 60);
  const sec = String(Math.floor(duration % 60)).padStart(2, '0');
  return `${min}:${sec}`;
}

// Format: PT1H2M34S
export function parseDuration(iso: string) {
  const matches = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (matches == null) {
    return 0;
  }

  return (
    Number(matches[1] || 0) * 3600 +
    Number(matches[2] || 0) * 60 +
    Number(matches[3] || 0)
  );
}

// As of 2019, the most viewed YouTube video has ~6B views.
// This method works up to billions, and should be enough.
export function readableViews(viewCount: number) {
  const length = Math.floor(Math.log10(viewCount));

  if (length < 3) return viewCount;
  if (length < 6)
    return (
      Math.floor(viewCount / Math.pow(10, length - 2)) /
        Math.pow(10, 5 - length) +
      'K'
    );
  if (length < 9)
    return (
      Math.floor(viewCount / Math.pow(10, length - 2)) /
        Math.pow(10, 8 - length) +
      'M'
    );
  return (
    Math.floor(viewCount / Math.pow(10, length - 2)) /
      Math.pow(10, 11 - length) +
    'B'
  );
}

interface Shortcuts {
  [key: string]: () => void;
}

export function registerShortcuts(_: Shortcuts) {}

export function removeShortcuts(_: Shortcuts) {}

export function selectLocalDir(): Array<string> | null {
  return null;
}
