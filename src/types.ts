import { Dispatch, MiddlewareAPI, Store as ReduxStore } from 'redux';

export type SongID = string;
export type PlaylistID = string;

interface SongShared {
  id: SongID; // hash of filepath or url
  title: string; // metadata title
  artist: string;
  duration: number;
  playlists: PlaylistID[];
  date: number;
}

export interface LocalSong extends SongShared {
  source: 'LOCAL';
  filepath: string;
}

export interface VideoSong extends SongShared {
  source: 'YOUTUBE';
  url: SongID;
  views: number;
  thumbnail: Thumbnail;
}

export type Song = LocalSong | VideoSong;

interface Thumbnail {
  width: number;
  height: number;
  url: string;
}

export interface Playlist {
  id: PlaylistID; // timestamp
  name: string;
  songs: SongID[];
}

export interface Metadata {
  title: string;
  artist: string;
  duration: number;
}

export type SortColumn = 'TITLE' | 'ARTIST' | 'DURATION' | 'DATE';

export interface SortType {
  column: SortColumn;
  direction: boolean;
}

export interface NavigationProps {
  navigation: {
    navigate: (screenName: string) => void;
    getParam: <T>(paramName: string, defaultValue: T) => T;
  };
}

// Redux types
export type Store = ReduxStore<StoreState, Action>;

export interface QueueType {
  prev: SongID[];
  curr: SongID | null;
  next: SongID[];
  cache: { [ID in SongID]: { song: Song; count: number } };
}

export interface StoreState {
  loaded: boolean;
  currScreen?: string | null;
  songs: { [ID in SongID]: Song };
  playlists: { [ID in PlaylistID]: Playlist };
  volume: { amount: number; muted: boolean };
  sort: SortType;
  shuffle: boolean;
  queue: QueueType;
  history: string[]; // Search history
  dlQueue: SongID[]; // Queue of downloading videos
  dlProgress: number;
}

export interface Middleware {
  (api: MiddlewareAPI<Dispatch, StoreState>): (
    next: Dispatch<Action>
  ) => (action: Action) => Action;
}

export type Action =
  | {
      type: 'LOAD_STORAGE';
      state: StoreState;
    }
  | {
      type: 'SELECT_SONG';
      song: Song;
    }
  | {
      type: 'SELECT_PLAYLIST';
      id: string | null;
    }
  | {
      type: 'ADD_SONGS';
      songs: Song[];
    }
  | {
      type: 'REMOVE_SONG';
      id: SongID;
    }
  | {
      type: 'CREATE_PLAYLIST';
      playlist: Playlist;
    }
  | {
      type: 'DELETE_PLAYLIST';
      id: PlaylistID;
    }
  | {
      type: 'SET_PLAYLISTS';
      sid: SongID;
      pids: PlaylistID[];
    }
  | {
      type: 'CHANGE_VOLUME';
      volume: number;
    }
  | {
      type: 'MUTE';
      muted: boolean;
    }
  | { type: 'SKIP_PREVIOUS' }
  | { type: 'SKIP_NEXT' }
  | {
      type: 'UPDATE_TAGS';
      id: SongID;
      title: string;
      artist: string;
    }
  | {
      type: 'SET_SORT';
      column: SortColumn;
      direction: boolean;
    }
  | {
      type: 'SET_SHUFFLE';
      shuffle: boolean;
    }
  | {
      type: 'QUEUE_SONG';
      song: Song;
    }
  | {
      type: 'ADD_TO_HISTORY';
      search: string;
    }
  | {
      type: 'REMOVE_FROM_HISTORY';
      search: string;
    }
  | {
      type: 'DOWNLOAD_ADD';
      id: SongID;
    }
  | {
      type: 'DOWNLOAD_PROGRESS';
      progress: number;
    }
  | {
      type: 'DOWNLOAD_FINISH';
      song: Song | null;
    }
  | { type: 'CLEAR_DATA' };
