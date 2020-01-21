import u from 'updeep';
import { initialState } from './storage';

import { SongID, StoreState, Action, SortType, QueueType } from '../types';

const MAX_QUEUE_SIZE = 50;

// Removes ids from cache
function cleanCache(ids: Array<SongID>, cache: QueueType['cache']) {
  return ids.reduce((acc, id) => {
    // Missing id
    if (cache[id] == null) {
      return cache;
    }
    // Only one left, remove from cache
    if (cache[id].count === 1) {
      return u.omit(id, cache) as QueueType['cache'];
    }
    // Decrease count
    return u(
      {
        [id]: {
          count: cache[id].count - 1
        }
      },
      cache
    ) as QueueType['cache'];
  }, cache);
}

export default function rootReducer(
  state: StoreState = initialState,
  action: Action
): StoreState {
  switch (action.type) {
    case 'LOAD_STORAGE':
      return {
        loaded: true,
        ...action.state
      };

    case 'SELECT_SONG': {
      const { id } = action.song;
      const { queue } = state;

      // Clean cache
      const cache = cleanCache(queue.next, queue.cache);

      const newQueue = {
        prev:
          queue.curr != null
            ? [...queue.prev, queue.curr].slice(-MAX_QUEUE_SIZE)
            : queue.prev,
        curr: id,
        next: [],
        cache:
          queue.prev.length >= MAX_QUEUE_SIZE
            ? cleanCache([queue.prev[0]], cache)
            : cache
      };

      if (state.songs[id] != null) {
        return {
          ...state,
          queue: newQueue
        };
      }

      if (queue.cache[id] != null) {
        return {
          ...state,
          queue: u(
            {
              cache: {
                [id]: {
                  count: state.queue.cache[id].count + 1
                }
              }
            },
            newQueue
          ) as QueueType
        };
      }

      return {
        ...state,
        queue: u(
          {
            cache: {
              [id]: {
                song: action.song,
                count: 1
              }
            }
          },
          newQueue
        ) as QueueType
      };
    }

    case 'SELECT_PLAYLIST':
      return u(
        {
          currScreen: action.id
        },
        state
      ) as StoreState;

    case 'ADD_SONGS': {
      const newSongs = action.songs.reduce((acc: StoreState['songs'], song) => {
        return u(
          {
            [song.id]: song
          },
          acc
        ) as StoreState['songs'];
      }, state.songs);

      // Remove songs from cache
      const songIDs = action.songs.map(s => s.id);
      const cache = cleanCache(songIDs, state.queue.cache);

      return {
        ...state,
        songs: newSongs,
        queue: {
          ...state.queue,
          cache
        }
      };
    }

    case 'REMOVE_SONG': {
      const { queue, songs } = state;
      if (songs[action.id] == null) {
        return state;
      }

      // Clean cache
      const cache = cleanCache([action.id], queue.cache);

      return {
        ...state,
        songs: u.omit(action.id, songs) as StoreState['songs'],
        queue: {
          prev: queue.prev.filter(p => p !== action.id),
          curr: queue.curr === action.id ? null : action.id,
          next: queue.next.filter(p => p !== action.id),
          cache
        }
      };
    }

    case 'CREATE_PLAYLIST':
      return u(
        {
          playlists: {
            [action.playlist.id]: action.playlist
          }
        },
        state
      ) as StoreState;

    case 'DELETE_PLAYLIST': {
      const playlist = state.playlists[action.id];
      if (playlist == null) {
        return state;
      }

      const songs = state.songs;

      playlist.songs.forEach(id => {
        const index = songs[id].playlists.indexOf(action.id);
        if (index !== -1) songs[id].playlists.splice(index, 1);
      });

      if (state.currScreen === action.id) {
        return u(
          {
            playlists: u.omit(action.id),
            songs,
            currScreen: null
          },
          state
        ) as StoreState;
      }

      return u(
        {
          playlists: u.omit(action.id),
          songs
        },
        state
      ) as StoreState;
    }

    case 'SET_PLAYLISTS': {
      const { sid, pids } = action;
      const song = state.songs[sid];

      // Invalid song ID
      if (song == null) {
        return state;
      }

      for (let pid of pids) {
        // Invalid playlist ID
        if (state.playlists[pid] == null) {
          return state;
        }
      }

      return u(
        {
          songs: {
            [sid]: {
              playlists: pids
            }
          }
        },
        state
      ) as StoreState;
    }

    case 'CHANGE_VOLUME': {
      return u(
        {
          volume: {
            amount: Math.max(Math.min(action.volume, 1), 0)
          }
        },
        state
      ) as StoreState;
    }

    case 'MUTE': {
      return u(
        {
          volume: {
            muted: action.muted
          }
        },
        state
      ) as StoreState;
    }

    case 'SKIP_PREVIOUS': {
      const { queue } = state;
      const { prev, curr, next } = queue;
      if (curr == null) {
        // Nothing playing right now
        return state;
      }

      if (prev.length === 0) {
        return state;
      }

      return u(
        {
          queue: {
            prev: prev.slice(0, -1),
            curr: prev[prev.length - 1],
            next: [curr, ...next]
          }
        },
        state
      ) as StoreState;
    }

    case 'SKIP_NEXT': {
      const { queue } = state;
      const { prev, curr, next } = queue;

      // Middleware: queues song if next is empty
      if (next.length === 0) {
        return state;
      }

      // Clean cache
      const cache =
        prev.length >= MAX_QUEUE_SIZE
          ? cleanCache([prev[0]], queue.cache)
          : queue.cache;

      return {
        ...state,
        queue: {
          prev: curr == null ? prev : [...prev, curr].slice(-MAX_QUEUE_SIZE),
          curr: next[0],
          next: next.slice(1),
          cache
        }
      };
    }

    case 'UPDATE_TAGS': {
      const song = Object.values(state.songs).find(s => s.id === action.id);
      if (song == null) {
        return state;
      }

      return u(
        {
          songs: {
            [song.id]: {
              title: action.title,
              artist: action.artist
            }
          }
        },
        state
      ) as StoreState;
    }

    case 'SET_SORT': {
      const sort: SortType = {
        column: action.column,
        direction: action.direction
      };
      return u(
        {
          sort
        },
        state
      ) as StoreState;
    }

    case 'SET_SHUFFLE': {
      return u(
        {
          shuffle: action.shuffle
        },
        state
      ) as StoreState;
    }

    case 'QUEUE_SONG': {
      const { song } = action;
      const next = [...state.queue.next, song.id];

      // Song in library
      if (state.songs[song.id] != null) {
        return u(
          {
            queue: {
              next
            }
          },
          state
        ) as StoreState;
      }

      // Song in cache
      if (state.queue.cache[song.id] != null) {
        return u(
          {
            queue: {
              next,
              cache: {
                [song.id]: {
                  count: state.queue.cache[song.id].count + 1
                }
              }
            }
          },
          state
        ) as StoreState;
      }

      // Add to cache
      return u(
        {
          queue: {
            next,
            cache: {
              [song.id]: {
                song,
                count: 1
              }
            }
          }
        },
        state
      ) as StoreState;
    }

    case 'ADD_TO_HISTORY': {
      const cache = new Set<string>();
      // Remove duplicates and limit to 50
      const history = [action.search, ...state.history]
        .filter(str => {
          if (cache.has(str)) return false;
          cache.add(str);
          return true;
        })
        .slice(0, MAX_QUEUE_SIZE);
      return {
        ...state,
        history
      };
    }

    case 'REMOVE_FROM_HISTORY': {
      const idx = state.history.indexOf(action.search);
      const history = state.history.slice();
      history.splice(idx, 1);
      return {
        ...state,
        history
      };
    }

    case 'DOWNLOAD_ADD': {
      return u(
        {
          dlQueue: [...state.dlQueue, action.id]
        },
        state
      ) as StoreState;
    }

    case 'DOWNLOAD_PROGRESS': {
      return u(
        {
          dlProgress: action.progress
        },
        state
      ) as StoreState;
    }

    case 'DOWNLOAD_FINISH': {
      if (action.song == null) {
        return u(
          {
            dlQueue: state.dlQueue.slice(1),
            dlProgress: 0
          },
          state
        ) as StoreState;
      }

      return u(
        {
          songs: {
            [action.song.id]: action.song
          },
          dlQueue: state.dlQueue.slice(1),
          dlProgress: 0
        },
        state
      ) as StoreState;
    }

    case 'CLEAR_DATA':
      return u(
        {
          loaded: true
        },
        initialState
      ) as StoreState;

    default:
      unreachable(action);
      return state;
  }
}

function unreachable(_: never) {}
