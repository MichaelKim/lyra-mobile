import { MiddlewareAPI, Dispatch, Store as ReduxStore } from 'redux';

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

export interface Tags {
  title: string;
  artist: string;
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

// Redux types
export type Store = ReduxStore<StoreState, Action>;

export interface StoreState {
  loaded: boolean;
  currSong?: Song;
  currScreen?: string | null | undefined;
  songs: { [ID in SongID]: Song };
  playlists: { [ID in PlaylistID]: Playlist };
  volume: number;
  sort: SortType;
  shuffle: boolean;
  nextSong: Song | null; // Only for YouTube
  dlQueue: SongID[]; // Queue of downloading videos
  dlProgress: number;
}

export interface Middleware {
  (api: MiddlewareAPI<Dispatch, StoreState>): (
    next: Dispatch<Action>
  ) => (action: Action) => Action;
}

export type Action =
  | { type: 'LOAD_STORAGE'; state: StoreState }
  | { type: 'SELECT_SONG'; song: Song }
  | { type: 'SELECT_PLAYLIST'; id: string | null }
  | { type: 'ADD_SONGS'; songs: Song[] }
  | { type: 'REMOVE_SONG'; id: SongID }
  | { type: 'CREATE_PLAYLIST'; playlist: Playlist }
  | { type: 'DELETE_PLAYLIST'; id: PlaylistID }
  | { type: 'SET_PLAYLISTS'; sid: SongID; pids: PlaylistID[] }
  | { type: 'CHANGE_VOLUME'; volume: number }
  | { type: 'SKIP_PREVIOUS' }
  | { type: 'SKIP_NEXT' }
  | { type: 'UPDATE_TAGS'; id: SongID; title: string; artist: string }
  | { type: 'SET_SORT'; column: SortColumn; direction: boolean }
  | { type: 'SET_SHUFFLE'; shuffle: boolean }
  | { type: 'SET_NEXT_SONG'; song: Song }
  | { type: 'DOWNLOAD_ADD'; id: SongID }
  | { type: 'DOWNLOAD_PROGRESS'; progress: number }
  | { type: 'DOWNLOAD_FINISH'; song: Song | null }
  | { type: 'CLEAR_DATA' };
